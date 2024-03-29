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
  import { Textarea } from '@/components/ui/textarea';
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
import { faEllipsis, faPlus, faChevronRight, faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
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
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectGroup,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Search } from "lucide-react"
  
  
  
const Train = () => {
    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';
    const navigate = useNavigate();

    const [phasesDetails, setPhasesDetails] = useState([]);
    const [userWorkoutSessions, setUserWorkoutSessions] = useState([])
    const [dayData, setDayData] = useState({});
    const [displayCurrentWorkout, setDisplayCurrentWorkout] = useState(true);
    const [programName, setProgramName] = useState("");

    //drawer
    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    //drawer

    const getActiveProgram = () => {
        apiClient.get('/get_active_program/') // Make sure the endpoint matches your Django URL configuration
        .then(response => {
            setActiveProgram(response.data);
            setWorkouts(response.data.phases[0].workouts)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }
    //fetch active program and workouts
    const [activeProgram, setActiveProgram] = useState(null)
    const [workouts, setWorkouts] = useState([])
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
    //fetch exercises
    const [exercises, setExercises] = useState([]);
    useEffect(() => {
        apiClient.get('exercises/').then((res) => {
            setExercises(res.data)
        }) 
    }, [])
    
    //get user workout sessions
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
    
    useEffect(() => {
        apiClient.get('/user_programs/') // Make sure the endpoint matches your Django URL configuration
        .then(response => {
            setUserPrograms(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    //create, delete, update workout_exercises
    const addNewExerciseToWorkout = () => {
        let exerciseData = {
            exercise_name: newExercise,
            sets: newExerciseSets,
            reps: newExerciseReps, 
            workout: clickedWorkout.id
        }
        apiClient.post('workout_exercises/', exerciseData)
        .then(response => {
            const newExerciseData = response.data; // The new exercise from the server response

            // Update clickedWorkoutExercises with the new exercise
            setClickedWorkoutExercises(prevExercises => [...prevExercises, newExerciseData]);

            // Also, update the workouts state to include the new exercise in the corresponding workout
            setWorkouts(currentWorkouts => currentWorkouts.map(workout => {
                if (workout.id === clickedWorkout.id) {
                    return {
                        ...workout,
                        workout_exercises: [...workout.workout_exercises, newExerciseData]
                    };
                }
                return workout;
            }));
            console.log(response)
            setNewExercise("")
            setNewExerciseSets("")
            setNewExerciseReps("")
            closeDrawer();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    };
    const [newExercise, setNewExercise] = useState("")
    const [newExerciseSets, setNewExerciseSets] = useState()
    const [newExerciseReps, setNewExerciseReps] = useState()
    const deleteWorkoutExercise = (exerciseId) => {
        apiClient.delete(`/workout_exercises/${exerciseId}/`)
            .then(response => {
                console.log(response)
                setWorkouts(currentWorkouts => currentWorkouts.map(workout => {
                    if (workout.id === clickedWorkout.id) {
                        // Remove the deleted exercise from this workout's exercises
                        return {
                            ...workout,
                            workout_exercises: workout.workout_exercises.filter(exercise => exercise.id !== exerciseId)
                        };
                    }
                    return workout;
                }));
    
                // Update clickedWorkoutExercises to reflect the deletion
                setClickedWorkoutExercises(currentExercises =>
                    currentExercises.filter(exercise => exercise.id !== exerciseId)
                );
            })

        .catch(error => console.log('Error', error))
    }
    function updateWorkout() {
        const workoutData = {
            id: clickedWorkout.id,
            workout_exercises: clickedWorkoutExercises.map(({id, exercise, sets, reps, note, video}) => ({
                exercise_name: exercise.name, 
                sets,
                reps,
                note,
                video,
            })),
            name: clickedWorkout.name,
            phase: 1
        }
        apiClient.put(`/workouts/${clickedWorkout.id}/`, workoutData) 
        .then(response => {
            console.log('Workout updated successfully:', response.data);
            closeDrawer();
        })
        .catch(error => {
            console.error('Failed to update workout:', error);
        });
    } 
    const handleEditSetsChange = (exerciseId, newSets) => {
        const updatedExercises = clickedWorkoutExercises.map(exerciseDetail => {
          if (exerciseDetail.exercise.id === exerciseId) {
            return { ...exerciseDetail, sets: newSets };
          }
          return exerciseDetail;
        });
        setClickedWorkoutExercises(updatedExercises);
    }
    const handleEditRepsChange = (exerciseId, newReps) => {
        const updatedExercises = clickedWorkoutExercises.map(exerciseDetail => {
          if (exerciseDetail.exercise.id === exerciseId) {
            return { ...exerciseDetail, reps: newReps };
          }
          return exerciseDetail;
        });
        setClickedWorkoutExercises(updatedExercises);
    }
    const clickToAddExercise = (exerciseName) => {
        setNewExercise(exerciseName)
    }
    //create, delete, update workout_exercises


    //carousel
    const [clickedWorkout, setClickedWorkout] = useState()
    const [clickedWorkoutExercises, setClickedWorkoutExercises] = useState([])
    const [carouselApi, setCarouselApi] = useState(null);
    const handleWorkoutClick = (workout) => {
        setClickedWorkout(workout);
        setClickedWorkoutExercises(workout.workout_exercises);
        console.log(workout)
        if (carouselApi) {
            carouselApi.scrollTo(1); 
          }
    };
    useEffect(() => {
        if (!clickedWorkout && workouts && workouts.length > 0) {
            setClickedWorkout(workouts[0]);
            setClickedWorkoutExercises(workouts[0].workout_exercises);
        }
    }, [workouts, clickedWorkout]);
    //carousel

    
    //create and delete workout
    const [workoutName, setWorkoutName] = useState('')
    function createWorkout() {
        const workoutData = {
            phase: 1,
            name: workoutName,
            workout_exercises: []
        };
    
        apiClient.post('/workouts/', workoutData) 
        .then(response => {
            console.log(response)
            const newWorkout = response.data;
            setWorkouts(currentWorkouts => [...currentWorkouts, newWorkout]);
            setWorkoutName("");
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
        }
    function deleteWorkout(workoutId) {
        apiClient.delete(`/workouts/${workoutId}/`)
        .then(() => {
            setWorkouts(currentWorkouts => currentWorkouts.filter(workout => workout.id !== workoutId));
            console.log(response)
        })
        .catch(error => {
            console.error('Error deleting the phase:', error);
        });
        }
    const handleWorkoutNameChange = (event) => {
            setWorkoutName(event.target.value)
        }
    //create and delete workout


    //calendar stuff
    const [date, setDate] = React.useState(new Date())
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
    //calendar stuff


    //program stuff
    const [selectedProgram, setSelectedProgram] = useState(null)
    const [userPrograms, setUserPrograms] = useState([])
    const [currentWorkout, setCurrentWorkout] = useState(null);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
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
    const handleNameInputChange = (event) => {
        setProgramName(event.target.value)
    }
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
    useEffect(() => {
        fetchCurrentWorkout();
    }, [activeProgram]);
    const handleSheetOpenChange = (open) => {
        setIsSheetOpen(open);

        // If the Sheet is being closed (open is false), reset selectedWorkout
        if (!open) {
            setSelectedWorkout(null);
        }
    }
    //program stuff

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
            <Card className='relative border-0 md:border h-full w-full flex flex-col rounded-none md:rounded-lg'>
                <div className='flex h-full w-full'>

                    <div className='flex flex-col h-full basis-full w-full lg:basis-2/5 px-6  md:px-0 md:pl-6'>
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
                                       
                                        <CarouselItem value='overview' className='max-h-full flex flex-col'>
                                            <div className="flex-grow mt-2">
                                            <Card className='border-none rounded-none h-full'>
                                                <CardContent className="p-0 items-center justify-center flex flex-col gap-2">
                                                {workouts && workouts.map((workout, index) => (
                                                    <div className={`w-full flex justify-between h-20 px-4 border rounded-xs relative`} 
                                                    key={workout.id} onClick={() => handleWorkoutClick(workout)}>
                                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${clickedWorkout && clickedWorkout.id === workout.id ? 'bg-primary' : 'bg-transparent'}`} style={{width: '5px'}}></div>
                                                        <div className='font-semibold p-2'>{index + 1}. {workout.name}</div>
                                                        <div>
                                                            <FontAwesomeIcon className='absolute top-8 right-8' icon={faChevronRight} />
                                                            <Popover >
                                                                <PopoverTrigger onClick={(event) => event.stopPropagation()} className='absolute top-1 right-3'><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                                                                <PopoverContent className='w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md'>
                                                                    <Button onClick={(event) => {event.stopPropagation(); deleteWorkout(workout.id); }}  className='px-2 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>
                                                                    Delete Workout</Button>
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                ))}
                                                <AlertDialog>
                                                    <AlertDialogTrigger className='w-full flex items-center' asChild>
                                                        <div className='w-full py-4 px-4 text-primary font-semibold underline-offset-4 hover:underline'><FontAwesomeIcon className='mr-2' icon={faPlus}/>Add Workout</div>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <Tabs defaultValue="create">
                                                        <TabsList>
                                                            <TabsTrigger value="create">Create Workout</TabsTrigger>
                                                            <TabsTrigger value="ai">AI Workout</TabsTrigger>
                                                        </TabsList>

                                                        <TabsContent value="create">
                                                            <Label htmlFor="programName">Name</Label><Input className='mb-2' value={workoutName} onChange={handleWorkoutNameChange} autoComplete="off" id="workoutName" />
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={createWorkout}>Create Workout</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </TabsContent>
                                                        <TabsContent value="ai">
                                                            <div className='flex gap-2 my-2'>
                                                                <Select>
                                                                    <SelectTrigger className="w-20">
                                                                        <SelectValue placeholder="Level" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="light">Light</SelectItem>
                                                                        <SelectItem value="dark">Dark</SelectItem>
                                                                        <SelectItem value="system">System</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <Select>
                                                                    <SelectTrigger className="w-20">
                                                                        <SelectValue placeholder="Split" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="light">Light</SelectItem>
                                                                        <SelectItem value="dark">Dark</SelectItem>
                                                                        <SelectItem value="system">System</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <Select>
                                                                    <SelectTrigger className="w-20">
                                                                        <SelectValue placeholder="Goal" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="light">Light</SelectItem>
                                                                        <SelectItem value="dark">Dark</SelectItem>
                                                                        <SelectItem value="system">System</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <Select>
                                                                    <SelectTrigger className="w-28">
                                                                        <SelectValue placeholder="Equipment" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="light">Light</SelectItem>
                                                                        <SelectItem value="dark">Dark</SelectItem>
                                                                        <SelectItem value="system">System</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <Label htmlFor="prompt">Additional Details</Label><Textarea  className='mb-2' placeholder="Describe your workout here." id='prompt' />
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={createWorkout}>Create Workout</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </TabsContent>
                                                        </Tabs>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                </CardContent>
                                            </Card>
                                            </div>
                                        </CarouselItem>
                                        <CarouselItem value='details' className='flex flex-col'>
                                            <div className="flex-grow mt-2">
                                            <Card className='border-none rounded-none h-full'>
                                                <CardContent className="p-0 justify-center flex flex-col gap-2">
                                                    <div className='flex gap-10 items-center'>
                                                        <h1 className='p-1 font-semibold text-xl'>{clickedWorkout && clickedWorkout.name}</h1>
                                                        <p className='text-sm text-muted-foreground'>{clickedWorkout && clickedWorkout.workout_exercises ? clickedWorkout.workout_exercises.length : 0} exercises</p>
                                                    </div>
                                                <ScrollArea className='flex flex-col gap-2 max-h-[600px] md:max-h-[400px] overflow-y-auto pb-24 md:pb-0 md:pr-2'>
                                                {clickedWorkoutExercises && clickedWorkoutExercises.map((workout_exercise, index) => (
                                                        <div key={workout_exercise.id} className='py-6 my-2 px-4 w-full flex  border rounded-xs relative'>
                                                            <div className='w-1/2 font-semibold'>{index + 1}. {workout_exercise.exercise.name}</div>
                                                            <div className='ml-4'>{workout_exercise.sets} x {workout_exercise.reps}</div>
                                                            <Drawer>
                                                                <DrawerTrigger className='absolute top-1 right-3'><FontAwesomeIcon icon={faEllipsis} /></DrawerTrigger>
                                                                <DrawerContent className='h-1/2'>
                                                                    <DrawerHeader>
                                                                    <DrawerTitle>Edit Exercise</DrawerTitle>
                                                                    </DrawerHeader>
                                                                    <div className='flex items-center p-6 border rounded-sm mx-4'>
                                                                        <div className='w-1/3 font-semibold' >{workout_exercise.exercise.name}</div>
                                                                        <Select  value={workout_exercise.sets > 0 ? workout_exercise.sets.toString() : ''}
                                                                        onValueChange={(newValue) => handleEditSetsChange(workout_exercise.exercise.id, parseInt(newValue, 10))}
                                                                        >
                                                                            <SelectTrigger className="w-[55px] md:w-[80px] focus:ring-0 focus:ring-offset-0">
                                                                                <SelectValue placeholder='sets' />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectGroup>
                                                                                    <SelectLabel>sets</SelectLabel>
                                                                                    <SelectItem value="1">1</SelectItem>
                                                                                    <SelectItem value="2">2</SelectItem>
                                                                                    <SelectItem value="3">3</SelectItem>
                                                                                    <SelectItem value="4">4</SelectItem>
                                                                                    <SelectItem value="5">5</SelectItem>
                                                                                    <SelectItem value="6">6</SelectItem>
                                                                                    <SelectItem value="7">7</SelectItem>
                                                                                    <SelectItem value="8">8</SelectItem>
                                                                                    <SelectItem value="9">9</SelectItem>
                                                                                    <SelectItem value="10">10</SelectItem>
                                                                                    <SelectItem value="11">11</SelectItem>
                                                                                    <SelectItem value="12">12</SelectItem>
                                                                                    <SelectItem value="13">13</SelectItem>
                                                                                    <SelectItem value="14">14</SelectItem>
                                                                                    <SelectItem value="15">15</SelectItem>
                                                                                    <SelectItem value="16">16</SelectItem>
                                                                                    <SelectItem value="17">17</SelectItem>
                                                                                    <SelectItem value="18">18</SelectItem>
                                                                                    <SelectItem value="19">19</SelectItem>
                                                                                    <SelectItem value="20">20</SelectItem>
                                                                                </SelectGroup>
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FontAwesomeIcon className='m-2' icon={faXmark} />
                                                                        <Select  value={workout_exercise.reps > 0 ? workout_exercise.reps.toString() : ''}
                                                                        onValueChange={(newValue) => handleEditRepsChange(workout_exercise.exercise.id, parseInt(newValue, 10))}
                                                                        >
                                                                            <SelectTrigger className="w-[55px] md:w-[80px] focus:ring-0 focus:ring-offset-0">
                                                                                <SelectValue placeholder='reps' />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectGroup>
                                                                                    <SelectLabel>reps</SelectLabel>
                                                                                    <SelectItem value="1">1</SelectItem>
                                                                                    <SelectItem value="2">2</SelectItem>
                                                                                    <SelectItem value="3">3</SelectItem>
                                                                                    <SelectItem value="4">4</SelectItem>
                                                                                    <SelectItem value="5">5</SelectItem>
                                                                                    <SelectItem value="6">6</SelectItem>
                                                                                    <SelectItem value="7">7</SelectItem>
                                                                                    <SelectItem value="8">8</SelectItem>
                                                                                    <SelectItem value="9">9</SelectItem>
                                                                                    <SelectItem value="10">10</SelectItem>
                                                                                    <SelectItem value="11">11</SelectItem>
                                                                                    <SelectItem value="12">12</SelectItem>
                                                                                    <SelectItem value="13">13</SelectItem>
                                                                                    <SelectItem value="14">14</SelectItem>
                                                                                    <SelectItem value="15">15</SelectItem>
                                                                                    <SelectItem value="16">16</SelectItem>
                                                                                    <SelectItem value="17">17</SelectItem>
                                                                                    <SelectItem value="18">18</SelectItem>
                                                                                    <SelectItem value="19">19</SelectItem>
                                                                                    <SelectItem value="20">20</SelectItem>
                                                                                </SelectGroup>
                                                                            </SelectContent>
                                                                        </Select>
                                                                        <FontAwesomeIcon className='ml-auto' size='lg' onClick={() => deleteWorkoutExercise(workout_exercise.id)} icon={faTrashCan} />
                                                                    </div>
                                                                    <DrawerFooter>
                                                                        <DrawerClose asChild>
                                                                            <Button onClick={() => updateWorkout()}>Save</Button>
                                                                        </DrawerClose>
                                                                    </DrawerFooter>
                                                                </DrawerContent>
                                                            </Drawer>
                                                        </div>
                                                    ))}
                                                     
                                                    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                                                        <DrawerTrigger className='w-full flex items-center'>
                                                        <div className='py-4 px-4 text-lg text-primary font-semibold underline-offset-4 hover:underline'><FontAwesomeIcon className='mr-2' icon={faPlus}/>
                                                        Add Exercise</div>
                                                        </DrawerTrigger>
                                                        <DrawerContent className='h-3/4'>
                                                                <div className='flex flex-col'>
                                                                    <Card className='border-none m-2'>
                                                                        <CardHeader className='pt-4 pb-0 px-4 '>
                                                                            <CardTitle className='text-xl'>
                                                                                Add New Exercise
                                                                            </CardTitle>
                                                                        </CardHeader>
                                                                        <CardContent className='px-4 py-4 flex flex-col items-end'>
                                                                            <div className='flex items-center gap-1'>
                                                                                <Input placeholder="Add Exercise" onChange={(event) => setNewExercise(event.target.value)} value={newExercise}/>
                                                                                <Select value={newExerciseSets} onValueChange={(newValue) => setNewExerciseSets(newValue)}>
                                                                                    <SelectTrigger className="w-[80px] md:w-[80px] focus:ring-0 focus:ring-offset-0">
                                                                                        <SelectValue placeholder='sets' />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        <SelectGroup>
                                                                                            <SelectLabel>sets</SelectLabel>
                                                                                            <SelectItem value="1">1</SelectItem>
                                                                                            <SelectItem value="2">2</SelectItem>
                                                                                            <SelectItem value="3">3</SelectItem>
                                                                                            <SelectItem value="4">4</SelectItem>
                                                                                            <SelectItem value="5">5</SelectItem>
                                                                                            <SelectItem value="6">6</SelectItem>
                                                                                            <SelectItem value="7">7</SelectItem>
                                                                                            <SelectItem value="8">8</SelectItem>
                                                                                            <SelectItem value="9">9</SelectItem>
                                                                                            <SelectItem value="10">10</SelectItem>
                                                                                            <SelectItem value="11">11</SelectItem>
                                                                                            <SelectItem value="12">12</SelectItem>
                                                                                            <SelectItem value="13">13</SelectItem>
                                                                                            <SelectItem value="14">14</SelectItem>
                                                                                            <SelectItem value="15">15</SelectItem>
                                                                                            <SelectItem value="16">16</SelectItem>
                                                                                            <SelectItem value="17">17</SelectItem>
                                                                                            <SelectItem value="18">18</SelectItem>
                                                                                            <SelectItem value="19">19</SelectItem>
                                                                                            <SelectItem value="20">20</SelectItem>
                                                                                        </SelectGroup>
                                                                                    </SelectContent>
                                                                                </Select>
                                                                                <FontAwesomeIcon className='m-1' icon={faXmark} />
                                                                                <Select value={newExerciseReps} onValueChange={(newValue) => setNewExerciseReps(newValue)}>
                                                                                    <SelectTrigger className="w-[80px] md:w-[80px] focus:ring-0 focus:ring-offset-0">
                                                                                        <SelectValue placeholder='reps' />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        <SelectGroup>
                                                                                            <SelectLabel>reps</SelectLabel>
                                                                                            <SelectItem value="1">1</SelectItem>
                                                                                            <SelectItem value="2">2</SelectItem>
                                                                                            <SelectItem value="3">3</SelectItem>
                                                                                            <SelectItem value="4">4</SelectItem>
                                                                                            <SelectItem value="5">5</SelectItem>
                                                                                            <SelectItem value="6">6</SelectItem>
                                                                                            <SelectItem value="7">7</SelectItem>
                                                                                            <SelectItem value="8">8</SelectItem>
                                                                                            <SelectItem value="9">9</SelectItem>
                                                                                            <SelectItem value="10">10</SelectItem>
                                                                                            <SelectItem value="11">11</SelectItem>
                                                                                            <SelectItem value="12">12</SelectItem>
                                                                                            <SelectItem value="13">13</SelectItem>
                                                                                            <SelectItem value="14">14</SelectItem>
                                                                                            <SelectItem value="15">15</SelectItem>
                                                                                            <SelectItem value="16">16</SelectItem>
                                                                                            <SelectItem value="17">17</SelectItem>
                                                                                            <SelectItem value="18">18</SelectItem>
                                                                                            <SelectItem value="19">19</SelectItem>
                                                                                            <SelectItem value="20">20</SelectItem>
                                                                                        </SelectGroup>
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            </div>
                                                                            <Button onClick={addNewExerciseToWorkout} className='text-lg w-1/3 mt-2'>Add</Button>
                                                                        </CardContent>
                                                                    </Card>
                                                                    <Tabs  defaultValue='exerciseDatabase'>
                                                                        <div className='flex justify-center items-center w-full pb-2'>
                                                                        <TabsList className="mx-2 grid w-full grid-cols-2 gap-1 rounded-xs bg-muted">
                                                                            <TabsTrigger className='rounded-xs' value="exerciseDatabase">Frequently Used</TabsTrigger>
                                                                            <TabsTrigger className='rounded-xs' value="yourExercises">Exercise Database</TabsTrigger>
                                                                        </TabsList>
                                                                        </div>
                                                                        <Card className='border-none'>
                                                                        <div className="relative py-2 w-full flex justify-center items-center">
                                                                            <Search className="absolute left-4 top-5 h-4 w-4 text-muted-foreground" />
                                                                            <Input placeholder="Search" className="pl-8 w-full mx-2" />
                                                                        </div>
                                                                        <TabsContent className='m-0' value="exerciseDatabase">
                                                                            <ScrollArea className="h-96 w-full rounded-md border-none bg-background">
                                                                                <div className="p-4">
                                                                                {exercises.map((exercise)=> {
                                                                                    return (
                                                                                        <div onClick={() => clickToAddExercise(exercise.name)} key={exercise.name}>
                                                                                            <div className="p-2 text-sm">{exercise.name}</div>
                                                                                            <Separator className="my-2" />
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                                </div>
                                                                            </ScrollArea>
                                                                        </TabsContent>
                                                                        <TabsContent className='m-0' value="yourExercises">
                                                                            <ScrollArea className="h-96 w-full rounded-md border-none bg-background">
                                                                                    <div className="p-4">
                                                                                        
                                                                                    </div>
                                                                                </ScrollArea>
                                                                        </TabsContent>
                                                                        </Card>
                                                                    </Tabs>
                                                                </div>
                                                            <DrawerFooter>
                                                                
                                                            <DrawerClose asChild>
                                                                <Button className='text-lg' variant="outline">Cancel</Button>
                                                            </DrawerClose>
                                                            </DrawerFooter>
                                                        </DrawerContent>
                                                    </Drawer>
                                                    </ScrollArea>
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
                            <Button size='lg' onClick={startWorkoutSession} className='fixed bottom-28 right-8 lg:static self-center p-6 text-lg'>Start Session!</Button>
                            <Sheet  open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
                                <SheetTrigger asChild>
                                    <Button variant='outline' onClick={() => setIsSheetOpen(true)} className=' hidden self-center w-1/2 md:w-2/5 p-6 text-lg'>Change Workout</Button>
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

                    <div className='hidden lg:flex h-full items-center justify-center basis-3/5'>
                        <Calendar
                        onDataReceive={handleDayData}
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        className="h-[90%] my-4"
                        />
                    </div>
                    

                    
                    
                </div>
            </Card>
        </div>
    )
}

export default Train