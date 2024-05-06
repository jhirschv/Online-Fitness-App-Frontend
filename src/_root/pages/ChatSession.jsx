import React from 'react'
import { useEffect, useState } from 'react'
import { cn } from "@/lib/utils"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Check, Plus, Send } from "lucide-react";
import { useLocation } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { useOutletContext } from "react-router-dom";

const ChatSession = () => {
  const [input, setInput] = React.useState("");
  const inputLength = input.trim().length;
  const [messages, setMessages] = useState([]);
  const [webSocket, setWebSocket] = useState(null);
  let { user } = useContext(AuthContext)
  const fetchUserChatSessions = useOutletContext();

  const location = useLocation();
  const recipientId = location.state?.recipient;
  const [recipientData, setRecipientData] = useState(null);

  useEffect(() => {
    if (recipientId) {
      apiClient.get(`/users/${recipientId}/`)
          .then(response => {
              setRecipientData(response.data)
              console.log(response.data)
          })
          .catch(error => console.error('Error:', error));
    }
  }, [recipientId]);

  useEffect(() => {
      apiClient.get(`/chat/${recipientId}/`)
          .then(response => {
              setMessages(response.data)
              console.log(response.data)
          })
          .catch(error => {
            console.error('Error:', error)
            setMessages([])
          });
  }, []);
  

  useEffect(() => {
    const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
    const wsURL = `${wsScheme}://localhost:8000/ws/chat/${user.user_id}/${recipientId}/`;
    const ws = new WebSocket(wsURL);

    ws.onopen = () => console.log("WebSocket connection established.")
    setWebSocket(ws);
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data.message]);
    };
    ws.onclose = () => console.log("WebSocket connection closed.");

    return () => ws.close();

  }, [recipientData]);

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

  return (
    <>
    <CardHeader className="flex flex-row items-center">
        <div className="flex items-center space-x-4">
            <Avatar>
            <AvatarImage src="/avatars/01.png" alt="Image" />
            <AvatarFallback>NA</AvatarFallback>
            </Avatar>
            <div>
            <p className="text-sm font-medium leading-none">{recipientData && recipientData.username}</p>
            </div>
        </div>
        </CardHeader>
        <CardContent className="w-full flex flex-col flex-grow overflow-y-auto">
        <div className="w-full space-y-4 flex flex-col justify-end h-full">
            {messages.map((message, index) => (
            <div
                key={index}
                className={cn(
                "flex w-max max-w-xs flex-col gap-2 rounded-lg px-3 py-2 text-sm break-all whitespace-pre-wrap",
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
    </CardFooter>
    </>
  )
}

export default ChatSession