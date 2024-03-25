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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Bar, BarChart, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ProCalendar } from "@/components/ui/ProgressCalendar"
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SelectSeparator } from '@/components/ui/select';


const Progress = () => {
    const [date, setDate] = React.useState()
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
      const data2 = [
        { month: '2024-04', weight: 120, volume: 100 },
        { month: '2024-05', weight: 118, volume: 110 },
        { month: '2024-06', weight: 115, volume: 120 },
        { month: '2024-07', weight: 105, volume: 135 },
        { month: '2024-08', weight: 94, volume: 140 },
        { month: '2024-09', weight: 80, volume: 160 },
      ];
    // Determine the background color class based on the theme
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    return (
        <div className={`w-full md:border rounded-lg md:h-full ${backgroundColorClass} md:p-4 pb-24`}>
            <Card className='h-full w-full md:border rounded-none md:rounded-lg flex justify-center p-4'>
            <div class="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="col-span-2 h-48">
                    <Card className='flex w-full h-full'>
                        <div className='w-1/2 md:border-r h-full flex items-center gap-4'>
                            <Avatar className="ml-6 h-32 w-32">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='h-full flex flex-col justify-center'>
                                <h1 className='text-2xl font-semibold'>John</h1>
                                <p>Weight: 180</p>
                            </div>
                        </div>
                        <div className='w-1/2 hidden md:block h-full'>
                            <h1 className='font-semibold pt-2 pl-6'>Volume X Intensity</h1>
                            <ResponsiveContainer width="100%" height="85%">
                                <LineChart
                                width={500}
                                height={300}
                                data={data2}
                                margin={{
                                    top: 10,
                                    right: 0,
                                    left: 0,
                                    bottom: 0,
                                }}
                                >
                                <XAxis dataKey="month" 
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}/>
                                <YAxis yAxisId="left" 
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}/>
                                <YAxis yAxisId="right" orientation="right" 
                                tickLine={false}
                                axisLine={false}
                                fontSize={0}
                                />
                                <Tooltip />
                                <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#471fad" activeDot={{ r: 8 }} />
                                <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#00ace6" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        
                    </Card>
                </div>

                <div className='border rounded-lg col-span-2 md:hidden h-full'>
                    <h1 className='font-semibold pt-2 pl-6'>Volume X Intensity</h1>
                    <ResponsiveContainer width="100%" height="85%">
                        <LineChart
                        width={500}
                        height={300}
                        data={data2}
                        margin={{
                            top: 10,
                            right: 0,
                            left: 0,
                            bottom: 0,
                        }}
                        >
                        <XAxis dataKey="month" 
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}/>
                        <YAxis yAxisId="left" 
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}/>
                        <YAxis yAxisId="right" orientation="right" 
                        tickLine={false}
                        axisLine={false}
                        fontSize={0}
                        />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#471fad" activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="volume" stroke="#00ace6" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div class="h-[400px] col-span-2 row-span-2">
                    <Card className='w-full h-full flex justify-center pt-1'>
                        <ProCalendar
                            mode="single"
                            selected={date}
                            className="h-[100%] pt-4"
                            />

                    </Card>
                </div>

            
                <div class="row-span-2 col-span-2 h-[400px]">
                    <Card className='w-full h-full flex flex-col'>
                    <h1 className='px-4 py-6 text-xl font-semibold'>Back Squat Estimated 1RM</h1>
                                        <ResponsiveContainer width="100%" height={300}>
                                        
                                            <LineChart
                                                width={500}
                                                height={300}
                                                data={data}
                                                margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
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
                </div>


                <div class="h-48 col-span-2">
                    <Card className='w-full h-full pt-2'>
                        <h1 className='text-xl font-semibold px-6'>Consistency</h1>
                        <ResponsiveContainer width="100%" height={150}>
                            <BarChart data={data}
                            margin={{ top: 15, right: 50 }}>
                                <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                />
                                <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                                />
                                <Bar
                                dataKey="weight"
                                fill="currentColor"
                                radius={[4, 4, 0, 0]}
                                className="fill-primary"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>                                                           
            </Card>
        </div>
    )
}

export default Progress



{/* <div className='w-full flex justify-center md:w-1/2'>
                <Tabs defaultValue="Strength" className="w-[100%] p-6">
                    <div className='flex items-center justify-between'> 
                        <TabsList className='w-full'>
                            <TabsTrigger className='flex-1 text-xs md:text-md' value="Strength">Strength</TabsTrigger>
                            <TabsTrigger className='text-xs flex-1 md:text-md' value="Consistency">Consistency</TabsTrigger>
                            <TabsTrigger className='text-xs flex-1 md:text-md' value="totalWeightLifted">Total Weight Lifted</TabsTrigger>
                        </TabsList>
                        <Popover >
                            <PopoverTrigger className='hidden md:flex' asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                
                <TabsContent  value="Strength">
                    <Card className='flex flex-col justify-center w-full pb-4'>
                            <h1 className='px-4 py-6 text-xl font-semibold'>Back Squat</h1>
                            <ResponsiveContainer width="100%" height={250}>
                            
                                <LineChart
                                    width={500}
                                    height={300}
                                    data={data}
                                    margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
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
                    </TabsContent>
                <TabsContent value="Consistency">
                    <Card className='flex flex-col justify-center w-[50%] pb-4'>
                        <h1 className='px-8 py-6 text-xl font-semibold'>Bench Press</h1>
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
                </TabsContent>
                </Tabs>

            </div>
            <div className='hidden md:block w-1/2 flex items-center justify-center'>
                <ProCalendar
                    mode="single"
                    selected={date}
                    className="hidden md:block h-[90%] m-4"
                    />

            </div> */}

            {/* <div className='w-1/2 border-r h-full flex items-center gap-4'>
                <Avatar className="ml-6 h-32 w-32">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='h-full flex flex-col justify-center'>
                    <h1 className='text-2xl font-semibold'>John</h1>
                    <p>Weight: 180</p>
                </div>
            </div>
            <div className='w-1/2 h-full p-4 flex flex-col gap-2'>
                <h1 className='text-xl font-semibold'>Friends</h1>
                <div>
                    <div className='flex justify-between items-center w-full pb-2'>
                        <div className='flex items-center gap-2'>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h1>McKay</h1>
                        </div>
                        <div>
                            <FontAwesomeIcon className='pr-4' size="lg" icon={faPaperPlane} />
                        </div>
                    </div>
                    <Separator />
                </div>
                <div>
                    <div className='flex justify-between items-center w-full pb-2'>
                        <div className='flex items-center gap-2'>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <h1>Nick</h1>
                        </div>
                        <div>
                            <FontAwesomeIcon className='pr-4' size="lg" icon={faPaperPlane} />
                        </div>
                    </div>
                    <Separator />
                </div>
            </div> */}