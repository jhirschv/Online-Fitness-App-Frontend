import React from "react";
import { useContext, useRef } from 'react';
import AuthContext from '../../context/AuthContext';
import { useTheme } from "@/components/theme-provider";
import apiClient from '../../services/apiClient';
import { Outlet } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Check, Plus, Send } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faArrowUpRightFromSquare, faChevronLeft, faEllipsis, faDumbbell, faLock, faUserPlus, faArrowUpFromBracket, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useOutlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import sodium, { initCrypto } from '../../utils/crypto.js';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Toaster } from "@/components/ui/toaster"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

const Chat = ({sendMessage, messages, setMessages, chatSessions, setChatSessions, fetchUserChatSessions, 
  sendRequestAcceptionMessage, selectedChat, setSelectedChat, sendTrainerRequestMessage, webSocket, receivedRequests, setReceivedRequests}) => {
  const location = useLocation();
  const { theme } = useTheme();
  const backgroundColorClass = theme === "dark" ? "bg-popover" : "bg-secondary";
  const [users, setUsers] = useState([])
  let { user } = useContext(AuthContext)
  const { toast } = useToast()
  const navigate = useNavigate();

  const [input, setInput] = React.useState("");
  const inputLength = input.trim().length;

  useEffect(() => {
    fetchUserChatSessions();
  }, [])

  useEffect(() => {
    setInput("")
  }, [selectedChat])


  useEffect(() => {
    apiClient.get(`/users/`)
        .then(response => {
            const filteredUsers = response.data.filter(u => u.id !== user.user_id);
            setUsers(filteredUsers)
        })
        .catch(error => console.error('Error:', error));
    }, []);

  //const [webSocket, setWebSocket] = useState(null);

  const findMatchingSessionId = (sessions, currentUserId, otherUserId) => {
    return sessions.find(session => 
        session.participants.some(participant => participant.id === currentUserId) &&
        session.participants.some(participant => participant.id == otherUserId)
    );
  };

  const handleUserClick = (otherUser) => {
    setSelectedChat(otherUser);
    setIsPopoverOpen(false);
    setSearchTerm('');
    setSessionSearchTerm('');

    let sessionToUpdate; // Defined outside to ensure it's accessible later

    apiClient.get(`/chat/${otherUser.id}/`)
        .then(response => {
              setMessages(prevMessages => ({
                ...prevMessages,
                [otherUser.id]: response.data
            }));
            sessionToUpdate = findMatchingSessionId(chatSessions, user.user_id, otherUser.id);
            if (sessionToUpdate && !sessionToUpdate.last_message.read) {
                return markMessageAsRead(sessionToUpdate.last_message.id);
            }
        })
        .then(() => {
            // Ensure sessionToUpdate is defined before trying to update the state
            if (sessionToUpdate) {
                const updatedSessions = chatSessions.map(session => {
                    if (session.id === sessionToUpdate.id) {
                        const newSession = { ...session, last_message: { ...session.last_message, read: true }};
                        return newSession;
                    }
                    return session;
                });
                setChatSessions(updatedSessions);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setMessages([]);
        });
};


  /* useEffect(() => {
    console.log(selectedChat)
  }, [selectedChat]) */

  /* useEffect(() => {
    if (!selectedChat) return;

    console.log('ahhhh')

    const sortedIds = [user.user_id, selectedChat.id].sort();
    const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
    const wsURL = `${wsScheme}://localhost:8000/ws/chat/${sortedIds[0]}/${sortedIds[1]}/`;

    const ws = new WebSocket(wsURL);

    ws.onopen = () => console.log("WebSocket connection established.");
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data.message]);
        console.log(data.message)
        const sessionToUpdate = findMatchingSessionId(chatSessions, user.user_id, selectedChat.id);

        if (sessionToUpdate) {
            updateLastMessageInChatSessions(data.message, sessionToUpdate.id);
        }
    };
    
    setWebSocket(ws);  // Store WebSocket in state

    // Cleanup function to close WebSocket when component unmounts or selectedChat changes
    return () => {
        ws.close();
    };

}, [selectedChat, user.user_id]); */ 

const [searchTerm, setSearchTerm] = useState('');

const [isPopoverOpen, setIsPopoverOpen] = useState(false);

const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBackClick = (otherUser) => {
    console.log(otherUser.id)
    let sessionToUpdate = findMatchingSessionId(chatSessions, user.user_id, otherUser.id);
    console.log(sessionToUpdate)
            if (sessionToUpdate && !sessionToUpdate.last_message.read) {
                markMessageAsRead(sessionToUpdate.last_message.id);
                const updatedSessions = chatSessions.map(session => {
                    if (session.id === sessionToUpdate.id) {
                        const newSession = { ...session, last_message: { ...session.last_message, read: true }};
                        return newSession;
                    }
                    return session;
                });
                setChatSessions(updatedSessions);

            }
    setSelectedChat(null);
    setInput('')
    setMessages([]);
  }

  function truncateString(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  }

  function compactTimeFormat(timeString) {

    if(timeString) {
    // Handle the "Just now" case directly
    if (timeString === "Just now") {
        return timeString;
    }

    const parts = timeString.split(/\s+/);

    // Handle potential parsing issues
    if (parts.length !== 2) return timeString;

    const number = parseInt(parts[0], 10);
    const unit = parts[1];

    // Return original if parsing fails
    if (isNaN(number)) return timeString;

    // Handling the case for zero minutes specifically
    if (number === 0 && (unit === 'minutes' || unit === 'minute')) {
        return "Just Now";  // Assuming any duration less than a minute should display as "1m"
    }

    switch (unit) {
        case 'minutes':
        case 'minute':
            return number + 'm';
        case 'hours':
        case 'hour':
            return number + 'h';
        case 'days':
        case 'day':
            return number + 'd';
        case 'weeks':
        case 'week':
            return number + 'w';
        case 'years':
        case 'year':
            return number + 'y';
        default:
            return timeString; // Return the original string if unit is unrecognized
    }
  }
}

function deleteChatSession(chatSessionId) {
  apiClient.delete(`/chat_sessions/${chatSessionId}/`)
      .then(response => {
          console.log("Chat session deleted successfully.");
          fetchUserChatSessions();
          // Optionally refresh the list of chat sessions or update UI accordingly
      })
      .catch(error => {
          console.error("Failed to delete chat session:", error.response ? error.response.data : "No response");
      });
}
const [sessionSearchTerm, setSessionSearchTerm] = useState("");

const filteredAndSortedSessions = chatSessions
  .filter(session => {
    const otherParticipant = session.participants.find(participant => participant.id !== user.user_id);
    return otherParticipant ? otherParticipant.username.toLowerCase().includes(sessionSearchTerm.toLowerCase()) : false;
  })
  .sort((a, b) => {
    // Now using the exact_time for sorting, which is in ISO 8601 format
    return new Date(b.last_message.exact_time) - new Date(a.last_message.exact_time);
  });

const handleSendMessage = (input) => {
  sendMessage(input)
  setInput('')
}

const [userPrograms, setUserPrograms] = useState([]);
const [selectedProgram, setSelectedProgram] = useState(null)

function fetchUserPrograms() {
  apiClient.get('/user_programs/')
      .then(response => {
          setUserPrograms(response.data);
      })
      .catch(error => {
          console.error('Error fetching data:', error);
  });
}

useEffect(() => {
  fetchUserPrograms();  // Call the function on component mount
}, []);

const [isSheetOpen, setIsSheetOpen] = useState(false);

const sendProgramSharedMessage = async (programName) => {

  // Encrypt the message for the recipient
  const message = `"${programName}" has been shared.`;

  // Prepare the message object with both encrypted contents
  const messageObject = {
    senderId: user.user_id,
    recipientId: selectedChat.id,
    content: message
  };
  // Send the message via WebSocket
  webSocket.send(JSON.stringify(messageObject));
}

const addParticipantToProgram = async (programId, userId) => {
  try {
    const response = await apiClient.post(`/programs/${programId}/add-participant/`, { user_id: userId });
    return response.data;
  } catch (error) {
    throw new Error('Failed to add participant');
  }
};

const handleShareClick = async (program) => {
  try {
    const userId = selectedChat.id;
    await addParticipantToProgram(program.id, userId);
    toast({
      title: "Program Shared!",
      description: "The program has been successfully shared."
  });
    sendProgramSharedMessage(program.name);
    setIsSheetOpen(false)
  } catch (error) {
    console.error('Failed to add participant:', error);
    toast({
      title: "Program Share Failed",
      description: "The program has not been shared. Please try again",
      variant: "destructive"
  });
  }
};



const sendTrainerRequest = async () => {
  try {
    // Send POST request to the backend to save the trainer request
    const response = await apiClient.post(`/send-trainer-request/${selectedChat.id}/`);

    // Check if the request was successful
    if (response.status === 201) {  // Assuming the server returns a 201 Created on success
      // Construct the trainer request message to send via WebSocket
      const trainerRequestMessage = {
        type: 'trainer-request-sent',
        id: response.data.id, // Assuming the response includes the ID of the new trainer request
        from_user: user.user_id, // Assuming you have access to the current user's ID from your user state
        to_user: selectedChat.id,
        created_at: new Date().toISOString(),
        is_active: true // Assuming you want to include the creation time; adjust if the server sends it
      };

      console.log(JSON.stringify(trainerRequestMessage))

      // Send a WebSocket message to notify involved clients
      webSocket.send(JSON.stringify(trainerRequestMessage));

      console.log('Trainer request sent successfully');
    } else {
      console.error('Failed to send trainer request with status:', response.status);
    }
  } catch (error) {
    console.error('Error sending trainer request:', error);
    toast({
      title: `Request Failed`,
      description: `Request has already been sent.`,
      variant: 'destructive'
  });
  }
};



useEffect(() => {
  const fetchTrainerRequests = async () => {
    try {
      const response = await apiClient.get('/trainer-requests/');
      setReceivedRequests(response.data.received_requests);
    } catch (error) {
      console.error('Error fetching trainer requests:', error);
    }
  };

  fetchTrainerRequests();
}, [selectedChat, chatSessions]);

const [matchingRequest, setMatchingRequest] = useState(null);

useEffect(() => {
  if (selectedChat && selectedChat.id) {
    const request = receivedRequests.find(request => request.from_user === selectedChat.id);
    setMatchingRequest(request);
  } else {
    setMatchingRequest(null);
  }
}, [selectedChat, receivedRequests]);


const handleRequest = async (requestId, action) => {
  try {
    const response = await apiClient.post(`/handle-trainer-request/${requestId}/`, { action });

    // Assuming the server response indicates a successful operation
    if (response.status === 200) {
      const wsMessage = {
        type: action === 'accept' ? 'trainer-request-accepted' : 'trainer-request-rejected',
        id: requestId,
        from_user: user.user_id,
        to_user: selectedChat.id,
        action: action
      };

      // Send a WebSocket message to notify involved clients
      webSocket.send(JSON.stringify(wsMessage));

      toast({
        title: `Request has been ${action === 'accept' ? "accepted" : "rejected"}`,
        description: `The request has been ${action === 'accept' ? "accepted" : "rejected"}.`
      });

      // Update local state to remove the handled request
      setReceivedRequests(receivedRequests.filter(request => request.id !== requestId));
      if( action === 'accept') {
        setSelectedChat(prev => ({
          ...prev,
          clients: [...prev.clients, user.user_id]
        }));
      }
    } else {
      console.error('Failed to handle trainer request with status:', response.status);
    }
  } catch (error) {
    console.error(`Error handling trainer request: ${action}`, error);
  }
};

  const [isClientPopoverOpen, setIsClientPopoverOpen] = useState(false)

  const handleClientProgressClick = () => {
    navigate(`/ClientProgress/${selectedChat.id}`)
  }

  // Arrow function to remove a client
const removeClient = (clientId) => {
  return apiClient.delete(`/remove-client/${clientId}/`)
      .then(response => {
          console.log("Client removed successfully:", response.data);
          setIsClientPopoverOpen(false)
          setSelectedChat(prev => ({
            ...prev,
            trainers: prev.trainers.filter(trainerId => trainerId !== user.user_id)
        }));

        if (response.status === 204) {
          const wsMessage = {
            type: 'remove-client',
            from_user: user.user_id,
            to_user: selectedChat.id,
          };
          webSocket.send(JSON.stringify(wsMessage));
        }
      })
      .catch(error => {
          console.error("Failed to remove client:", error.response?.data || error.message);
          // Handle errors, possibly showing error messages to the user
      });
}

// Arrow function to remove a trainer
const removeTrainer = (trainerId) => {
  return apiClient.delete(`/remove-trainer/${trainerId}/`)
      .then(response => {
          console.log("Trainer removed successfully:", response.data);
          setIsClientPopoverOpen(false)
          setSelectedChat(prev => ({
            ...prev,
            clients: prev.clients.filter(clientId => clientId !== user.user_id)
        }));

        if (response.status === 204) {
          const wsMessage = {
            type: 'remove-trainer',
            from_user: user.user_id,
            to_user: selectedChat.id,
          };
          webSocket.send(JSON.stringify(wsMessage));
        }
      })
      .catch(error => {
          console.error("Failed to remove trainer:", error.response?.data || error.message);
          // Error handling
      });
}

// Example usage within a component method or effect
// Assuming selectedChat.id is available and refers to the relevant user ID

const handleRemoveClient = () => {
  if (selectedChat && selectedChat.id) {
      removeClient(selectedChat.id);
  }
};

const handleRemoveTrainer = () => {
  if (selectedChat && selectedChat.id) {
      removeTrainer(selectedChat.id);
  }
};

function markMessageAsRead(messageId) {
  const data = {
      read: true
  };

  // Return the Axios promise so that you can chain .then() and .catch() outside of this function.
  return apiClient.patch(`messages/${messageId}/`, data);
}
  return (
    <div className={`w-full ${backgroundColorClass} md:border rounded-lg lg:p-4`}>
      <Toaster />
      <Card className="border-0 md:border h-full w-full flex overflow-hidden rounded-none md:rounded-lg">
        <Card className={`border-none flex-none rounded-none ${selectedChat ? 'hidden lg:block md:w-1/3' : 'w-full lg:w-1/3'}`}>
          <div className="flex justify-between items-center p-6 pb-2">
            <h1 className="text-2xl font-semibold">Chats</h1>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger><FontAwesomeIcon size="lg" icon={faPenToSquare} /></PopoverTrigger>
              <PopoverContent>
                <div className="relative py-2 w-full flex justify-center items-center">
                    <Search className="absolute left-4 top-5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search Users" className="pl-8 w-full mx-2" onChange={e => setSearchTerm(e.target.value)}/>
                </div>
                <div className="overflow-y-scroll max-h-[250px] scrollbar-custom">
                {searchTerm && (
                        <div className="pr-2">
                            {users.filter(user => user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(filteredUser => (
                                  <div key={filteredUser.id} onClick={() => handleUserClick(filteredUser)}>
                                    <Separator />
                                    <div className="w-full flex items-center gap-4 p-3">
                                      <Avatar className="">
                                        <AvatarImage src={filteredUser.profile_picture || "https://github.com/shadcn.png"} />
                                        <AvatarFallback>CN</AvatarFallback>
                                      </Avatar>
                                      <div className="h-full flex flex-col justify-center">
                                        <h1 className="font-semibold">{filteredUser.username}</h1>
                                      </div>
                                    </div>
                                  </div>
                                ))
                            }
                        </div>
                    )}
                  </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="h-full px-0 py-0">
          <div className="relative py-2 w-full flex justify-center items-center">
              <Search className="absolute left-6 top-5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search Chats" className="pl-8 mx-4 w-full" value={sessionSearchTerm}
              onChange={e => setSessionSearchTerm(e.target.value)}/>
          </div>
          <div className="overflow-y-scroll scrollbar-custom" style={{ height: `calc(100vh - 265px)` }}>
          {filteredAndSortedSessions.map((session) => {
            // Find the other participant
            const otherParticipant = session.participants.find(participant => participant.id !== user.user_id);

            if (!otherParticipant) return null; // Skip rendering if no other participant

             // Decrypt the last message
            const lastMessage = session.last_message;
             
            return (
                <div className={`relative w-full h-20 flex items-center gap-4 pl-6 pr-3 py-2 hover:bg-muted transition duration-150 ease-in-out rounded-md`} key={session.id} onClick={() => handleUserClick(otherParticipant)}>
                  {!lastMessage.read && lastMessage.sender != "user" && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-primary">
                    {/* This div represents the blue ball */}
                  </div>
                  )}
                  <Popover >
                      <PopoverTrigger onClick={(event) => event.stopPropagation()} className='p-1 absolute top-1 right-2'><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                      <PopoverContent className='w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md'>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                        <Button onClick={(event) => {event.stopPropagation()}} className='px-4 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>
                        Delete Chat</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your converation for both users.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button variant='destructive' onClick={() => deleteChatSession(session.id)}>Delete</Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      </PopoverContent>
                  </Popover>
                  <Avatar className='h-11 w-11'>
                    <AvatarImage src={otherParticipant.profile_picture || "https://github.com/shadcn.png"} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="h-full flex flex-col justify-center w-full">
                    <h1 className="font-semibold">{otherParticipant.username}</h1>
                    {session.last_message && (
                    <div className="text-sm text-muted-foreground w-full flex justify-between items-center">
                      <div className="flex-1 overflow-hidden">
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap">{lastMessage.message}</div>
                      </div>
                      <div className="text-xs flex-shrink-0">{compactTimeFormat(session.last_message.timestamp)}</div>
                    </div>
                    )}
                  </div>
                </div>
            );
          })}
          </div>
          </div>
        </Card>
        <Card className={`flex-col flex-grow rounded-none border-0 lg:border-l border-r-0 border-y-0 flex ${!selectedChat ? 'hidden sm:flex' : ''}`}> 
        {selectedChat ? 
          (
          <>
            <CardHeader className="flex flex-row justify-between items-center pt-2 pb-2 pr-0">
                <div className="flex items-center space-x-4">
                    <FontAwesomeIcon onClick={() => handleBackClick(selectedChat)} className='text-primary' size='xl' icon={faChevronLeft} />
                    <Avatar>
                      <AvatarImage src={selectedChat.profile_picture || "https://github.com/shadcn.png"} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{selectedChat.username}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                {!selectedChat.trainers.includes(user.user_id) && (
                  <div className="flex items-center md:gap-2 mr-2 md:mr-4">
                    <div className="h-12 w-12 hover:bg-secondary rounded-full flex items-center justify-center">
                    <AlertDialog>
                        <AlertDialogTrigger>
                          <div className="h-12 w-12 lg:hover:bg-secondary rounded-full flex items-center justify-center">
                            <FontAwesomeIcon size='lg' className="text-primary ml-1" icon={faUserPlus} />
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Would you like to send {selectedChat.username} a Trainer request?</AlertDialogTitle>
                            <AlertDialogDescription>
                              As a Trainer you will gain access to {selectedChat.username}'s workout calendar and progress charts
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={sendTrainerRequest}>Send Request</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    {selectedChat.clients.includes(user.user_id) ? (
                    <Popover open={isClientPopoverOpen} onOpenChange={setIsClientPopoverOpen}>
                    <PopoverTrigger>
                    <div className="h-12 w-12 hover:bg-secondary rounded-full flex items-center justify-center">
                      <FontAwesomeIcon className='text-primary' size='lg' icon={faEllipsis} />
                    </div>
                    </PopoverTrigger>
                    <PopoverContent className='w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md'>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                      <Button className='px-4 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>
                      Remove Trainer</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {`This will remove ${selectedChat.username} as your Trainer.`}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => setIsClientPopoverOpen(false)}>Cancel</AlertDialogCancel>
                          <Button variant='destructive' onClick={handleRemoveTrainer}>Remove</Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    </PopoverContent>
                  </Popover>) : (
                    <div className="h-12 w-1"></div>
                    )}
                </div>
                )}
                  {selectedChat.trainers.includes(user.user_id) && (
                  <div className="flex items-center md:gap-2 md:mr-4 mr-2">
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                      <SheetTrigger asChild>
                          <div className="h-12 w-12 hover:bg-secondary rounded-full flex items-center justify-center">
                            <FontAwesomeIcon onClick={() => setIsSheetOpen(true)} size='lg'className="text-primary" icon={faArrowUpFromBracket} />
                          </div>
                      </SheetTrigger>
                      <SheetContent className="md:w-[400px] w-[100%]">
                          <SheetHeader className='text-left pl-4 flex flex-row justify-between items-center mt-4'>
                              <SheetTitle className='text-2xl' >Share Programs</SheetTitle>
                          </SheetHeader>
                          <div className='flex flex-col gap-2 mt-2 overflow-y-auto max-h-[75vh] scrollbar-custom'>
                          {userPrograms.map((program) => (
                          <div
                              key={program.id}
                              className={`flex items-center p-4 py-3 relative rounded border`}
                              
                          >
                              <h1 className='w-[90%] '>{program.name}</h1>
                              <AlertDialog>
                                <AlertDialogTrigger>
                                <div className="h-12 w-12 hover:bg-secondary rounded-full flex items-center justify-center">
                                  <FontAwesomeIcon onClick={() => setIsSheetOpen(true)} size='lg'className="text-primary" icon={faArrowUpFromBracket} />
                                </div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Would you like to share "{program.name}"?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Programs shared will be available to participants under their shared programs section.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleShareClick(program)}>Share</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                          </div>
                          ))}
                          </div>
                      </SheetContent>
                    </Sheet>
                    <div onClick={handleClientProgressClick} className="h-12 w-12 hover:bg-secondary rounded-full flex items-center justify-center">
                      <FontAwesomeIcon className='text-primary' size='lg' icon={faChartLine} />
                    </div>
                    <Popover open={isClientPopoverOpen} onOpenChange={setIsClientPopoverOpen}>
                      <PopoverTrigger>
                      <div className="h-12 w-12 hover:bg-secondary rounded-full flex items-center justify-center">
                        <FontAwesomeIcon className='text-primary' size='lg' icon={faEllipsis} />
                      </div>
                      </PopoverTrigger>
                      <PopoverContent className='w-full flex flex-col overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md'>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                        <Button className='px-4 py-1.5 text-sm outline-none rounded-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>
                        Remove Client</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {`This will remove ${selectedChat.username} as your client.`}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsClientPopoverOpen(false)}>Cancel</AlertDialogCancel>
                            <Button variant='destructive' onClick={handleRemoveClient}>Remove</Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      {selectedChat.clients.includes(user.user_id) &&
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                          <Button className='px-4 py-1.5 text-sm rounded-none outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>
                          Remove Trainer</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                {`This will remove ${selectedChat.username} as your Trainer.`}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setIsClientPopoverOpen(false)}>Cancel</AlertDialogCancel>
                              <Button variant='destructive' onClick={handleRemoveTrainer}>Remove</Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>}
                      </PopoverContent>
                  </Popover>
                    
                  </div>
                  )}
                </div>
                
            </CardHeader>
            {matchingRequest && (
                  <div className="bg-background border-y flex justify-between items-center p-2">
                    <p className='text-sm font-medium'>{selectedChat.username} has sent you a trainer request.</p>
                    <div className="flex items-center gap-1">
                      <Button size='sm' onClick={() => handleRequest(matchingRequest.id, 'accept')}>Accept</Button>
                      <Button size='sm' variant='outline' onClick={() => handleRequest(matchingRequest.id, 'reject')}>Reject</Button>
                    </div>
                  </div>
                )}
            <CardContent className="w-full flex flex-col h-full overflow-y-auto overflow-x-hidden pb-1 px-0">
                <div className="flex flex-col-reverse pb-2 px-2 h-full overflow-y-scroll px-1 scrollbar-custom" ref={chatContainerRef}>
                {selectedChat && messages[selectedChat.id] && (
                messages[selectedChat.id].slice().reverse().map((message, index) => (
                <div
                    key={index}
                    className={cn(
                    "flex w-max max-w-xs flex-col gap-2 rounded-lg px-3 py-2 mt-1 text-sm break-words whitespace-pre-wrap",
                    message.sender === user.user_id
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                >
                    <p>{message.content}</p>
                </div>
                ))
              )}
                
                </div>
            </CardContent>
            <CardFooter className='mt-auto pt-2 px-2 pb-2'>
              <div
                  className="flex w-full items-center space-x-2"
              >
                  <Textarea
                  maxLength={500}
                  id="message"
                  placeholder="Type your message..."
                  className="flex-1 h-10 resize-none"
                  autoComplete="off"
                  value={input}
                  onChange={(event) => setInput(event.target.value)} />
                  <Button onClick={() => handleSendMessage(input, selectedChat)} size="icon" disabled={inputLength === 0}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                  </Button>
              </div>
            </CardFooter>
          </>
          ) 
          :
          (
          <>
            <CardHeader className="flex items-center justify-center w-full h-full">
              <FontAwesomeIcon className="fa-5x" icon={faComments} />
              <h1 className="text-xl font-semibold">Your Messages</h1>
              <p className="text-sm text-muted-foreground">Send messages to a friend</p>
            </CardHeader>
          </>
          )
        }

        </Card>
      </Card>
    </div>
  );
};

export default Chat;

{/* 
${!isChatSession ? 'hidden md:flex' : 'flex'}
<CardHeader className="flex flex-row items-center">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="/avatars/01.png" alt="Image" />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">Sofia Davis</p>
          <p className="text-sm text-muted-foreground">m@example.com</p>
        </div>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col flex-grow overflow-auto">
      <div className="space-y-4 flex flex-col justify-end h-full">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
              message.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            {message}
          </div>
        ))}
      </div>
    </CardContent>
    <CardFooter>
      <div
        className="flex w-full items-center space-x-2"
      >
        <Input
          id="message"
          placeholder="Type your message..."
          className="flex-1"
          autoComplete="off"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Button onClick={sendMessage} size="icon" disabled={inputLength === 0}>
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
  </CardFooter> */}