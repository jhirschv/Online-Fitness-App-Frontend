import React from "react";
import { useContext } from 'react';
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
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faComments } from "@fortawesome/free-regular-svg-icons";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useOutlet } from 'react-router-dom';

const Chat = () => {
  const { theme } = useTheme();
  const backgroundColorClass = theme === "dark" ? "bg-popover" : "bg-secondary";
  const [users, setUsers] = useState([])
  let { user } = useContext(AuthContext)

  const ConditionalOutlet = () => {
    const outlet = useOutlet(); // This checks if there's an outlet to render
    return outlet ? (
      outlet // If there's an outlet, render it
    ) : (
      <>
        <CardHeader className="flex items-center justify-center w-full h-full">
          <FontAwesomeIcon className="fa-5x" icon={faComments} />
          <h1 className="text-xl font-semibold">Your Messages</h1>
          <p className="text-sm text-muted-foreground">Send messages to a friend</p>
          <Button size="sm">Send Message</Button>
        </CardHeader>
      </>
    );
  };

  useEffect(() => {
    apiClient.get(`/users/`)
        .then(response => {
            const filteredUsers = response.data.filter(u => u.id !== user.user_id);
            setUsers(filteredUsers)
        })
        .catch(error => console.error('Error:', error));
    }, []);

  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    const sortedIds = [user.user_id, userId].sort();
    const url = `/chat/${sortedIds[0]}/${sortedIds[1]}/`;
    navigate(url, { state: { recipient: userId } });
  }

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
            {users.map((user) => {
              return (
                <div key={user.id} onClick={() => handleUserClick(user.id)}>
                  <Separator />
                  <div className="w-full flex items-center gap-4 p-3">
                    <Avatar className="">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="h-full flex flex-col justify-center">
                      <h1 className="font-semibold">{user.username}</h1>
                      <p className="text-sm text-muted-foreground">I love cats</p>
                    </div>
                  </div>
                </div>
              )
            })}
            <Separator />
          </div>
        </Card>
        <Card className="flex flex-col flex-grow rounded-none border-l border-r-0 border-y-0">
          <ConditionalOutlet />
        </Card>
      </Card>
    </div>
  );
};

export default Chat;

{/* <CardHeader className="flex flex-row items-center">
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