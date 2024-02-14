import React from 'react'
import { useTheme } from '@/components/theme-provider';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

const Chat = () => {
    const { theme } = useTheme();

    // Determine the background color class based on the theme
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    return (
        <div className={`w-full ${backgroundColorClass} border rounded-lg p-4`}>
            <Card className='h-full w-full flex flex-col items-center'>
                Chat
            </Card>
        </div>
    )
}

export default Chat