import React from 'react'
import { useEffect, useState } from 'react';
import { useTheme } from '@/components/theme-provider';
import apiClient from '../../services/apiClient';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
Sheet,
SheetClose,
SheetContent,
SheetDescription,
SheetFooter,
SheetHeader,
SheetTitle,
SheetTrigger,
} from "@/components/ui/sheet"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
Table,
TableBody,
TableCaption,
TableCell,
TableHead,
TableHeader,
TableFooter,
TableRow,
} from "@/components/ui/table"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import moment from 'moment';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"


const Progress = ({userInfo}) => {
    const [date, setDate] = React.useState()
    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';
    let { user } = useContext(AuthContext)

    const [userWorkoutSessions, setUserWorkoutSessions] = useState([])
    useEffect(() => {
        apiClient.get('/user_workout_sessions/')
            .then(response => {
                setUserWorkoutSessions(response.data)
                })
            
            .catch(error => console.error('Error:', error));
        }, [user]);

    const handleSelect = (newDate) => {
        setDate(newDate);
        setIsSheetOpen(true);
    }
    const [dayData, setDayData] = useState({
        workout: {
          workout_exercises: []
        }
      });
    const workoutDate = new Date(dayData.date);

    // Format the date
    const formattedDate = workoutDate.toLocaleDateString('en-US', {
        year: 'numeric', // "2024"
        month: 'long', // "March"
        day: 'numeric', // "8"
    });
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const handleDayData = (receivedDayData) => {
        console.log('Sending event data to parent:', receivedDayData);
        // Even if receivedDayData is undefined or null, setDayData to an empty object
        setDayData(receivedDayData || {});
    };
    


    //Total weight lifted
    const [totalWeightLifted, setTotalWeightLifted] = useState()
    useEffect(() => {
        const fetchVolume = async () => {
        try {
            const response = await apiClient.get('/cumulative-weight/');
            setTotalWeightLifted(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Failed to fetch exercises:", error);
        }
        };
        fetchVolume();
    }, []);

    const [consistencyData, setConsistencyData] = useState([]);

    useEffect(() => {
        const fetchConsistencyData = async () => {
            try {
                const response = await apiClient.get('workout_sessions_last_3_months/');
                // Assume the response data is directly in the format expected by the chart
                setConsistencyData(response.data);
            } catch (error) {
                console.error("Error fetching workout data:", error);
                // Handle error, maybe set some error state to display
            }
        };

        fetchConsistencyData();
    }, []);

    const convertWeekToDate = (week) => {
        // Split the week string to get the year and week number
        const [year, weekNumber] = week.split('-');
    
        // Calculate the first day of the given week number
        let date = moment().year(year).week(weekNumber).startOf('week');
    
        // Format the date as "MM-DD"
        return date.format('MM-DD');
    };
    
    // Preprocess the data to include a formatted date
    const processedData = consistencyData.map(data => ({
        ...data,
        week: convertWeekToDate(data.week)
    }));


    //FETCH EXERCISES FOR SELECT DROPDOWN
    const [exercises1rm, setExercises1rm] = useState([]);

    useEffect(() => {
        const fetchExercises1rm = async () => {
        try {
            const response = await apiClient.get('/exercises_with_weights/');
            setExercises1rm(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("Failed to fetch exercises:", error);
        }
        };
        fetchExercises1rm();
    }, []);

    const [data1rm, setData1rm] = useState()
    const [exerciseId, setExerciseId] = useState()
    //FETCH EXERCISE 1RM DATA
    useEffect(() => {
        const fetch1RMData = async () => {
          try {
            const response = await apiClient.get(`/exercise/${exerciseId.id}/1rm/`);
            setData1rm(response.data); // Assuming the data is in the response body directly
            console.log(response.data)
          } catch (err) {
            console.error("Failed to fetch 1RM data:", err);
            setData1rm([]); // Reset data on error
          }
        };
        if (exerciseId) {
          fetch1RMData();
        }
      }, [exerciseId]);

    useEffect(() => {
    if (exercises1rm.length > 0) {
        setExerciseId(exercises1rm[0]);
    }
    }, [exercises1rm]);


    return (
        <div className={`w-full md:border rounded-lg overflow-y-auto ${backgroundColorClass} md:p-4 pb-24`}>
            <Card className='border-0 md:border h-screen lg:h-full w-full md:border rounded-none md:rounded-lg flex justify-center p-4'>
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="col-span-2 h-48">
                    <Card className='flex w-full h-full'>
                        <div className='w-1/2 md:border-r h-full flex items-center gap-4'>
                            <Avatar className="ml-6 h-28 w-28">
                                <AvatarImage src={userInfo && userInfo.profile_picture && userInfo.profile_picture ||  "https://github.com/shadcn.png"} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='h-full flex flex-col justify-center'>
                                <h1 className='text-2xl font-semibold'>{user.username}</h1>
                            </div>
                        </div>
                        <div className='w-1/2 hidden md:block h-[80%]'>
                            <h1 className='font-semibold py-2 pl-4'>Total Weight Lifted</h1>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                width={500}
                                height={300}
                                data={totalWeightLifted}
                                margin={{ top: 10, right: -35, bottom: 15, left: 5 }}
                                >
                                <XAxis dataKey="date" 
                                tick={{ angle: -45, textAnchor: 'end' }}
                                padding={{ left: 20, bottom: 5}}
                                tickFormatter={(tickItem) => moment(tickItem).format('MM-DD')}
                                tickLine={false}
                                axisLine={false}
                                fontSize={9}/>
                                <YAxis yAxisId="left" 
                                tickFormatter={(value) => `${value} lbs`}
                                tickCount={7} // Example: Creates 5 evenly spaced ticks
                                domain={[0, 'dataMax']}
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}/>
                                <YAxis yAxisId="right" orientation="right" 
                                tickLine={false}
                                axisLine={false}
                                fontSize={0}
                                />
                                <Tooltip />
                                <Line yAxisId="left" type="monotone" dataKey="total_weight_lifted" stroke="#471fad" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        
                    </Card>
                </div>

                <div className='border rounded-lg col-span-2 md:hidden h-full'>
                <h1 className='font-semibold py-2 pl-4'>Total Weight Lifted</h1>
                    <ResponsiveContainer width="100%" height="83%">
                        <LineChart
                        width={500}
                        height={300}
                        data={totalWeightLifted}
                        margin={{ top: 10, right: -35, bottom: 15, left: 5 }}
                        >
                        <XAxis dataKey="date" 
                        tick={{ angle: -45, textAnchor: 'end' }}
                        padding={{ left: 20, bottom: 5}}
                        tickFormatter={(tickItem) => moment(tickItem).format('MM-DD')}
                        tickLine={false}
                        axisLine={false}
                        fontSize={9}/>
                        <YAxis yAxisId="left" 
                        tickFormatter={(value) => `${value} lbs`}
                        tickCount={7} // Example: Creates 5 evenly spaced ticks
                        domain={[0, 'dataMax']}
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}/>
                        <YAxis yAxisId="right" orientation="right" 
                        tickLine={false}
                        axisLine={false}
                        fontSize={0}
                        />
                        <Tooltip />
                        <Line yAxisId="left" type="monotone" dataKey="total_weight_lifted" stroke="#471fad" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="h-[400px] col-span-2 md:col-span-1 row-span-2 ">
                    <Card className='w-full h-full flex justify-center pt-1'>
                        <ProCalendar
                            onDataReceive={handleDayData}
                            userWorkoutSessions={userWorkoutSessions}
                            onSelect={handleSelect}
                            mode="single"
                            selected={date}
                            className="h-[100%] w-full pt-4 px-1"
                            />
                        <Drawer open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <DrawerContent className='h-full pt-2'>
                                {dayData.workout ? 
                                <div className='h-full overflow-y-scroll scrollbar-custom px-4 pt-8 pb-4'>
                                    <div className='flex items-center justify-between pr-2'>
                                    <h1 className='font-semibold text-lg'>{dayData.workout.name}</h1>
                                    <h1>{formattedDate}</h1>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className='pl-0'>Exercises</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {dayData.exercise_logs && dayData.exercise_logs.length > 0 ? (
                                                dayData.exercise_logs.map((exercise, index) => (
                                                    <TableRow key={exercise.id}>
                                                        <Accordion type="single" collapsible>
                                                            <AccordionItem value="item-1">
                                                                <AccordionTrigger className='p-0 pr-4'>
                                                                    <TableCell className="font-medium pl-0 flex gap-2">
                                                                        {index + 1}. {exercise.workout_exercise.exercise.name}
                                                                        <p className='text-sm text-muted-foreground'>{exercise.sets.length} sets</p>
                                                                    </TableCell>
                                                                </AccordionTrigger>
                                                                <AccordionContent>
                                                                    {exercise.sets.map((set) => (
                                                                        <div className='px-3'>
                                                                            <div className='p-4 w-full flex justify-between items-center'>
                                                                                <p className='w-2/5'>Set: {set.set_number}</p>
                                                                                <p className='w-2/5'>Reps: {set.reps}</p>
                                                                                <p className='w-1/2'>Weight: {set.weight_used ? set.weight_used : 0} lbs</p>
                                                                            </div>
                                                                            <Separator />
                                                                        </div>
                                                                    ))}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        </Accordion>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell className="text-center pt-8 text-xl font-semibold" colSpan="100%">No exercises logged for this day.</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            : <div className='h-full flex flex items-center justify-center gap-1'>
                                <h1 className='font-semibold text-xl'>No data available for this day</h1>
                                <FontAwesomeIcon size='xl' className='mt-1' icon={faFaceFrown} />
                              </div>
                                }
                            </DrawerContent>
                        </Drawer>
                    </Card>
                </div>
                <div className="row-span-2 col-span-2 lg:col-span-1 xl:col-span-2 h-[400px]">
                    <Card className='w-full h-full flex flex-col'>
                    <div className='flex justify-between items-center px-4 py-6'>
                        <h1 className='text-xl font-semibold'>{exerciseId && exerciseId.name} Estimated 1RM</h1>
                        <Select value={exerciseId} onValueChange={(newValue) => setExerciseId(newValue)} defaultValue="">
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Exercise" />
                            </SelectTrigger>
                            <SelectContent>
                                {exercises1rm.map((exercise) => (
                                    <SelectItem value={exercise} key={exercise.id}>{exercise.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                    
                        <LineChart
                            width={500}
                            height={300}
                            data={data1rm}
                            margin={{ top: 10, right: 30, left: 5, bottom: 5 }}
                        >
                            <XAxis dataKey="day" 
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
                            <Line type="monotone" strokeWidth={2} dataKey="one_rm" stroke="#471fad" activeDot={{r: 8, style: { fill: "var(--theme-primary)" },}} />
                        </LineChart>
                    </ResponsiveContainer>
                    </Card>
                </div>


                <div className="mb-[1px] h-52 col-span-2 xl:col-span-1 xl:row-span-1">
                    <Card className='w-full h-48'>
                        <h1 className='font-semibold px-4 py-2'>Workouts Per Week</h1>
                        <ResponsiveContainer width="100%" height={145}>
                            <BarChart data={processedData}
                             margin={{ top: 15, right: 25, bottom: 5, left: -25 }}>

                                <XAxis
                                dataKey="week"
                                stroke="#888888"
                                fontSize={9}
                                tickLine={false}
                                axisLine={false}
                                tick={{ angle: -45, textAnchor: 'end' }}
                                />
                                <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                                
                                />
                                <Bar
                                dataKey="workouts"
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