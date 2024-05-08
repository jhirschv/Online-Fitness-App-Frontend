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
import { faPenToSquare, faArrowUpRightFromSquare, faChevronLeft, faEllipsis, faDumbbell, faLock } from "@fortawesome/free-solid-svg-icons";
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

const Chat = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const backgroundColorClass = theme === "dark" ? "bg-popover" : "bg-secondary";
  const [users, setUsers] = useState([])
  let { user } = useContext(AuthContext)

  useEffect(() => {
    apiClient.get(`/users/`)
        .then(response => {
            const filteredUsers = response.data.filter(u => u.id !== user.user_id);
            setUsers(filteredUsers)
        })
        .catch(error => console.error('Error:', error));
    }, []);

    const [selectedChat, setSelectedChat] = useState(null)
    const [webSocket, setWebSocket] = useState(null);

  const handleUserClick = (otherUser) => {
    setSelectedChat(otherUser);
    setIsPopoverOpen(false)
    setSearchTerm('')
    setSessionSearchTerm('')
    apiClient.get(`/chat/${otherUser.id}/`)
        .then(response => {
            setMessages(response.data);
            fetchUserChatSessions();
        })
        .catch(error => {
            console.error('Error:', error);
            setMessages([]);
        });
  };

  useEffect(() => {
    if (!selectedChat) return;

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
    ws.onclose = () => console.log("WebSocket connection closed.");

    setWebSocket(ws);  // Store WebSocket in state

    // Cleanup function to close WebSocket when component unmounts or selectedChat changes
    return () => {
        ws.close();
    };

  }, [selectedChat, user.user_id]); 

  const [searchTerm, setSearchTerm] = useState('');
  const [chatSessions, setChatSessions] = useState([]);

  const fetchUserChatSessions = () => {
    apiClient.get('/user_chats/')
        .then(response => {
            setChatSessions(response.data);
            console.log(response.data)
        })
        .catch(error => console.error('Error fetching chat sessions:', error));
  }

  useEffect(() => {
    fetchUserChatSessions();
}, []);

useEffect(() => {
  console.log(chatSessions)
}, [chatSessions]);

const [messages, setMessages] = useState([]);
const [input, setInput] = React.useState("");
const inputLength = input.trim().length;

const sendMessage = () => {
  if (input.trim()) {
    const messageObject = {
      senderId: user.user_id, 
      content: input.trim()
  };
    webSocket.send(JSON.stringify(messageObject)); 
    setInput(''); 
  }
};

const findMatchingSessionId = (sessions, currentUserId, otherUserId) => {
  return sessions.find(session => 
      session.participants.some(participant => participant.id === currentUserId) &&
      session.participants.some(participant => participant.id === otherUserId)
  );
};

const updateLastMessageInChatSessions = (message, sessionId) => {
  setChatSessions(prevSessions => prevSessions.map(session => {
      if (session.id === sessionId) {
          const formattedMessage = {
              message: (message.sender === user.user_id ? "You: " : "") + message.content,
              timestamp: "Just now"  // This will need to be updated based on actual time logic
          };
          return {...session, last_message: formattedMessage};
      }
      return session;
  }));
};

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

  const handleBackClick = () => {
    setSelectedChat(null);
    setMessages([]);
  }

  function truncateString(str, num) {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + '...';
  }

  function compactTimeFormat(timeString) {
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
        return "1m";  // Assuming any duration less than a minute should display as "1m"
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

const filteredSessions = chatSessions.filter(session => {
  const otherParticipant = session.participants.find(participant => participant.id !== user.user_id);
  return otherParticipant ? otherParticipant.username.toLowerCase().includes(sessionSearchTerm.toLowerCase()) : false;
});


  
  return (
    <div className={`w-full ${backgroundColorClass} md:border rounded-lg lg:p-4`}>
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
                                        <AvatarImage src="https://github.com/shadcn.png" />
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
          <div className="h-full p-6 pt-0">
          <div className="relative py-2 w-full flex justify-center items-center">
              <Search className="absolute left-4 top-5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search Chats" className="pl-8 w-full" value={sessionSearchTerm}
              onChange={e => setSessionSearchTerm(e.target.value)}/>
          </div>
          {filteredSessions.map((session) => {
            // Find the other participant
            const otherParticipant = session.participants.find(participant => participant.id !== user.user_id);

            if (!otherParticipant) return null; // Skip rendering if no other participant

            return (
                <div className="relative w-full flex items-center gap-4 p-3 py-2 hover:bg-muted transition duration-150 ease-in-out rounded-md" key={session.id} onClick={() => handleUserClick(otherParticipant)}>
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
                  <Avatar className='h-14 w-14'>
                    <AvatarImage src={otherParticipant.avatar_url || "https://github.com/shadcn.png"} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="h-full flex flex-col justify-center w-full">
                    <h1 className="font-semibold">{otherParticipant.username}</h1>
                    {session.last_message && (
                    <div className="text-sm text-muted-foreground w-full flex justify-between items-center">
                      <div className="flex-1 overflow-hidden">
                          <div className="overflow-hidden text-ellipsis whitespace-nowrap">{truncateString(session.last_message.message, 24)}</div>
                      </div>
                      <div className="text-xs flex-shrink-0">{compactTimeFormat(session.last_message.timestamp)}</div>
                    </div>
                    )}
                  </div>
                </div>
            );
          })}
          </div>
        </Card>
        <Card className={`flex-col flex-grow rounded-none border-l border-r-0 border-y-0 flex ${!selectedChat ? 'hidden sm:flex' : ''}`}> 
        {selectedChat ? 
          (
          <>
            <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex items-center space-x-4">
                    <FontAwesomeIcon onClick={handleBackClick} className='text-primary' size='xl' icon={faChevronLeft} />
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                    <p className="text-sm font-medium leading-none">{selectedChat.username}</p>
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon className="text-xs text-muted-foreground" icon={faLock} />
                      <p className="text-xs text-muted-foreground">end-to-end encrypted</p>
                    </div>
                    </div>
                </div>
                <div >
                  <Button className="mb-1 flex items-center gap-1" variant='secondary' size='sm'><FontAwesomeIcon className="mt-1" icon={faDumbbell} />Share Program</Button>
                </div>
            </CardHeader>
            <CardContent className="w-full flex flex-col h-full overflow-y-auto overflow-x-hidden pb-1 px-0">
                <div className="flex flex-col-reverse pb-2 px-2 h-full overflow-y-scroll px-1 scrollbar-custom" ref={chatContainerRef}>
                {messages.slice().reverse().map((message, index) => (
                <div
                    key={index}
                    className={cn(
                    "flex w-max max-w-xs flex-col gap-2 rounded-lg px-3 py-2 mt-1 text-sm break-all whitespace-pre-wrap",
                    message.sender === user.user_id
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                >
                    <p>{message.content}</p>
                </div>
                ))}
                </div>
            </CardContent>
            <CardFooter className='mt-auto pt-2'>
              <div
                  className="flex w-full items-center space-x-2"
              >
                  <Textarea
                  id="message"
                  placeholder="Type your message..."
                  className="flex-1 h-10 resize-none"
                  autoComplete="off"
                  value={input}
                  onChange={(event) => setInput(event.target.value)} />
                  <Button onClick={sendMessage} size="icon" disabled={inputLength === 0}>
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