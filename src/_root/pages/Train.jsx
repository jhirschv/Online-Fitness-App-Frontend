import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { ScrollArea } from "@/components/ui/scroll-area"
  import { Calendar } from "@/components/ui/calendar"
  import { Button } from "@/components/ui/button"
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
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
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
import { faEllipsis, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselTabs
} from "@/components/ui/customCarousel"
  
const Train = () => {
    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';
    const navigate = useNavigate();

    const [date, setDate] = React.useState(new Date())
    const [activeProgram, setActiveProgram] = useState(null)
    const [workouts, setWorkouts] = useState([])
    const [clickedWorkout, setClickedWorkout] = useState()
    const [carouselApi, setCarouselApi] = useState(null);
    useEffect(() => {
        if (workouts && workouts.length > 0) {
          setClickedWorkout(workouts[0]);
        }
      }, [workouts]);
    const handleWorkoutClick = (workout) => {
        setClickedWorkout(workout);
        if (carouselApi) {
            carouselApi.scrollTo(1); // Navigate to the second item
          }
    };
    const [selectedProgram, setSelectedProgram] = useState(null)
    const [userPrograms, setUserPrograms] = useState([])
    const [currentWorkout, setCurrentWorkout] = useState(null);
    const [phasesDetails, setPhasesDetails] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [userWorkoutSessions, setUserWorkoutSessions] = useState([])
    const [dayData, setDayData] = useState({});
    const [displayCurrentWorkout, setDisplayCurrentWorkout] = useState(true);
    const [programName, setProgramName] = useState("");
    const handleNameInputChange = (event) => {
        setProgramName(event.target.value); // Update state with input value
            };

        function createAndActivateProgram() {
            const programData = {
                name: programName
            };
        
            apiClient.post('create-and-activate/', programData)
            .then(response => {
                setActiveProgram(response.data)
                setWorkouts(response.data.phases[0].workouts)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }

    const handleDayData = (receivedDayData) => {
        console.log('Sending event data to parent:', receivedDayData);
        // Even if receivedDayData is undefined or null, setDayData to an empty object
        setDayData(receivedDayData || {});
        // Check if receivedDayData is truly an object with properties
        if (receivedDayData && Object.keys(receivedDayData).length > 0) {
            setDisplayCurrentWorkout(false);
        } else {
            setDisplayCurrentWorkout(true);
        }
    };

    const handleSelect = (newDate) => {
      setDate(newDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
    
      // Create a new Date object from newDate and strip time for comparison
      const selectedDate = new Date(newDate);
      selectedDate.setHours(0, 0, 0, 0);
    
      // Compare dates to check if the selected date is today
      if (selectedDate.getTime() === today.getTime()) {
        setDisplayCurrentWorkout(true);
      } else {
        setDisplayCurrentWorkout(false);
      }
    };

    function turnOffProgram() {
        apiClient.post(`/set_inactive_program/`, {program_id: activeProgram.id})
        .then(response => {
            setActiveProgram(null)
            setCurrentWorkout(null)
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error starting workout session:', error);
        });
    }

    function updateActiveProgram(selectedProgram) {
            const payload = {
                program_id: selectedProgram, 
            };

            apiClient.post('/set_active_program/', payload)
            .then(response => {
                return apiClient.get('/get_active_program/'); 
            })
            .then(response => {
                console.log(response.data)
                setActiveProgram(response.data);
                setWorkouts(response.data.phases[0].workouts)
                return apiClient.get('/current_workout/');
            })
            .then(response => {
                setCurrentWorkout(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setCurrentWorkout(null)
        });
        
    }
    const startWorkoutSession = () => {
        const payload = {
            workout_id: currentWorkout.id, 
        };

        apiClient.post('/start_workout_session/', payload)
            .then(response => {
                console.log(response.data);
                navigate(`/workoutSession/${response.data.session_id}`);
            })
            .catch(error => {
                console.error('Error starting workout session:', error);
            });
    }
    const handleProgramClick = (programId) => {
        setSelectedProgram(programId)
    }
    const updateWorkoutProgress = async (selectedWorkout) => {
        try {
            const response = await apiClient.post('/update_workout_progress/', {
                phase_id: selectedWorkout.phaseId,
                week_number: selectedWorkout.week,
                workout_id: selectedWorkout.workoutId
            });
    
            // Check if the update was successful
            if (response.status === 200) {
                // Re-fetch the current workout to update the UI
                fetchCurrentWorkout();
            }
        } catch (error) {
            console.error('Failed to update workout progress:', error);
            // Handle error appropriately
        }
    }
    function handleSelectedWorkout(data) {
        setSelectedWorkout(data)
        console.log(data)
    }
    const fetchCurrentWorkout = () => {
        apiClient.get('/current_workout/') // Make sure the endpoint matches your Django URL configuration
        .then(response => {
            setCurrentWorkout(response.data);
            setDisplayCurrentWorkout(true);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
    const handleSheetOpenChange = (open) => {
        setIsSheetOpen(open);

        // If the Sheet is being closed (open is false), reset selectedWorkout
        if (!open) {
            setSelectedWorkout(null);
        }
    }

    useEffect(() => {
        apiClient.get('/user_workout_sessions/')
            .then(response => {
                setUserWorkoutSessions(response.data)
                })
            
            .catch(error => console.error('Error:', error));
        }, []);

    useEffect(() => {
        if (activeProgram) { // Check if activeProgram is not null
            const fetchData = async () => {
                try {
                    const programId = activeProgram.id; // Assuming activeProgram contains an id field
                    const response = await apiClient.get(`phase_details/${programId}/`);
                    setPhasesDetails(response.data);
                } catch (error) {
                    console.error('Error fetching phases and workouts:', error);
                }
            };
            fetchData();
        }
    }, [activeProgram]);
     // This effect depends on programId   
    useEffect(() => {
        apiClient.get('/get_active_program/') // Make sure the endpoint matches your Django URL configuration
        .then(response => {
            setActiveProgram(response.data);
            setWorkouts(response.data.phases[0].workouts)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    useEffect(() => {
        fetchCurrentWorkout();
    }, [activeProgram]);

    useEffect(() => {
        apiClient.get('/user_programs/') // Make sure the endpoint matches your Django URL configuration
        .then(response => {
            setUserPrograms(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    const renderWorkoutDetails = (workout) => {
        return (
            <>
                <div className='flex w-full items-center justify-between pr-2'>
                    <h1 className='font-semibold text-lg'>{workout.name}</h1>
                    <Popover>
                        <PopoverTrigger><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                        <PopoverContent>Place content for the popover here.</PopoverContent>
                    </Popover>
                </div>

                <Table className='h-full w-full'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] pl-0">Exercise</TableHead>
                            <TableHead>Sets x Reps</TableHead>
                            <TableHead>Note</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workout.workout_exercises.map((exercise) => (
                            <TableRow key={exercise.id}>
                                <TableCell >{exercise.exercise.name}</TableCell>
                                <TableCell >{`${exercise.sets} x ${exercise.reps}`}</TableCell>
                                <TableCell>{exercise.note || ''}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </>
        );
    };

    const renderWorkoutSessionDetails = (workout) => {

        const workoutDate = new Date(workout.date);

        // Format the date
        const formattedDate = workoutDate.toLocaleDateString('en-US', {
            year: 'numeric', // "2024"
            month: 'long', // "March"
            day: 'numeric', // "8"
        });
        
        return (
        <>
                <div className='flex items-center justify-between pr-2'>
                    <h1 className='font-semibold text-lg'>{workout.workout.name}</h1>
                    <h1>{formattedDate}</h1>
                    <h1>Completed: {workout.completed.toString()}</h1>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Exercise</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <ScrollArea className='h-92 W-full'>
                            {workout.exercise_logs.map((exercise) => (
                                <TableRow key={exercise.id}>
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger className='p-0 pr-4'>
                                                <TableCell className="font-medium pl-0">{exercise.workout_exercise.exercise.name}</TableCell>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                {exercise.sets.map((set) => (
                                                    <div className='px-3'>
                                                        <div className='p-4 w-full flex justify-between items-center'>
                                                            <p >Set: {set.set_number}</p>
                                                            <p>Reps: {set.reps}</p> 
                                                            <p>weight: {set.weight_used? set.weight_used: 0}</p>
                                                        </div>
                                                        
                                                        <Separator/>
                                                    </div>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                        </Accordion>
                                    
                                </TableRow>
                            ))}
                        </ScrollArea>
                    </TableBody>
                </Table>
            </>
        )
    }

    return (
        <div className={`${backgroundColorClass} w-full md:p-4 md:border md:rounded-lg`}>
            <Card className='border-0 md:border h-full w-full flex flex-col rounded-none md:rounded-lg'>
                <div className='flex h-full w-full'>

                    <div className='flex flex-col h-full basis-full w-full md:basis-2/5 px-6 md:pl-6'>
                        <div className='flex flex-col py-6'>
                            <div className='w-full flex'>
                                {activeProgram && <h1 className='mr-2 text-2xl font-semibold'>{activeProgram.name}</h1>}
                                <div className='ml-auto flex gap-4'>
                                    {activeProgram && <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="outline">All Programs</Button>
                                        </SheetTrigger>
                                        <SheetContent>
                                            <SheetHeader>
                                            <SheetTitle>Select Program</SheetTitle>
                                            </SheetHeader>
                                            {userPrograms.map((program) => (
                                            <div
                                                key={program.id}
                                                className={`p-4 rounded ${selectedProgram === program.id ? 'bg-secondary' : 'bg-background'}`}
                                                onClick={() => handleProgramClick(program.id)}
                                            >
                                                <h1>{program.name}</h1>
                                            </div>
                                            ))}
                                            <SheetFooter className='mt-4'>
                                            <SheetClose asChild>
                                                <Button type="submit" onClick={() => updateActiveProgram(selectedProgram)}>Save changes</Button>
                                            </SheetClose>
                                            </SheetFooter>
                                        </SheetContent>
                                    </Sheet>}
                                    {activeProgram &&
                                    <Popover>
                                        <PopoverTrigger><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                                        <PopoverContent className='w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md'>
                                            <Button onClick={turnOffProgram} className='px-2 py-1.5 text-sm outline-none hover:bg-accent bg-popover text-secondary-foreground'>Turn off program</Button>
                                        </PopoverContent>
                                    </Popover>}
                                </div>
                            </div>
                        </div>

                        <div className='flex-1 flex flex-col'>
                            {activeProgram ? (
                                <div className='flex flex-col h-full'>
                                    <Carousel onApiChange={setCarouselApi} className="flex flex-col w-full h-full">
                                    <CarouselTabs />
                                    <CarouselContent className='flex-1 h-full'>
                                       
                                        <CarouselItem value='overview' className='flex flex-col'>
                                            <div className="flex-grow mt-2">
                                            <Card className='border-none rounded-none h-full'>
                                                <CardContent className="p-0 items-center justify-center flex flex-col gap-2">
                                                {workouts && workouts.map((workout) => (
                                                    <div className={`w-full flex justify-between py-6 px-4 border rounded-xs ${clickedWorkout && clickedWorkout.id === workout.id ? 'bg-secondary' : 'bg-background'}`} 
                                                    key={workout.id} onClick={() => handleWorkoutClick(workout)}>
                                                        <div>{workout.name}</div>
                                                        <Popover>
                                                            <PopoverTrigger><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                                                            <PopoverContent>
                                                                <p>Edit Name</p>
                                                                <p>Delete</p>
                                                                </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                ))}
                                                    <div className='w-full py-4 px-4 border rounded-xs'><FontAwesomeIcon className='mr-2' icon={faPlus}/>Add Workout</div>
                                                </CardContent>
                                            </Card>
                                            </div>
                                        </CarouselItem>
                                        <CarouselItem value='details' className='flex flex-col'>
                                            <div className="flex-grow mt-2">
                                            <Card className='border-none rounded-none h-full'>
                                                <CardContent className="p-0 items-center justify-center flex flex-col gap-2">
                                                {clickedWorkout && clickedWorkout.workout_exercises.map((workout_exercise) => (
                                                        <div  className='w-full'>
                                                            <div className='w-full py-6 px-4 border rounded-xs'>{workout_exercise.exercise.name}</div>
                                                        </div>
                                                        
                                                    ))}
                                                    <div className='py-6 px-4 border rounded-xs w-full'><FontAwesomeIcon className='mr-2' icon={faPlus}/>Add Exercise</div>
                                                </CardContent>
                                            </Card>
                                            </div>
                                        </CarouselItem>
                                    </CarouselContent>
                                    </Carousel>
                                    {/* <Tabs defaultValue="overview" className="w-full">
                                    <TabsList className='rounded-xs'>
                                        <TabsTrigger className='rounded-xs' value="overview">Overview</TabsTrigger>
                                        <TabsTrigger className='rounded-xs' value="details">Details</TabsTrigger>
                                    </TabsList>
                                    <TabsContent className='flex flex-col gap-2' value="overview">
                                    {workouts && workouts.map((workout) => (
                                        <div className={`flex justify-between py-6 px-4 border rounded-sm ${clickedWorkout && clickedWorkout.id === workout.id ? 'bg-secondary' : 'bg-background'}`} 
                                        key={workout.id} onClick={() => handleWorkoutClick(workout)}>
                                            <div>{workout.name}</div>
                                            <Popover>
                                                <PopoverTrigger><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                                                <PopoverContent>
                                                    <p>Edit Name</p>
                                                    <p>Delete</p>
                                                    </PopoverContent>
                                            </Popover>
                                        </div>
                                        
                                       
                                    ))}
                                    <div className='py-4 px-4 border rounded-sm'><FontAwesomeIcon className='mr-2' icon={faPlus}/>Add Workout</div>

                                    </TabsContent>
                                    <TabsContent className='flex flex-col gap-2' value="details">
                                        {clickedWorkout && clickedWorkout.workout_exercises.map((workout_exercise) => (
                                            <div>
                                                <div className='py-6 px-4 border rounded-sm'>{workout_exercise.exercise.name}</div>
                                            </div>
                                            
                                        ))}
                                        <div className='py-6 px-4 border rounded-sm'><FontAwesomeIcon className='mr-2' icon={faPlus}/>Add Exercise</div>
                                    </TabsContent>
                                    </Tabs> */}
                                </div>
                            ) : (
                                <div className='w-full flex flex-col gap-2 mt-[35%] md:mt-[25%] items-center text-muted-foreground text-lg'>
                                    <h1>Nothing to see here!</h1>
                                    <h1>{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h1>
                                    <div className='flex items-center gap-2 mt-4'>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button className='rounded-xs' >Create Program</Button></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Create Program</AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <Label htmlFor="programName">Name</Label><Input onChange={handleNameInputChange} value={programName} autoComplete="off" id="programName" />
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={createAndActivateProgram}>Create</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>  
                                        <p className='text-sm'>or</p>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild><Button className='rounded-xs text-primary-foreground border-2' variant='outline' >Create workout</Button></AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your account
                                                    and remove your data from our servers.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction>Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>                                             
                                    </div>
                                    <Separator className='my-2'/>
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button className='rounded-xs' variant='secondary'>All Programs</Button>
                                        </SheetTrigger>
                                        <SheetContent>
                                            <SheetHeader>
                                            <SheetTitle>Select Program</SheetTitle>
                                            </SheetHeader>
                                            {userPrograms.map((program) => (
                                            <div
                                                key={program.id}
                                                className={`p-4 rounded ${selectedProgram === program.id ? 'bg-secondary' : 'bg-background'}`}
                                                onClick={() => handleProgramClick(program.id)}
                                            >
                                                <h1>{program.name}</h1>
                                            </div>
                                            ))}
                                            <SheetFooter className='mt-4'>
                                            <SheetClose asChild>
                                                <Button type="submit" onClick={() => updateActiveProgram(selectedProgram)}>Set Active</Button>
                                            </SheetClose>
                                            </SheetFooter>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            )
                            }







                                {/* {displayCurrentWorkout && currentWorkout ? (
                                    renderWorkoutDetails(currentWorkout)
                                ) : (
                                    !displayCurrentWorkout && dayData && (typeof dayData === 'object' && Object.keys(dayData).length > 0) ? (
                                        renderWorkoutSessionDetails(dayData)
                                    ) : (
                                        <div className='w-full flex flex-col gap-2 mt-[35%] md:mt-[25%] items-center text-muted-foreground text-lg'>
                                            <h1>Nothing to see here!</h1>
                                            <h1>{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h1>
                                            <div className='flex items-center gap-2 mt-4'>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild><Button className='rounded-xs' >Create Program</Button></AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>Create Program</AlertDialogTitle>
                                                        </AlertDialogHeader>
                                                        <Label htmlFor="programName">Name</Label><Input onChange={handleNameInputChange} value={programName} autoComplete="off" id="programName" />
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={createAndActivateProgram}>Create</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>  
                                                <p className='text-sm'>or</p>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild><Button className='rounded-xs text-primary-foreground border-2' variant='outline' >Create workout</Button></AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete your account
                                                            and remove your data from our servers.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction>Continue</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>                                             
                                            </div>
                                            <Separator className='my-2'/>
                                            <Button className='rounded-xs' variant='secondary'>Add From Library</Button>
                                        </div>
                                        
                                    )
                                )} */}
                        </div>
                        {currentWorkout && 
                        <div className='flex justify-center gap-4 items-center mb-6 '>
                            <Button onClick={startWorkoutSession} className='self-center p-6 text-lg'>Train!</Button>
                            <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
                                <SheetTrigger asChild>
                                    <Button variant='outline' onClick={() => setIsSheetOpen(true)} className='self-center w-1/2 md:w-2/5 p-6 text-lg'>Change Workout</Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <div className='w-full flex justify-center'>
                                        <Button onClick={() => { updateWorkoutProgress(selectedWorkout); setIsSheetOpen(false); }}  disabled={!selectedWorkout} className='self-center w-1/2 p-6 text-lg'>Save</Button>
                                    </div>
                                    <ScrollArea className="h-full w-full">
                                    <div>
                                        {/* Render phases, weeks, and workouts based on the fetched data */}
                                        {phasesDetails.map((phase) => (
                                            <div key={phase.id}>
                                            <h3 className='font-bold text-center p-2'>{phase.name}</h3>
                                            {phase.workouts_by_week.map((week, index) => (
                                                <div key={index}>
                                                <h4 className='font-semibold text-center p-2'>Week {week.week}</h4>
                                                {week.workouts.map((workout) => (
                                                    <p  onClick={() => handleSelectedWorkout({ phaseId: phase.id, week: week.week, workoutId: workout.id, workoutName: workout.name })}
                                                    className={`ml-4 p-4 border mr-4 ${selectedWorkout?.workoutId === workout.id && selectedWorkout?.week === week.week ? 'bg-secondary' : 'bg-background'}`} key={workout.id}>{workout.name}
                                                    </p>
                                                ))}
                                                </div>
                                            ))}
                                            </div>
                                        ))}
                                        </div>
                                    </ScrollArea>
                                </SheetContent>
                             </Sheet>
                        </div>}
                    </div>

                    <div className='hidden md:flex h-full items-center justify-center basis-3/5'>
                        <Calendar
                        onDataReceive={handleDayData}
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        className="h-[90%] m-4"
                        />
                    </div>
                    

                    
                    
                </div>
            </Card>
        </div>
    )
}

export default Train