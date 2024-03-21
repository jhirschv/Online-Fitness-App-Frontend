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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const Progress = () => {
    const { theme } = useTheme();
    const data = [
        { date: '2024-01-01', weight: 200 },
        { date: '2024-01-31', weight: 204 },
        { date: '2024-03-01', weight: 210 },
        { date: '2024-03-31', weight: 212 },
        { date: '2024-04-30', weight: 216 },
        { date: '2024-05-30', weight: 225 },
        { date: '2024-06-29', weight: 212 },
        { date: '2024-07-29', weight: 228 },
        { date: '2024-08-28', weight: 240 },
        { date: '2024-09-27', weight: 236 },
        { date: '2024-10-27', weight: 230 },
        { date: '2024-11-26', weight: 233 },
        { date: '2024-12-26', weight: 248 },
        { date: '2025-01-25', weight: 252 },
        { date: '2025-02-24', weight: 256 }
      ];
    // Determine the background color class based on the theme
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    return (
        <div className={`w-full h-full ${backgroundColorClass} border rounded-lg p-4`}>
            <Card className='h-full w-full flex flex-col pt-8 items-center'>
                
            <Card className='flex flex-col justify-center w-[50%] pb-4'>
                    <h1 className='px-8 py-6 text-xl font-semibold'>Back Squat</h1>
                    <ResponsiveContainer width="100%" height={250}>
                    
                        <LineChart
                            width={500}
                            height={300}
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="date" 
                            stroke="#888888"
                            padding={{ left: 20, right: 20 }}
                            tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false} />
                            <YAxis 
                            stroke="#888888"
                            tickFormatter={(value) => `${value} lbs`}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}/>
                            <Tooltip />
                            <Line type="monotone" strokeWidth={2} dataKey="weight" stroke="#471fad" activeDot={{r: 8, style: { fill: "var(--theme-primary)" },}} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </Card>
        </div>
    )
}

export default Progress