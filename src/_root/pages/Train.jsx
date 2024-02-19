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
  import { Calendar } from "@/components/ui/calendar"
  import { Button } from "@/components/ui/button"

const Train = () => {
    const { theme } = useTheme();

    const [date, setDate] = React.useState(new Date())
    // Determine the background color class based on the theme
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    return (
        <div className={`w-full ${backgroundColorClass} border rounded-lg p-4`}>
            <Card className='w-full flex-grow flex flex-col'>
                <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className=" flex-1 rounded-md border"
                />
                <Button className='mt-4 p-4 flex-1 text-2xl'>Train!</Button>
            </Card>
        </div>
    )
}

export default Train