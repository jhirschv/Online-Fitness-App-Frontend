import React from "react";
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { useTheme } from "@/components/theme-provider";
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
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const users = [
  {
    name: "Olivia Martin",
    email: "m@example.com",
    avatar: "/avatars/01.png",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    avatar: "/avatars/03.png",
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    avatar: "/avatars/05.png",
  },
  {
    name: "Jackson Lee",
    email: "lee@example.com",
    avatar: "/avatars/02.png",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    avatar: "/avatars/04.png",
  },
];

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const Chat = () => {
  const { theme } = useTheme();
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
  
  const [input, setInput] = React.useState("");
  const inputLength = input.trim().length;
  const [open, setOpen] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState([]);

  // Determine the background color class based on the theme
  const backgroundColorClass = theme === "dark" ? "bg-popover" : "bg-secondary";

  return (
    <div
      className={`w-full ${backgroundColorClass} md:border rounded-lg md:p-4`}
    >
      <Card className="border-0 md:border h-full w-full flex overflow-hidden rounded-none md:rounded-lg">
        <Card className="hidden border-none md:block flex-none w-1/3 rounded-none">
          <div className="flex justify-between items-center p-6">
            <h1 className="text-2xl font-semibold">Chats</h1>
            <FontAwesomeIcon size="lg" icon={faPenToSquare} />
          </div>
          <div className="h-full p-6">
            <Separator />
            <div className="w-full flex items-center gap-4 p-3">
              <Avatar className="">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="h-full flex flex-col justify-center">
                <h1 className="font-semibold">John</h1>
                <p className="text-sm text-muted-foreground">I love cats</p>
              </div>
            </div>
            <Separator />
            <div className="w-full flex items-center gap-4 p-3">
              <Avatar className="">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="h-full flex flex-col justify-center">
                <h1 className="font-semibold">McKay</h1>
                <p className="text-sm text-muted-foreground">
                  Did you see my message?
                </p>
              </div>
            </div>
            <Separator />
            <div className="w-full flex items-center gap-4 p-3">
              <Avatar className="">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="h-full flex flex-col justify-center">
                <h1 className="font-semibold">Andreas</h1>
                <p className="text-sm text-muted-foreground">
                  I just got Taylor Swift tickets!!!
                </p>
              </div>
            </div>
            <Separator />
            <div className="w-full flex items-center gap-4 p-3">
              <Avatar className="">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="h-full flex flex-col justify-center">
                <h1 className="font-semibold">Caleb</h1>
                <p className="text-sm text-muted-foreground">
                  My dog is still a puppy!
                </p>
              </div>
            </div>
            <Separator />
          </div>
        </Card>
        <Card className="flex flex-col flex-grow rounded-none border-none">
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
        </Card>
      </Card>
    </div>
  );
};

export default Chat;
