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
import Workout from './_root/pages/Workout'
import ChatSession from './_root/pages/ChatSession';
import React, { useState, useEffect, useContext } from 'react';
import apiClient from './services/apiClient';
import AuthContext from './context/AuthContext';


function App() {
  useDisableZoom();
  const { user } = useContext(AuthContext);
  const [loadingSessionDetails, setLoadingSessionDetails] = useState(true);
  const [programLoading, setProgramLoading] = useState(true)

  //fetch active program and workouts
  const [activeProgram, setActiveProgram] = useState(null)
  const [workouts, setWorkouts] = useState([])
  useEffect(() => {
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
      });
  }, [user]);

  //fetch user workout sessions
  const [userWorkoutSessions, setUserWorkoutSessions] = useState([])
  useEffect(() => {
    apiClient.get('/user_workout_sessions/')
        .then(response => {
            setUserWorkoutSessions(response.data)
            })
        
        .catch(error => console.error('Error:', error));
    }, [user]);
  
    const sendDataToParent = (childData) => {
      onDataReceive(childData);
    };

    const [isActiveSession, setIsActiveSession] = useState(false);
    const [sessionDetails, setSessionDetails] = useState();
  
    const fetchSessionDetails = async () => {
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
  };
  
    useEffect(() => {
      fetchSessionDetails();
      console.log("fetching session details")
    }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route element={<RootLayout />}>
            <Route element={<PrivateRoute />}>
              <Route path="account" element={<Account />} />  
              {/* <Route path="edit/:phaseId/:workoutId" element={<Edit />} />  
              <Route path='workout/:workoutId' element={<Workout />} />
              <Route path='programs' element={<Programs />} />       
              <Route path="workouts" element={<Workouts />} />       
              <Route path="/program_overview/:programId" element={<ProgramOverview />} /> */}
              <Route index element={<Train 
              activeProgram={activeProgram}
              setActiveProgram={setActiveProgram}
              workouts={workouts}
              setWorkouts={setWorkouts}
              userWorkoutSessions={userWorkoutSessions}
              sessionDetails={sessionDetails}
              isActiveSession={isActiveSession}
              fetchSessionDetails={fetchSessionDetails}
              loadingSessionDetails={loadingSessionDetails}
              programLoading={programLoading}
              />} />
              <Route path="/workoutSession" element={<WorkoutSession
              sessionDetails={sessionDetails}
              setSessionDetails={setSessionDetails}
              fetchSessionDetails={fetchSessionDetails}/>} />
              <Route path="/Progress" element={<Progress userWorkoutSessions={userWorkoutSessions}/>} />
              <Route path="/chat" element={<Chat />} >
                <Route path=":userId1/:userId2" element={<ChatSession />} />
              </Route>
            </Route>
          </Route>
          <Route path="/login" element={<SigninForm fetchSessionDetails={fetchSessionDetails}/>} />
          <Route path="/signup" element={<SignupForm />} />
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