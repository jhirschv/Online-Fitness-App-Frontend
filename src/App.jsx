import Programs from './_root/pages/Programs';
import Train from './_root/pages/Train';
import PrivateRoute from './utils/PrivateRoute'
import useDisableZoom from './utils/useDisableZoom';
import CreateProgram from './_root/removedPages/CreateProgram';
import Clients from './_root/removedPages/Clients';
import Progress from './_root/pages/Progress';
import Chat from './_root/pages/Chat';
import Account from './_root/pages/Account';
import Workouts from './_root/pages/WorkoutList';
import SigninForm from './_auth/SigninForm';
import SignupForm from './_auth/SignupForm';
import ExerciseLibrary from './_root/removedPages/ExerciseLibrary';
import RootLayout from './_root/RootLayout'
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from "@/components/theme-provider"
import Edit from './_root/pages/Edit';
import ProgramDetails from './_root/removedPages/ProgramDetails';
import PhaseDetails from './_root/pages/WorkoutList';
import WorkoutDetails from './_root/removedPages/WorkoutDetails';
import ProgramOverview from './_root/pages/ProgramOverview';
import WorkoutSession from './_root/pages/WorkoutSession';
import ClientProgress from './_root/pages/ClientProgress';
import Workout from './_root/pages/Workout'
import ChatSession from './_root/pages/ChatSession';
import React, { useState, useEffect, useContext } from 'react';
import apiClient from './services/apiClient';
import AuthContext from './context/AuthContext';


function App() {
  useDisableZoom();
  const { user } = useContext(AuthContext);
  const [loadingSessionDetails, setLoadingSessionDetails] = useState(true);
  const [programLoading, setProgramLoading] = useState(null)
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    if(user){
    apiClient.get(`/users/${user.user_id}/`)
        .then(response => {
            setUserInfo(response.data)
        })
        .catch(error => console.error('Error:', error));
      }
    }, []);

  //fetch active program and workouts
  const [activeProgram, setActiveProgram] = useState(null)
  const [workouts, setWorkouts] = useState([])
  useEffect(() => {
    if(user){
      setProgramLoading(true)
      apiClient.get('/get_active_program/') // Make sure the endpoint matches your Django URL configuration
      .then(response => {
          setActiveProgram(response.data); 
          setProgramLoading(false)
          const sortedWorkouts = response.data.workouts.sort((a, b) => a.order - b.order);
          setWorkouts(sortedWorkouts);
      })
      .catch(error => {
          console.error('Error fetching data:', error);
          setProgramLoading(false);
          setActiveProgram(null)
      });
    }
  }, []);

  const fetchActiveProgram = () => {
    setProgramLoading(true);
    apiClient.get('/get_active_program/') // Make sure the endpoint matches your Django URL configuration
        .then(response => {
            setActiveProgram(response.data);
            setProgramLoading(false);
            const sortedWorkouts = response.data.workouts.sort((a, b) => a.order - b.order);
            setWorkouts(sortedWorkouts);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setProgramLoading(false);
            setActiveProgram(null);
        });
};

    const [isActiveSession, setIsActiveSession] = useState(false);
    const [sessionDetails, setSessionDetails] = useState();
  
    const fetchSessionDetails = async () => {
      if(user){
      setLoadingSessionDetails(true);
      try {
          const response = await apiClient.get('/check_active_session/');
          if (response.data.active) {
              setIsActiveSession(true);
              setSessionDetails(response.data);
              console.log(response.data)
          } else {
              setIsActiveSession(false);
              setSessionDetails({}); // Clear session details as session is inactive
          }
      } catch (error) {
          console.error('Error fetching active session:', error);
          setIsActiveSession(false);
          setSessionDetails({}); // Clear session details on error
      } finally {
        setLoadingSessionDetails(false);  // End loading
      }
    }
  };

  useEffect(() => {
    fetchSessionDetails();
  }, []);

  //chat
  const [chatSessions, setChatSessions] = useState([]);

  const fetchUserChatSessions = async () => {
    if(user){
    try {
      const response = await apiClient.get('/user_chats/');
      const sessions = response.data;
      setChatSessions(sessions);
  } catch (error) {
      console.error('Error fetching chat sessions:', error);
  }
}
};

  useEffect(() => {
    fetchUserChatSessions();
}, []);

  const findMatchingSessionId = (sessions, currentUserId, otherUserId) => {
    console.log(sessions, currentUserId, otherUserId)
    return sessions.find(session => 
        session.participants.some(participant => participant.id === currentUserId) &&
        session.participants.some(participant => participant.id == otherUserId)
    );
  };

  const updateLastMessageInChatSessions = (message, sessionId) => {
    setChatSessions(prevSessions => prevSessions.map(session => {
        if (session.id === sessionId) {
            const now = new Date();
            const formattedMessage = {
                message: (message.sender === user.user_id ? "You: " : "") + message.content,
                timestamp: "Just now", 
                exact_time: now.toISOString()  
            };
            return {...session, last_message: formattedMessage};
        }
        return session;
    }));
  };
  
  const [webSocket, setWebSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState()
  const [receivedRequests, setReceivedRequests] = useState([]);
  

  useEffect(() => {
    if (!user) return;

    const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
    const wsURL = `${wsScheme}://train-io-9b748a5f64b5.herokuapp.com/ws/user/${user.user_id}/`;

    const ws = new WebSocket(wsURL);

    ws.onopen = () => console.log("WebSocket connection established.");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handling different types of messages based on their 'type'
      switch (data.type) {
        case 'message':

          let otherUserId;
            if (data.message.sender === user.user_id) {
                // If the current user is the sender, then the other user is the recipient
                otherUserId = data.message.recipient;
            } else {
                // Otherwise, the other user must be the sender
                otherUserId = data.message.sender;
            }

          // Update messages by appending to the correct user's message array
          setMessages(prevMessages => ({
            ...prevMessages,
            [otherUserId]: [
                ...(prevMessages[otherUserId] || []), // Use existing messages or start a new array if none exist
                data.message
            ]
          }));
          
          fetchUserChatSessions();

          break;
    
        case 'trainer-request-sent':
          
          // Handling new trainer requests
          setReceivedRequests(prev => [
            ...prev,
            {
              id: data.data.id, // Assuming the message includes the ID of the request
              from_user: data.data.from_user, // Assuming the message includes the ID of the user who sent the request
              to_user: data.data.to_user, // Assuming the message includes the ID of the recipient
              created_at: data.data.created_at, // Assuming the message includes the timestamp when the request was created
              is_active: true // Assuming new requests are active by default
            }
          ]);

          break;
        
          case 'trainer_request_accepted':
          case 'trainer_request_rejected':
            if (data.type === 'trainer_request_accepted' && data.data.to_user === user.user_id) {
              // Add to trainers if accepted and current user is the recipient
              setSelectedChat(prev => ({
                ...prev,
                trainers: [...prev.trainers, data.data.to_user]
              }));
            }
            break;
          
          case 'remove_client':
            setSelectedChat(prev => ({
              ...prev,
              clients: prev.clients.filter(clientId => clientId !== user.user_id)
          }));

          break;

          case 'remove_trainer':
            setSelectedChat(prev => ({
              ...prev,
              trainers: prev.trainers.filter(trainerId => trainerId !== user.user_id)
          }));
          break;
    
        default:
          console.warn('Received an unhandled message type:', data.type);
      }
    };
    
    setWebSocket(ws);  // Store WebSocket in state
    
    // Cleanup function to close WebSocket when component unmounts or user logs out
    return () => {
      ws.close();
    };

  }, [user]);  // Dependency on user ensures reconnection if the user changes

  const sendMessage = (input) => {
    if (input) {
      const messageObject = {
        type: 'message',
        senderId: user.user_id,
        recipientId: selectedChat.id,  // Make sure selectedChat is managed appropriately
        content: input.trim()
      };
      webSocket.send(JSON.stringify(messageObject));
    }
  };

  const sendTrainerRequestMessage = async () => {

    // Encrypt the message for the recipient
    const message = `${user.username} has requested to be your Trainer`;
  
    // Prepare the message object with both encrypted contents
    const messageObject = {
      senderId: user.user_id,
      recipientId: selectedChat.id,
      content: message
    };
    // Send the message via WebSocket
    webSocket.send(JSON.stringify(messageObject));
  }

  const sendRequestAcceptionMessage = async () => {
    // Encrypt the message for the recipient
    const message = `I've accepted your Trainer request!`;
  
    const messageObject = {
      senderId: user.user_id,
      recipientId: selectedChat.id,
      content: message
    };
  
    // Send the message via WebSocket
    webSocket.send(JSON.stringify(messageObject));
  
  }
  const [celebrate, setCelebrate] = useState(false);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route element={<RootLayout userInfo={userInfo} chatSessions={chatSessions}/>}>
            <Route element={<PrivateRoute />}>
              <Route path="account" element={<Account userInfo={userInfo} setUserInfo={setUserInfo}/>} />  
              <Route index element={<Train 
              activeProgram={activeProgram}
              setActiveProgram={setActiveProgram}
              workouts={workouts}
              setWorkouts={setWorkouts}
              sessionDetails={sessionDetails}
              isActiveSession={isActiveSession}
              fetchSessionDetails={fetchSessionDetails}
              loadingSessionDetails={loadingSessionDetails}
              programLoading={programLoading}
              celebrate={celebrate}
              setCelebrate={setCelebrate}
              />} />
              <Route path="/workoutSession" element={<WorkoutSession
              sessionDetails={sessionDetails}
              setSessionDetails={setSessionDetails}
              fetchSessionDetails={fetchSessionDetails}
              celebrate={celebrate}
              setCelebrate={setCelebrate}/>} />
              <Route path="/Progress" element={<Progress userInfo={userInfo}/>} />
              <Route path="/ClientProgress/:clientId" element={<ClientProgress />} />
              <Route path="/chat" element={<Chat sendMessage={sendMessage} messages={messages} setMessages={setMessages} chatSessions={chatSessions}
              setChatSessions={setChatSessions} fetchUserChatSessions={fetchUserChatSessions} selectedChat={selectedChat} setSelectedChat={setSelectedChat}
              sendTrainerRequestMessage={sendTrainerRequestMessage} sendRequestAcceptionMessage={sendRequestAcceptionMessage} webSocket={webSocket}
              receivedRequests={receivedRequests} setReceivedRequests={setReceivedRequests} />} />
            </Route>
          </Route>
          <Route path="/login" element={<SigninForm fetchSessionDetails={fetchSessionDetails} fetchActiveProgram={fetchActiveProgram}/>} />
          <Route path="/signup" element={<SignupForm fetchActiveProgram={fetchActiveProgram}/>} />
        </Routes>
    </ThemeProvider>
  )
}

export default App


{/* REMOVED ROUTES
<Route path="/programs/:programId" element={<ProgramDetails />} />
<Route path="/programs/phases/:phaseId" element={<PhaseDetails />} />
<Route path="/workout/:workoutId" element={<WorkoutDetails />} />
<Route path="/clients" element={<Clients />} />
<Route path="/exerciseLibrary" element={<ExerciseLibrary />} />
<Route path="/settings" element={<Settings />} /> */}