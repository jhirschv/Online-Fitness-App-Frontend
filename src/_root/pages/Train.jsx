import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import useTouchScroll from '../../utils/useTouchScroll';
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
import { faEllipsis, faPlus, faChevronRight, faXmark, faTrashCan, faGripVertical, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { faFaceFrown } from '@fortawesome/free-regular-svg-icons';
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
  import { Reorder, useDragControls } from 'framer-motion';
  import { ReorderItem } from "@/components/ReorderItem";
  import { ReorderExercise } from "@/components/ReorderExercise";
  import { useContext, useRef } from 'react'
import AuthContext from '@/context/AuthContext';
import { ScaleLoader } from 'react-spinners';
import { Toaster } from "@/components/ui/toaster"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

  
  
const Train = ({programLoading, activeProgram, setActiveProgram, workouts, setWorkouts, userWorkoutSessions, sessionDetails, isActiveSession, fetchSessionDetails, loadingSessionDetails}) => {
    let { user } = useContext(AuthContext);
    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';
    const navigate = useNavigate();
    const { toast } = useToast()
    
    //ai workout
    const [prompt, setPrompt] = useState('');
    const [programPrompt, setProgramPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePromptChange = (e) => {
        setPrompt(e.target.value);
      };
    const handleProgramPromptChange = (e) => {
    setProgramPrompt(e.target.value);
    };


    const createAiWorkout = () => {
        const workoutData = {
            prompt: prompt,
            program_id: activeProgram.id // Assuming you have access to `activeProgram` here
        };
        setIsLoading(true)
        apiClient.post(`/api/openai/`, workoutData)
            .then(response => {
                getActiveProgram()
                fetchRemainingAIWorkouts()
                setPrompt('')
                console.log(response)
                })
            .catch(error => {
                console.error('Error:', error)
                toast({
                    title: "Workout Creation Failed",
                    description: error.response.data.error,
                    variant: "destructive"
                });
            })
            .finally(() => {
        setIsLoading(false); // Stop loading on completion
      });
    }

    function fetchRemainingAIWorkouts() {
        apiClient.get('/ai_workout_limit/')
            .then(response => {
                setRemainingAIWorkouts(response.data.remaining);
            })
            .catch(error => {
                console.error('Error fetching AI workout limit:', error);
            });
    }

    const [remainingAIWorkouts, setRemainingAIWorkouts] = useState();

    useEffect(() => {
        fetchRemainingAIWorkouts();  // Call the function on component mount
    }, []);

    const createAiProgram = () => {
        const workoutData = {
            prompt: programPrompt,
        };
        setIsLoading(true)
        apiClient.post(`/api/openaiprogram/`, workoutData)
            .then(response => {
                console.log(response)
                getActiveProgram()
                fetchUserPrograms()
                setProgramPrompt('')
            })
            .catch(error => {
                console.error('Error:', error)
                if (error.response && error.response.data && error.response.data.error) {
                    // If the error response contains a specific error message, display it
                    toast({
                        title: "Program Creation Failed",
                        description: error.response.data.error,
                        variant: "destructive"
                    });
                } else {
                    // If the error is not specific, display a generic error message
                    toast({
                        title: "Program Creation Failed",
                        description: "The program could not be created. Please try again.",
                        variant: "destructive"
                    });
                }
            })
            .finally(() => {
        setIsLoading(false);
      });
    }

    const [phasesDetails, setPhasesDetails] = useState([]);
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
            setWorkouts(response.data.workouts)
        })
        .catch(error => {
            setActiveProgram();
            setWorkouts([])
            console.error('Error fetching data:', error);
        });
    }

    

    //fetch exercises
    const [exercises, setExercises] = useState([]);
    const [userExercises, setUserExercises] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredExercises = exercises.filter((exercise) => {
        return exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Filter user exercises based on search term
    const filteredUserExercises = userExercises.filter((userExercise) => {
        return userExercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        apiClient.get('exercises/').then((res) => {
            setExercises(res.data)
        })
        apiClient.get('user_exercises/').then((res) => {
            setUserExercises(res.data);
        });
    }, [])

    /* useEffect(() => {
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
    }, [activeProgram]);  */

    function fetchUserPrograms() {
        apiClient.get('/user_programs/')
            .then(response => {
                setUserPrograms(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
        });
        apiClient.get('/ai_program_limit/')  // Endpoint to check the AI program limit
        .then(response => {
            setRemainingAIPrograms(response.data.remaining);  // Assuming the state for this is set up
        })
        .catch(error => {
            console.error('Error fetching AI program limit:', error);
        });
    }

    const [remainingAIPrograms, setRemainingAIPrograms] = useState();
    
    useEffect(() => {
        fetchUserPrograms();  // Call the function on component mount
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
            program: activeProgram.id
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
    const [watchDrag, setWatchDrag] = useState(true);
    const [isDragging, setIsDragging] = useState(false);

    const toggleWatchDrag = (shouldWatch) => {
        setWatchDrag(shouldWatch);
      };

    const handleWorkoutClick = (workout) => {
        if (isDragging) { 
            return;
        }
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

    const handleReorder = (newWorkouts) => {
        setWorkouts(newWorkouts);
        const workoutsData = newWorkouts.map((workout, index) => ({
            id: workout.id,
            order: index
        }));
    
        apiClient.post('/update_workout_order/', workoutsData)
        .then(response => {
            console.log('Order update success:', response);
            fetchSessionDetails();
        })
        .catch(error => {
            console.error('Order update error:', error);
        });
    };

    const handleExerciseReorder = (newExercises) => {
        setClickedWorkoutExercises(newExercises);
        const exerciseOrderData = newExercises.map((exercise, index) => ({
            id: exercise.id,
            order: index
        }));
    
        apiClient.post('/update_exercise_order/', exerciseOrderData)
        .then(response => {
            console.log('Exercise order update success:', response);
        })
        .catch(error => {
            console.error('Exercise order update error:', error);
        });
    };

    const [workoutName, setWorkoutName] = useState('')
    function createWorkout() {
        const workoutData = {
            program: activeProgram.id,
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
        .then(response => {
            // Update state to filter out the deleted workout
            setWorkouts(currentWorkouts => currentWorkouts.filter(workout => workout.id !== workoutId));
            // Log the response from the server
            console.log(response);
        })
        .catch(error => {
            // It might be useful to change this log to reflect the correct operation:
            console.error('Error deleting the workout:', error);
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
      setIsSheetOpen(true);
      
    
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

    const resetForm = () => {
        setProgramName('');
        };

    function createAndActivateProgram() {
        const programData = {
            name: programName
        };
        apiClient.post('create-and-activate/', programData)
        .then(response => {
            console.log("Response received:", response.data);  // Ensure this log is showing expected data
            if (response.data && response.data.program) {  // Adjust this according to the actual data structure
                setActiveProgram(response.data.program);
                setWorkouts(response.data.program.workouts || []);
                setClickedWorkout(null);
                setClickedWorkoutExercises([])
            }
            fetchUserPrograms();
            setSelectedProgram()
            toast({
                title: "Program Created!",
                description: "The program has been successfully created."
            });
            resetForm();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            toast({
                title: "Program Creation Failed",
                description: "The program could not be created. Please try again.",
                variant: "destructive"
            });
        });
    }

    function deleteProgram(programId) {
        apiClient.delete(`/programs/${programId}/`)
        .then(response => {
            console.log(response)
            fetchUserPrograms();
            getActiveProgram();
            setSelectedProgram()
            toast({
                title: "Program Deleted.",
                description: "The program has been successfully deleted."
            });
        }) // Use the DELETE method to request program deletion
        .catch(error => {
            console.error('Error deleting the program:', error);
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
            // Successfully set the active program, now fetch it
            return apiClient.get('/get_active_program/');
        })
        .then(response => {
            console.log(response.data);
            setSelectedProgram()
            setActiveProgram(response.data);
            // Check if there are workouts to set, if not skip setting workouts
            if (response.data && response.data.workouts) {
                setWorkouts(response.data.workouts);
            } else {
                setWorkouts([]); // Ensure workouts state is cleared or set to an empty array
            }
            setClickedWorkout(null);
            setClickedWorkoutExercises([])
            toast({
                title: "Program Actived.",
                description: "The program has been successfully deleted."
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            toast({
                title: "Error activating program",
                description: "The program could not be activated. Please try again.",
                variant: "destructive"
            });
        });
    }

    const startWorkoutSession = () => {
        const payload = {
            workout_id: clickedWorkout.id,
        };
    
        apiClient.post('/start_workout_session/', payload)
            .then(response => {
                console.log(response.data);
                fetchSessionDetails().then(() => {
                    navigate('/workoutSession');
                });
            })
            .catch(error => {
                console.error('Error starting workout session:', error);
            });
    };

    const resumeSession = () => {
        // Navigate to the session details page using the session ID from activeSessionDetails
        if (sessionDetails && sessionDetails.id) {
            
            navigate('/workoutSession');
        }
    };
    const handleProgramClick = (programId) => {
        setSelectedProgram(programId)
    }
    /* const updateWorkoutProgress = async (selectedWorkout) => {
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
    } */
    function handleSelectedWorkout(data) {
        setSelectedWorkout(data)
        console.log(data)
    }
    /* const fetchCurrentWorkout = () => {
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
    }, [activeProgram]); */

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

    const { touchAreaRef, handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchScroll(() => isDragging);
    const { touchAreaRef: touchAreaRef2, handleTouchStart: handleTouchStart2, handleTouchMove: handleTouchMove2, handleTouchEnd: handleTouchEnd2 } = useTouchScroll(() => isDragging);

    const renderWorkoutSessionDetails = (workout) => {

        const workoutDate = new Date(workout.date);

        // Format the date
        const formattedDate = workoutDate.toLocaleDateString('en-US', {
            year: 'numeric', // "2024"
            month: 'long', // "March"
            day: 'numeric', // "8"
        });
        
        return (
            <div className='h-full overflow-auto pt-4 pb-4'>
                <div className='flex items-center justify-between pr-2'>
                    <h1 className='font-semibold text-lg'>{workout.workout.name}</h1>
                    <h1>{formattedDate}</h1>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='pl-0'>Exercises</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workout.exercise_logs && workout.exercise_logs.length > 0 ? (
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
                                                        <div className='p-4 w-full flex items-center'>
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
                                <TableCell className="text-center" colSpan="100%">No exercises logged for this day.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        )
    }

    return (
        <div className={`${backgroundColorClass} overflow-hidden w-full md:p-4 md:border md:rounded-lg`}>
                        {isLoading && (
                <div className="absolute inset-0 flex flex-col justify-center items-center z-10 rounded-lg">
                    <ScaleLoader color="#2563eb" size={40} />
                    <h1 className='text-muted-foreground mt-2'>AI programs may take up to 2 minutes to create</h1>
                </div>
            )}
            {programLoading && (
                <div className="absolute inset-0 flex flex-col justify-center items-center z-10 rounded-lg">
                    <ScaleLoader color="#2563eb" size={40} />
                </div>
            )}
            <Toaster />
            <Card className='relative border-0 md:border h-full w-full flex flex-col rounded-none md:rounded-lg'>
                {!programLoading && (
                <div className='flex h-full w-full'>

                    <div className='flex flex-col h-full overflow-hidden w-full lg:basis-2/5 px-4  md:px-0 md:pl-6'>
                        <div className='h-full flex flex-col pt-4'>
                            {activeProgram ? (
                                <div className='flex flex-col h-full'>
                                    <Carousel watchDrag={watchDrag} onApiChange={setCarouselApi} className="flex flex-col w-full h-full">
                                        <div className='flex'>
                                        <CarouselTabs />
                                        <div className='ml-auto flex gap-4'>
                                        {activeProgram && 
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="outline">All Programs</Button>
                                            </SheetTrigger>
                                            <SheetContent className="md:w-[400px] w-[100%]">
                                                <SheetHeader className='text-left pl-4 flex flex-row justify-between items-center mt-4'>
                                                    <SheetTitle className='text-2xl' >All Programs</SheetTitle>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant='outline' className='flex items-center gap-1'><FontAwesomeIcon icon={faPlus} /><p className='mb-1'>New Program</p></Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                            <AlertDialogTitle>Create Program</AlertDialogTitle>
                                                            </AlertDialogHeader>
                                                            <Label htmlFor="programName">Name</Label><Input onChange={handleNameInputChange} value={programName} autoComplete="off" id="programName" />
                                                            <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <SheetClose asChild>
                                                                <AlertDialogAction onClick={createAndActivateProgram}>Create</AlertDialogAction>
                                                            </SheetClose>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>  
                                                </SheetHeader>
                                                <div className='flex flex-col gap-2 mt-2 overflow-y-auto max-h-[75vh] scrollbar-custom'>
                                                {userPrograms.map((program) => (
                                                <div
                                                    key={program.id}
                                                    className={`p-4 py-6 relative rounded border ${selectedProgram === program.id ? 'bg-secondary' : 'bg-background'}`}
                                                    onClick={() => handleProgramClick(program.id)}
                                                >
                                                    <h1>{program.name}</h1>
                                                    <div className='absolute bottom-6 right-2' onClick={(event) => event.stopPropagation()}>
                                                        <Popover>
                                                            <PopoverTrigger className='p-4'><FontAwesomeIcon size='lg' icon={faEllipsis} /></PopoverTrigger>
                                                            <PopoverContent className='w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md' >
                                                                <Button onClick={() => deleteProgram(program.id)} className='px-2 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>Delete Program</Button>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div> 
                                                </div>
                                                ))}
                                                </div>
                                                <SheetFooter className='mt-4'>
                                                <SheetClose asChild>
                                                    <Button type="submit" onClick={() => updateActiveProgram(selectedProgram)}>Set Active</Button>
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
                                    
                                    <CarouselContent className='h-full'>
                                       
                                        <CarouselItem value='overview' className='h-full flex flex-col overflow-hidden'>
                                            <div className="pt-2 h-full">
                                            <Card className='border-none rounded-none h-full'>
                                            
                                                <CardContent className="p-0 pb-6 h-full items-center flex flex-col gap-2">
                                                    <div className='flex gap-10 self-start items-center'>
                                                        <h1 className='mr-2 p-1 text-xl self-start font-semibold'>{activeProgram.name}</h1>
                                                        <p className='text-sm text-muted-foreground'>{activeProgram?.workouts?.length ?? 0} workouts</p>
                                                    </div>
                                                    <div 
                                                    onTouchStart={handleTouchStart}
                                                    onTouchMove={handleTouchMove}
                                                    onTouchEnd={handleTouchEnd}
                                                    ref={touchAreaRef} className='w-full flex-1 overflow-y-scroll scrollbar-custom' style={{ height: `calc(100vh - 150px)` }}>
                                                    <Reorder.Group
                                                        axis="y"
                                                        onReorder={handleReorder}
                                                        values={workouts}
                                                        className="w-full"
                                                    >
                                                        {workouts && workouts.map((workout, index) => (
                                                            <ReorderItem
                                                                isDragging={isDragging}
                                                                setIsDragging={setIsDragging}
                                                                onPointerDown={() => toggleWatchDrag(false)}
                                                                onPointerUp={() => toggleWatchDrag(true)}
                                                                onPointerCancel={() => toggleWatchDrag(true)}
                                                                handleWorkoutClick={handleWorkoutClick}
                                                                clickedWorkout={clickedWorkout}
                                                                deleteWorkout={deleteWorkout}
                                                                index={index}
                                                                key={workout.id}
                                                                workout={workout}
                                                            />
                                                        ))}
                                                    </Reorder.Group>
                                                    
                                                <AlertDialog>
                                                    <AlertDialogTrigger className='w-full flex items-center' asChild>
                                                        <div className='w-full py-4 text-lg text-primary font-semibold underline-offset-4 hover:underline text-x'><FontAwesomeIcon className='mr-2' icon={faPlus}/>Add Workout</div>
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
                                                            {/* <div className='flex flex-wrap gap-2 my-2'>
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
                                                            </div> */}
                                                            <p className='text-sm text-muted-foreground py-2'>You have {remainingAIWorkouts} AI workouts left this week.</p>
                                                            <Label htmlFor="prompt">Workout Description</Label><Textarea value={prompt} onChange={handlePromptChange} className='mb-2' placeholder="Describe your workout here." id='prompt' />
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={createAiWorkout}>Create<FontAwesomeIcon className='ml-1' icon={faWandMagicSparkles} /></AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </TabsContent>
                                                        </Tabs>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                                </div>
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
                                                <div 
                                                onTouchStart={handleTouchStart2}
                                                onTouchMove={handleTouchMove2}
                                                onTouchEnd={handleTouchEnd2}
                                                ref={touchAreaRef2}className='flex flex-col gap-2 pb-4 overflow-y-auto md:pr-2 scrollbar-custom' style={{ height: `calc(100vh - 235px)` }}>
                                                <Reorder.Group
                                                        axis="y"
                                                        onReorder={handleExerciseReorder}
                                                        values={clickedWorkoutExercises}
                                                        className="w-full"
                                                    >
                                                        {clickedWorkoutExercises && clickedWorkoutExercises.map((workout_exercise, index) => (
                                                            <ReorderExercise
                                                                isDragging={isDragging}
                                                                setIsDragging={setIsDragging}
                                                                onPointerDown={() => toggleWatchDrag(false)}
                                                                onPointerUp={() => toggleWatchDrag(true)}
                                                                onPointerCancel={() => toggleWatchDrag(true)}
                                                                index={index}
                                                                key={workout_exercise.id}
                                                                workout_exercise={workout_exercise}
                                                                deleteWorkoutExercise={deleteWorkoutExercise}
                                                                updateWorkout={updateWorkout}
                                                                handleEditSetsChange={handleEditSetsChange}
                                                                handleEditRepsChange={handleEditRepsChange}
                                                            />
                                                        ))}
                                                </Reorder.Group>
                                                    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                                                        <DrawerTrigger className='w-full flex items-center'>
                                                        <div className='py-4 px-4 text-lg text-primary font-semibold underline-offset-4 hover:underline'><FontAwesomeIcon className='mr-2' icon={faPlus}/>
                                                        Add Exercise</div>
                                                        </DrawerTrigger>
                                                        <DrawerContent className='h-5/6'>
                                                                <div className='flex flex-col'>
                                                                    <Card className='border-none m-0'>
                                                                        <CardHeader className='pt-4 pb-0 px-4 '>
                                                                            <CardTitle className='text-xl'>
                                                                                Add New Exercise
                                                                            </CardTitle>
                                                                        </CardHeader>
                                                                        <CardContent className='px-4 py-4 flex flex-col items-end'>
                                                                            <div className='flex items-center gap-1'>
                                                                                <Input placeholder="Add or Create Exercise" onChange={(event) => setNewExercise(event.target.value)} value={newExercise}/>
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
                                                                            <Button onClick={addNewExerciseToWorkout} className='text-lg w-full mt-4'>Add</Button>
                                                                        </CardContent>
                                                                    </Card>
                                                                    <Tabs  defaultValue='exerciseDatabase'>
                                                                        <div className='flex justify-center items-center w-full pb-2'>
                                                                        <TabsList className="mx-2 grid w-full grid-cols-2 gap-1 rounded-xs bg-muted">
                                                                            <TabsTrigger className='rounded-xs' value="exerciseDatabase">Exercise Database</TabsTrigger>
                                                                            <TabsTrigger className='rounded-xs' value="yourExercises">Your Exercises</TabsTrigger>
                                                                        </TabsList>
                                                                        </div>
                                                                        <Card className='border-none'>
                                                                        <div className="relative py-2 w-full flex justify-center items-center">
                                                                            <Search className="absolute left-4 top-5 h-4 w-4 text-muted-foreground" />
                                                                            <Input placeholder="Search" className="pl-8 w-full mx-2" onChange={handleSearchChange} />
                                                                        </div>
                                                                        <TabsContent className='m-0' value="exerciseDatabase">
                                                                            <ScrollArea className="h-96 w-full rounded-md border-none bg-background">
                                                                                <div className="p-4">
                                                                                {filteredExercises.map((exercise) => (
                                                                                    <div onClick={() => clickToAddExercise(exercise.name)} key={exercise.name}>
                                                                                        <div className="p-2 text-sm">{exercise.name}</div>
                                                                                        <Separator className="my-2" />
                                                                                    </div>
                                                                                ))}
                                                                                </div>
                                                                            </ScrollArea>
                                                                        </TabsContent>
                                                                        <TabsContent className='m-0' value="yourExercises">
                                                                            <ScrollArea className="h-96 w-full rounded-md border-none bg-background">
                                                                                    <div className="p-4">
                                                                                    {filteredUserExercises.map((userExercise) => (
                                                                                        <div onClick={() => clickToAddExercise(userExercise.name)} key={userExercise.name}>
                                                                                            <div className="p-2 text-sm">{userExercise.name}</div>
                                                                                            <Separator className="my-2" />
                                                                                        </div>
                                                                                    ))}
                                                                                    </div>
                                                                            </ScrollArea>
                                                                        </TabsContent>
                                                                        </Card>
                                                                    </Tabs>
                                                                </div>
                                                            <DrawerFooter>
                                                                
                                                            <DrawerClose asChild>
                                                                <Button className='text-lg' variant="secondary">Cancel</Button>
                                                            </DrawerClose>
                                                            </DrawerFooter>
                                                        </DrawerContent>
                                                    </Drawer>
                                                    </div>
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
                                <div className='w-full flex flex-col gap-2 mt-[35%] md:mt-[25%] items-center text-muted-foreground font-semibold text-xl'>
                                    <h1>Nothing to see here!</h1>
                                    <h1>{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h1>
                                    <div className='flex items-center gap-4 mt-4'>
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
                                        <p className='text-foreground text-sm'>or</p> 
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="secondary" className='text-foreground rounded-xs'>All Programs</Button>
                                            </SheetTrigger>
                                            <SheetContent className="md:w-[400px] w-[100%]">
                                                <SheetHeader className='text-left pl-4 flex flex-row justify-between items-center mt-4'>
                                                    <SheetTitle className='text-2xl' >All Programs</SheetTitle>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant='outline' className='flex items-center gap-1'><FontAwesomeIcon icon={faPlus} /><p className='mb-1'>New Program</p></Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                            <AlertDialogTitle>Create Program</AlertDialogTitle>
                                                            </AlertDialogHeader>
                                                            <Label htmlFor="programName">Name</Label><Input onChange={handleNameInputChange} value={programName} autoComplete="off" id="programName" />
                                                            <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <SheetClose asChild>
                                                                <AlertDialogAction onClick={createAndActivateProgram}>Create</AlertDialogAction>
                                                            </SheetClose>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>  
                                                </SheetHeader>
                                                <div className='flex flex-col gap-2 mt-2 overflow-y-auto max-h-[75vh] scrollbar-custom'>
                                                {userPrograms.map((program) => (
                                                <div
                                                    key={program.id}
                                                    className={`p-4 py-6 relative rounded border ${selectedProgram === program.id ? 'bg-secondary' : 'bg-background'}`}
                                                    onClick={() => handleProgramClick(program.id)}
                                                >
                                                    <h1>{program.name}</h1>
                                                    <div className='absolute bottom-6 right-2' onClick={(event) => event.stopPropagation()}>
                                                        <Popover>
                                                            <PopoverTrigger className='p-4'><FontAwesomeIcon size='lg' icon={faEllipsis} /></PopoverTrigger>
                                                            <PopoverContent className='w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md' >
                                                                <Button onClick={() => deleteProgram(program.id)} className='px-2 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>Delete Program</Button>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div> 
                                                </div>
                                                ))}
                                                </div>
                                                <SheetFooter className='mt-4'>
                                                <SheetClose asChild>
                                                    <Button type="submit" onClick={() => updateActiveProgram(selectedProgram)}>Set Active</Button>
                                                </SheetClose>
                                                </SheetFooter>
                                            </SheetContent>
                                        </Sheet>
                                    </div>
                                    <Separator />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><Button className='rounded-xs bg-foreground hover:bg-foreground text-background' ><FontAwesomeIcon icon={faWandMagicSparkles} /><p className='ml-1'>AI Program</p></Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Try Our AI Program Creator!</AlertDialogTitle>
                                            <AlertDialogDescription>You have {remainingAIPrograms} AI programs left this week.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <Label htmlFor="programName">Descripton</Label><Textarea value={programPrompt} onChange={handleProgramPromptChange} autoComplete="off" id="programName" />
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={createAiProgram}>Create</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )
                            }
                        </div>
                        {activeProgram && !loadingSessionDetails && (
                            <div className='flex relative justify-center items-center xl:mb-24'>
                                {sessionDetails && isActiveSession ? (
                                    <Button
                                        variant='secondary'
                                        size='lg'
                                        onClick={resumeSession}
                                        className='absolute bottom-4 right-2 self-center p-4 text-lg'>
                                        Resume Workout
                                    </Button>
                                ) : (
                                    <Button
                                        size='lg'
                                        onClick={startWorkoutSession}
                                        className='fixed bottom-28 right-8 lg:static self-center p-6 text-lg'>
                                        Start Session!
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className='hidden lg:flex h-full items-center justify-center basis-3/5'>
                        <Calendar
                        onDataReceive={handleDayData}
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        userWorkoutSessions={userWorkoutSessions}
                        className="h-[85%] w-full my-4"
                        />
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetContent>
                                {!displayCurrentWorkout && dayData && (typeof dayData === 'object' && Object.keys(dayData).length > 0) ? (
                                        renderWorkoutSessionDetails(dayData)
                                    ) : (
                                        <div className='h-full flex flex items-center justify-center gap-1'>
                                            <h1 className='font-semibold text-xl'>No data available for this day</h1>
                                            <FontAwesomeIcon size='xl' className='mt-1' icon={faFaceFrown} />
                                        </div>
                                    )}
                            </SheetContent>
                        </Sheet>
                    </div>
                    

                    
                    
                </div>
                )} 
            </Card>
        </div>
    )
}

export default Train