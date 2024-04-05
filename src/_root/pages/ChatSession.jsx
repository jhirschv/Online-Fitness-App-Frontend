import React from 'react'
import { useEffect, useState } from 'react'
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

const ChatSession = () => {
  const [input, setInput] = React.useState("");
  const inputLength = input.trim().length;
  const [messages, setMessages] = useState([]);
  const [webSocket, setWebSocket] = useState(null);
  let { user } = useContext(AuthContext)

  useEffect(() => {
    // Define WebSocket URL
    const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
    const wsURL = `${wsScheme}://localhost:8000/ws/chat/1/2/`;

    // Create WebSocket connection
    const ws = new WebSocket(wsURL);

    // Set up WebSocket event listeners
    ws.onopen = () => console.log("WebSocket connection established.")
    setWebSocket(ws);
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, data.message]);
    };
    ws.onclose = () => console.log("WebSocket connection closed.");

    // Cleanup function to close WebSocket connection when component unmounts
    return () => ws.close();

  }, []);

    const sendMessage = () => {
        if (input.trim()) {
          webSocket.send(JSON.stringify({ message: input})); // Adjust payload as needed
          setInput(''); // Clear input after sending
        }
      };

  return (
    <>
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
    </CardFooter>
    </>
  )
}

export default ChatSession