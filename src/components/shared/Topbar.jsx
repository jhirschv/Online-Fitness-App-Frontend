import React from 'react'
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { NavLink } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Topbar = () => {
  const { setTheme } = useTheme()
  const { theme } = useTheme();
  const fontColor = theme === 'dark' ? 'text-muted-foreground' : 'text-primary';
  let { user, logoutUser } = useContext(AuthContext)

  return (
    <div  className="fixed z-50 top-0 w-full h-16 flex items-center justify-between p-6 bg-background">
        <div className='flex font-bold text-3xl ml-4'><h1>Train.</h1><h1 className={`${fontColor}`}>io</h1></div>
        <div className='flex items-center'>
        <NavLink className='md:hidden' to='/account'>
            <li className="flex items-center text-lg hover:bg-muted w-full h-16 pl-4 rounded-md transition duration-300 ease-in-out">
              <Avatar className="mr-3">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </li>
          </NavLink>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='hidden md:flex' variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <FontAwesomeIcon icon={faRightFromBracket} onClick={logoutUser} className='ml-4' size="xl"/>
        </div>
        
    </div>
  )
}

export default Topbar