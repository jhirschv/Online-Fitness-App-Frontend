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
import { faEllipsis, faPlus, faChevronRight, faXmark, faTrashCan, faGripVertical, faWandMagicSparkles, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
import Confetti from 'react-confetti';
import { useMediaQuery } from '@mui/material';


  
  
const Train = ({celebrate, setCelebrate, programLoading, activeProgram, setActiveProgram, workouts, setWorkouts, sessionDetails, isActiveSession, fetchSessionDetails, loadingSessionDetails}) => {
    let { user } = useContext(AuthContext);
    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';
    const navigate = useNavigate();
    const { toast } = useToast()
    const isSmallScreen = useMediaQuery('(max-width: 767px)');

    useEffect(() => {
        if (celebrate) {
            toast({
                title: "Workout Completed!",
                description: "Your workout data has been logged successfully."
            });
            setCelebrate(false);  // Optionally reset the celebrate state in the App component
        }
      }, [celebrate, setCelebrate]);
    

    const [editWorkoutName, setEditWorkoutName] = useState("")
    const [editProgramName, setEditProgramName] = useState("")
    const [openProgramDrawer, setOpenProgramDrawer] = useState(false)
    const [openProgramPopover, setOpenProgramPopover] = useState(false)
    

    const updateWorkoutName = (workoutId) => {
        apiClient.patch(`/workouts/${workoutId}/`, { name: editWorkoutName })
        .then(response => {

            console.log(response.data)
            // Update the workout in the workouts state array
            const updatedWorkouts = workouts.map(workout => {
                if (workout.id === workoutId) {
                    // Assuming response.data is the updated workout object
                    return response.data;
                }
                return workout;
            });
            
            // Assuming setWorkouts is your state updater function
            setWorkouts(updatedWorkouts);
            setEditWorkoutName('') // Reset the input field for workout name
            setDrawerOpen(false) // Close the drawer UI element
        })
        .catch(error => {
            console.error("Failed to update workout:", error);
        });
    }

    const updateProgramName = () => {
        apiClient.patch(`/programs/${activeProgram.id}/`, { name: editProgramName })
        .then(response => {
            setActiveProgram(response.data)
            setEditProgramName('') // Reset the input field for workout name
            setOpenProgramDrawer(false)
            setOpenProgramPopover(false)
        })
        .catch(error => {
            console.error("Failed to update workout:", error);
        });
    }

    const [userWorkoutSessions, setUserWorkoutSessions] = useState([])

    useEffect(() => {
        apiClient.get('/user_workout_sessions/')
            .then(response => {
                setUserWorkoutSessions(response.data)
                })
            
            .catch(error => console.error('Error:', error));
        }, [user]);
    
    //ai workout
    const [prompt, setPrompt] = useState('');
    const [programPrompt, setProgramPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isWorkoutLoading, setIsWorkoutLoading] = useState(false);

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
        setIsWorkoutLoading(true)
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
        setIsWorkoutLoading(false); // Stop loading on completion
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

    const [dayData, setDayData] = useState({});
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

    const [newExercise, setNewExercise] = useState("")
    const [newExerciseSets, setNewExerciseSets] = useState()
    const [newExerciseReps, setNewExerciseReps] = useState()

    const filteredExercises = exercises.filter((exercise) => {
        return exercise.name.toLowerCase().includes(newExercise.toLowerCase());
    });

    // Filter user exercises based on search term
    const filteredUserExercises = userExercises.filter((userExercise) => {
        return userExercise.name.toLowerCase().includes(newExercise.toLowerCase());
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
            console.log(res.data)
        });
    }, [])

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
            setNewExercise("")
            setNewExerciseSets("")
            setNewExerciseReps("")
            closeDrawer();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    };
    
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

    function handleSelectedWorkout(data) {
        setSelectedWorkout(data)
        console.log(data)
    }

    const handleSheetOpenChange = (open) => {
        setIsSheetOpen(open);

        // If the Sheet is being closed (open is false), reset selectedWorkout
        if (!open) {
            setSelectedWorkout(null);
        }
    }

    const [sharedPrograms, setSharedPrograms] = useState([])

    useEffect(() => {
        const fetchParticipatingPrograms = async () => {
          try {
            const response = await apiClient.get('/participating/');
            setSharedPrograms(response.data);
            console.log(response.data)
          } catch (error) {
            console.log(error)
          }
        };
    
        fetchParticipatingPrograms();
      }, []);

      const handleRemoveClick = async (programId) => {
        try {
          const response = await apiClient.delete(`/remove_participant/${programId}/`);
          
          if (response.status === 200) {
            setSharedPrograms((prevPrograms) => prevPrograms.filter(program => program.id !== programId));
            toast({
                title: "Program Deleted.",
                description: "The program has been successfully deleted."
            });
            if(programId === activeProgram.id){
                setActiveProgram(null)}
                
          } else {
            toast({
                title: "Error deleting program",
                description: "The program could not be deleted. Please try again.",
                variant: "destructive"
            });
          }
        } catch (error) {
            toast({
                title: "Error deleting program",
                description: "The program could not be deleted. Please try again.",
                variant: "destructive"
            });
        }
      };

      const [drawerOpen, setDrawerOpen] = useState(false);
      const [activeWorkoutId, setActiveWorkoutId] = useState(null);
  
      const handleDrawerTriggerClick = (event, workoutId) => {
          event.stopPropagation(); // Prevent click from propagating to the parent div
          setActiveWorkoutId(workoutId);
          setDrawerOpen(true);
      };

    const { touchAreaRef, handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchScroll(() => isDragging);
    const { touchAreaRef: touchAreaRef2, handleTouchStart: handleTouchStart2, handleTouchMove: handleTouchMove2, handleTouchEnd: handleTouchEnd2 } = useTouchScroll(() => isDragging);


    const [uploading, setUploading] = useState({});
    const fileInputRefs = useRef({});

    const workoutDate = new Date(dayData.date);

        // Format the date
        const formattedDate = workoutDate.toLocaleDateString('en-US', {
            year: 'numeric', // "2024"
            month: 'long', // "March"
            day: 'numeric', // "8"
        });

      useEffect(() => {
        // Iterate over all keys in the uploading state to check the refs
        Object.keys(uploading).forEach(setId => {
            // Log the current state of the ref to ensure it's not null and is ready
            if (fileInputRefs.current[setId] && fileInputRefs.current[setId].current) {
                console.log(`Ref for set ID ${setId} is ready.`);
            } else {
                console.log(`Ref for set ID ${setId} is not ready or does not exist.`);
            }
        });
    }, [uploading]);

    function transformVideoURL(originalURL) {
        const backendBaseURL = 'http://127.0.0.1:8000'; // URL where Django serves media files
        
        // Check if the original URL is already a full URL or just a relative path
        if (originalURL.startsWith('http')) {
            return originalURL; // It's a full URL, no transformation needed
        } else {
            // It's a relative path, prepend the backend base URL
            const newURL = backendBaseURL + originalURL;
            return newURL;
        }
    }

    const handleDeleteVideo = async (setId) => {
        setUploading(prev => ({ ...prev, [setId]: true }));  // Optionally show loading state
    
        try {
            const response = await apiClient.delete(`/delete_video/${setId}/`);
            setUploading(prev => ({ ...prev, [setId]: false }));
    
            if (response.status === 204) {
                console.log("Delete successful");
                setDayData(currentDayData => {
                    return {
                        ...currentDayData,
                        exercise_logs: currentDayData.exercise_logs.map(log => ({
                            ...log,
                            sets: log.sets.map(set => {
                                if (set.id === setId) {
                                    return { ...set, video: null };  // Set video to null or appropriate value
                                }
                                return set;
                            })
                        }))
                    };
                });
            } else {
                console.error('Delete failed:', response.statusText);
            }
        } catch (error) {
            setUploading(prev => ({ ...prev, [setId]: false }));
            console.error('Error deleting video:', error);
        }
    };
    
    const handleFileSelectAndUpload = async (event, setId) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const videoElement = document.createElement('video');
        const fileURL = URL.createObjectURL(file);
        videoElement.src = fileURL;
    
        videoElement.onloadedmetadata = async () => {
            URL.revokeObjectURL(fileURL); // Clean up the object URL
    
            if (videoElement.duration > 60) {
                alert('Video length must be 1 minute or less.');
                return;
            }
    
            const formData = new FormData();
            formData.append('video', file);
            setUploading(prev => ({ ...prev, [setId]: true }));
    
            try {
                const response = await apiClient.patch(`/upload_video/${setId}/`, formData);
                setUploading(prev => ({ ...prev, [setId]: false }));
    
                if (response.status === 200) {
                    console.log('Video uploaded successfully');
    
                    // Update dayData with the new video URL in the specific set
                    setDayData(currentDayData => {
                        return {
                            ...currentDayData,
                            exercise_logs: currentDayData.exercise_logs.map(log => ({
                                ...log,
                                sets: log.sets.map(set => {
                                    if (set.id === setId) {
                                        return { ...set, video: response.data.video }; // Assuming 'videoURL' is the field name in the response
                                    }
                                    return set;
                                })
                            }))
                        };
                    });
    
                } else {
                    console.error('Upload failed:', response.data.message);
                }
            } catch (error) {
                setUploading(prev => ({ ...prev, [setId]: false }));
                if (error.response) {
                    console.error('Error uploading video:', error.response.data);
                } else {
                    console.error('Error uploading video:', error.message);
                }
            }
        };
    };

    const [urlInput, setUrlInput] = useState("")

    const handleUrl = (exerciseId) => {

        const extractVideoID = () => {
            const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\/\?]+)/;
            const matches = urlInput.match(regex);
            return matches ? matches[1] : null;
        };
    
        const videoID = extractVideoID(urlInput);
    
        if (videoID) {

        apiClient.patch(`/user_exercises/${exerciseId}/`, {video: videoID})
            .then(response => {
                const updatedVideo = response.data.video;
                setUserExercises(currentExercises => currentExercises.map(exercise => {
                    if (exercise.id === exerciseId) {
                        return { ...exercise, video: updatedVideo };
                    }
                    return exercise;
                }));
                setUrlInput("")
                console.log('Update successful');
            })
        .catch(error => console.log('Error', error))
    }
}

    const [isEditWorkoutDrawerOpen, setIsEditWorkoutDrawerOpen] = useState(false)

    
    return (
        <div className={`${backgroundColorClass} overflow-hidden w-full md:p-4 md:border md:rounded-lg`}>
            {isLoading && (
                <AlertDialog open={true}>
                    <AlertDialogContent>
                        <div className="flex flex-col justify-center items-center">
                            <ScaleLoader color="#2563eb" size={40} />
                            <h1 className='text-muted-foreground mt-2'>AI programs may take up to one minute to create</h1>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            {isWorkoutLoading && (
                <AlertDialog open={true}>
                    <AlertDialogContent>
                        <div className="flex flex-col justify-center items-center">
                            <ScaleLoader color="#2563eb" size={40} />
                            <h1 className='text-muted-foreground mt-2'>AI programs may take up to 30 seconds to create</h1>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            {programLoading && (
                <div className="absolute inset-0 flex flex-col justify-center items-center z-10 rounded-lg">
                    <ScaleLoader color="#2563eb" size={40} />
                </div>
            )}
            <Toaster />
            <Card className='relative border-0 md:border h-full w-full flex flex-col rounded-none md:rounded-lg'>
                {!programLoading ? (
                <div className='flex h-full w-full'>

                    <div className='flex flex-col h-full overflow-hidden w-full lg:basis-2/5 px-4  md:px-0 md:pl-6'>
                        <div className='h-full flex flex-col pt-4'>
                            {activeProgram ? (
                                <div className='flex flex-col h-full'>
                                    <Carousel watchDrag={watchDrag} onApiChange={setCarouselApi} className="flex flex-col w-full h-full">
                                        <div className='flex w-full'>
                                            <CarouselTabs />
                    
                                        {activeProgram && 
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button className='ml-auto' variant="outline">All Programs</Button>
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
                                                                <Label htmlFor="programName">Name</Label><Input maxLength={30} onChange={handleNameInputChange} value={programName} autoComplete="off" id="programName" />
                                                                <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <SheetClose asChild>
                                                                    <AlertDialogAction onClick={createAndActivateProgram}>Create</AlertDialogAction>
                                                                </SheetClose>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>  
                                                    </SheetHeader>
                                                    <Tabs defaultValue="Your Programs" className="w-full">
                                                        <TabsList className='rounded-xs'>
                                                            <TabsTrigger  className='rounded-xs' value="Your Programs">Your Programs</TabsTrigger>
                                                            <TabsTrigger  className='rounded-xs' value="Shared">Shared</TabsTrigger>
                                                        </TabsList>
                                                        <TabsContent value="Your Programs">
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
                                                        </TabsContent>
                                                        <TabsContent value="Shared">
                                                        <div className='flex flex-col gap-2 mt-2 overflow-y-auto max-h-[75vh] scrollbar-custom'>
                                                        {sharedPrograms.map((program) => (
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
                                                                        <Button onClick={() => handleRemoveClick(program.id)} className='px-2 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>Delete Program</Button>
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </div>
                                                            <div className='absolute bottom-1 right-3'>
                                                                <p className='text-sm text-muted-foreground'>{program.creator.username}</p>
                                                            </div>
                                                        </div>
                                                        ))}
                                                        </div>
                                                        </TabsContent>
                                                    </Tabs>
                                                    <SheetFooter className='mt-4'>
                                                    <SheetClose asChild>
                                                        <Button type="submit" onClick={() => updateActiveProgram(selectedProgram)}>Set Active</Button>
                                                    </SheetClose>
                                                    </SheetFooter>
                                                </SheetContent>
                                            </Sheet>}
                                    </div>
                                    
                                    <CarouselContent className='h-full'>
                                       
                                        <CarouselItem value='overview' className='h-full flex flex-col overflow-hidden'>
                                            <div className="pt-2 h-full">
                                            <Card className='border-none rounded-none h-full'>
                                            
                                                <CardContent className="p-0 h-full items-center flex flex-col gap-2">
                                                    <div className='w-full flex justify-between items-center'>
                                                        <h1 className='w-1/2 p-1 text-lg self-start font-semibold'>{activeProgram.name}</h1>
                                                        <p className='text-sm text-muted-foreground whitespace-nowrap'>{activeProgram?.workouts?.length ?? 0} workouts</p>
                                                            <Sheet>
                                                                <SheetTrigger>
                                                                <div className='flex flex-col items-center justify-center'>
                                                                    <FontAwesomeIcon icon={faArrowRightArrowLeft} className="rotate-90 text-primary" size='lg' />
                                                                </div>
                                                                </SheetTrigger>
                                                                <SheetContent className="md:w-[400px] w-[100%]">
                                                                    <SheetHeader>
                                                                    <SheetTitle className='text-2xl'>Reorder <FontAwesomeIcon icon={faArrowRightArrowLeft} className="rotate-90 text-primary" /></SheetTitle>
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
                                                                    </SheetHeader>
                                                                </SheetContent>
                                                            </Sheet>
                                                            {activeProgram &&
                                                            <Popover open={openProgramPopover} onOpenChange={setOpenProgramPopover}>
                                                                <PopoverTrigger><FontAwesomeIcon className='mr-2' size='lg' icon={faEllipsis} /></PopoverTrigger>
                                                                <PopoverContent className='flex flex-col w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md'>
                                                                    <Button onClick={turnOffProgram} className='rounded-b-none px-2 py-1.5 text-sm outline-none hover:bg-accent bg-popover text-secondary-foreground'>Turn off program</Button>
                                                                    <Separator />
                                                                    {isSmallScreen ? (
                                                                    <Drawer open={openProgramDrawer} onOpenChange={(isOpen) => {
                                                                            setOpenProgramDrawer(isOpen);
                                                                            if (!isOpen) {
                                                                                setEditProgramName('');
                                                                                setOpenProgramPopover(false); // Clear the workout name when the drawer is closed
                                                                            }
                                                                        }}>
                                                                            <DrawerTrigger asChild>
                                                                                <Button  className='rounded-t-none px-2 py-1.5 text-sm outline-none hover:bg-accent bg-popover text-secondary-foreground'>Edit Program Name</Button>
                                                                            </DrawerTrigger>
                                                                            <DrawerContent className='h-1/3'>
                                                                                <DrawerHeader className='relative'>
                                                                                    <DrawerTitle>Edit Program Name</DrawerTitle>
                                                                                </DrawerHeader>
                                                                                <div className='flex justify-center items-center'>
                                                                                    <Input maxLength={30} value={editProgramName} onChange={(event) => setEditProgramName(event.target.value)} placeholder='Edit Program Name' className='mx-4'/>
                                                                                </div>
                                                                                <DrawerFooter>
                                                                                    <Button onClick={updateProgramName}>Save Changes</Button>
                                                                                    <DrawerClose asChild>
                                                                                        <Button variant="secondary">Cancel</Button>
                                                                                    </DrawerClose>
                                                                                </DrawerFooter>
                                                                            </DrawerContent>
                                                                        </Drawer>) : (
                                                                        <AlertDialog open={openProgramDrawer} onOpenChange={(isOpen) => {
                                                                            setOpenProgramDrawer(isOpen);
                                                                            if (!isOpen) {
                                                                                setEditProgramName('');
                                                                                setOpenProgramPopover(false); // Clear the workout name when the drawer is closed
                                                                            }
                                                                        }}>
                                                                            <AlertDialogTrigger asChild>
                                                                                <Button  className='rounded-t-none px-2 py-1.5 text-sm outline-none hover:bg-accent bg-popover text-secondary-foreground'>Edit Program Name</Button>
                                                                            </AlertDialogTrigger>
                                                                            <AlertDialogContent>
                                                                                <AlertDialogHeader>
                                                                                    <AlertDialogTitle>Edit Program Name</AlertDialogTitle>
                                                                                </AlertDialogHeader>
                                                                                <div className='flex justify-center items-center'>
                                                                                    <Input maxLength={30} value={editProgramName} onChange={(event) => setEditProgramName(event.target.value)} placeholder='Edit Program Name'/>
                                                                                </div>
                                                                                <AlertDialogFooter>
                                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                    <Button onClick={updateProgramName}>Save Changes</Button>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                        )
                                                                    }
                                                                </PopoverContent>
                                                            </Popover>}
                                                    </div>
                                                    <div className='w-full flex flex-col gap-2 overflow-y-scroll scrollbar-custom' style={{ height: `calc(100vh - 150px)` }}>
                                                        {workouts && workouts.map((workout, index) => (
                                                            <div  key={workout.id} 
                                                            className="flex-shrink-0 w-full flex justify-between h-20 px-4 border rounded-xs relative" 
                                                            >
                                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${clickedWorkout && clickedWorkout.id === workout.id ? 'bg-primary' : 'bg-transparent'}`} style={{width: '5px'}}></div>
                                                                <div onClick={() => handleWorkoutClick(workout)} className='text-lg font-semibold py-2 break-word w-[98%]'>{index + 1}. {workout.name}</div>
                                                                <div>
                                                                    <FontAwesomeIcon className='absolute top-8 right-10' icon={faChevronRight} />
                                                                    <FontAwesomeIcon onClick={(event) => handleDrawerTriggerClick(event, workout.id)} className='absolute top-2 right-3' icon={faEllipsis} />
                                                                    {drawerOpen && activeWorkoutId === workout.id && (
                                                                    isSmallScreen ? (
                                                                        <Drawer open={drawerOpen} onOpenChange={(isOpen) => {
                                                                            setDrawerOpen(isOpen);
                                                                            if (!isOpen) {
                                                                                setEditWorkoutName(''); // Clear the workout name when the drawer is closed
                                                                            }
                                                                        }}>
                                                                            <DrawerContent className='h-1/3'>
                                                                                <DrawerHeader className='relative'>
                                                                                    <DrawerTitle>Edit Workout Name</DrawerTitle>
                                                                                    <FontAwesomeIcon className='absolute top-4 right-4' size='lg' onClick={(event) => {event.stopPropagation(); deleteWorkout(workout.id); }} icon={faTrashCan} />
                                                                                </DrawerHeader>
                                                                                <div className='flex justify-center items-center'>
                                                                                    <Input maxLength={30} value={editWorkoutName} onChange={(event) => setEditWorkoutName(event.target.value)} placeholder='Edit Workout Name' className='mx-4'/>
                                                                                </div>
                                                                                <DrawerFooter>
                                                                                    <Button onClick={() => updateWorkoutName(workout.id)}>Save Changes</Button>
                                                                                    <DrawerClose asChild>
                                                                                        <Button variant="secondary">Cancel</Button>
                                                                                    </DrawerClose>
                                                                                </DrawerFooter>
                                                                            </DrawerContent>
                                                                        </Drawer>) : (
                                                                        <AlertDialog open={drawerOpen} onOpenChange={(isOpen) => {
                                                                            setDrawerOpen(isOpen);
                                                                            if (!isOpen) {
                                                                                setEditWorkoutName(''); // Clear the workout name when the drawer is closed
                                                                            }
                                                                        }}>
                                                                            <AlertDialogTrigger asChild>
                                                                                <Button  className='rounded-t-none px-2 py-1.5 text-sm outline-none hover:bg-accent bg-popover text-secondary-foreground'>Edit Workout Name</Button>
                                                                            </AlertDialogTrigger>
                                                                            <AlertDialogContent>
                                                                                <AlertDialogHeader className='relative'>
                                                                                    <AlertDialogTitle>Edit Workout Name</AlertDialogTitle>
                                                                                    <FontAwesomeIcon className='absolute top-0 right-4' size='lg' onClick={(event) => {event.stopPropagation(); deleteWorkout(workout.id); }} icon={faTrashCan} />
                                                                                </AlertDialogHeader>
                                                                                <div className='flex justify-center items-center'>
                                                                                    <Input maxLength={30} value={editWorkoutName} onChange={(event) => setEditWorkoutName(event.target.value)} placeholder='Edit Workout Name'/>
                                                                                </div>
                                                                                <AlertDialogFooter>
                                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                    <Button onClick={() => updateWorkoutName(workout.id)}>Save Changes</Button>
                                                                                </AlertDialogFooter>
                                                                            </AlertDialogContent>
                                                                        </AlertDialog>
                                                                        )
                                                                    )}
                                                                    
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                <AlertDialog>
                                                    <AlertDialogTrigger className='w-full flex items-center' asChild>
                                                        <div className='w-full py-4 pb-6 px-2 text-lg text-primary font-semibold underline-offset-4 hover:underline text-x'><FontAwesomeIcon className='mr-2' icon={faPlus}/>Add Workout</div>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <Tabs defaultValue="create">
                                                        <TabsList>
                                                            <TabsTrigger value="create">Create Workout</TabsTrigger>
                                                            <TabsTrigger value="ai">AI Workout</TabsTrigger>
                                                        </TabsList>

                                                        <TabsContent value="create">
                                                            <Label htmlFor="programName">Name</Label><Input maxLength={30} className='mb-2' value={workoutName} onChange={handleWorkoutNameChange} autoComplete="off" id="workoutName" />
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
                                                            <Label htmlFor="prompt">Workout Description</Label><Textarea maxLength={500} value={prompt} onChange={handlePromptChange} className='mb-2' placeholder="Describe your workout here." id='prompt' />
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={createAiWorkout}>Create<FontAwesomeIcon className='ml-1' icon={faWandMagicSparkles} /></AlertDialogAction>
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
                                            <div className="h-full pt-2">
                                            <Card className='border-none rounded-none h-full'>
                                                <CardContent className="p-0 h-full justify-center flex flex-col gap-2">
                                                    <div className='flex justify-between items-center'>
                                                        <h1 className='p-1 font-semibold text-xl w-3/5'>{clickedWorkout && clickedWorkout.name}</h1>
                                                        <p className='text-sm text-muted-foreground'>{clickedWorkout && clickedWorkout.workout_exercises ? clickedWorkout.workout_exercises.length : 0} exercises</p>
                                                        <Sheet>
                                                                <SheetTrigger>
                                                                <div className='mr-4 flex flex-col items-center justify-center'>
                                                                    <FontAwesomeIcon icon={faArrowRightArrowLeft} className="rotate-90 text-primary" size='lg' />
                                                                </div>
                                                                </SheetTrigger>
                                                                <SheetContent className="md:w-[400px] w-[100%]">
                                                                    <SheetHeader>
                                                                    <SheetTitle className='text-2xl'>Reorder <FontAwesomeIcon icon={faArrowRightArrowLeft} className="rotate-90 text-primary" /></SheetTitle>
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
                                                                    </SheetHeader>
                                                                </SheetContent>
                                                            </Sheet>
                                                    </div>
                                                    <div className='w-full flex flex-col gap-2 overflow-y-scroll scrollbar-custom' style={{ height: `calc(100vh - 150px)` }}>
                                                            {clickedWorkoutExercises && clickedWorkoutExercises.map((workout_exercise, index) => (
                                                            <div key={workout_exercise.id} className='flex-shrink-0 py-6 pl-4 pr-10 w-full flex justify-between items-center border rounded-xs relative h-20 overflow-hidden'>
                                                                <div className='w-3/5 break-word font-semibold text-lg'>{index + 1}. {workout_exercise.exercise.name}</div>
                                                                    <div className='font-semibold text-lg'>{workout_exercise.sets} x {workout_exercise.reps}</div>
                                                                    {workout_exercise.exercise.video ? (
                                                                        <div className='h-14 w-14'>
                                                                            <AlertDialog>
                                                                                <AlertDialogTrigger>
                                                                                    <img
                                                                                        src={`https://img.youtube.com/vi/${workout_exercise.exercise.video}/maxresdefault.jpg`}
                                                                                        alt="Video Thumbnail"
                                                                                        className="object-cover rounded-full cursor-pointer w-14 h-14"
                                                                                    />
                                                                                </AlertDialogTrigger>
                                                                                <AlertDialogContent className='gap-0'>
                                                                                    <div className="aspect-w-16 aspect-h-9 w-full h-72">
                                                                                        <iframe
                                                                                            className="w-full h-full"
                                                                                            src={`https://www.youtube.com/embed/${workout_exercise.exercise.video}`}
                                                                                            title="YouTube video player"
                                                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                            allowFullScreen>
                                                                                        </iframe>
                                                                                    </div>
                                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                </AlertDialogContent>
                                                                                </AlertDialog>
                                                                            </div>
                                                                        ) : (
                                                                            <div className='h-12 w-12'></div>
                                                                        )
                                                                    }
                                                                    {isSmallScreen ? (
                                                                    <Drawer>
                                                                        <DrawerTrigger className='absolute top-1 right-3'><FontAwesomeIcon icon={faEllipsis} /></DrawerTrigger>
                                                                        <DrawerContent className='h-1/3'>
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
                                                                                    <Button onClick={() => updateWorkout()}>Save Changes</Button>
                                                                                </DrawerClose>
                                                                            </DrawerFooter>
                                                                        </DrawerContent>
                                                                    </Drawer>) : (
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger className='absolute top-1 right-3'><FontAwesomeIcon icon={faEllipsis} /></AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader className='relative'>
                                                                                <AlertDialogTitle>Edit Exercise</AlertDialogTitle>
                                                                            </AlertDialogHeader>
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
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                <AlertDialogAction asChild><Button onClick={() => updateWorkout()}>Save Changes</Button></AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                    )
                                                                }
                                                            </div>
                                                        ))}
                                                    </div>
                                                    {isSmallScreen ? (
                                                    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                                                            <DrawerTrigger className='w-full flex items-center'>
                                                            <div className='py-4 pb-6 px-2 text-lg text-primary font-semibold underline-offset-4 hover:underline'><FontAwesomeIcon className='mr-2' icon={faPlus}/>
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
                                                                            <CardContent className='px-4 py-4 flex flex-col'>
                                                                                <div className='flex items-center gap-1'>
                                                                                    <Input className='w-full' maxLength={25} placeholder="Add or Create Exercise" onChange={(event) => setNewExercise(event.target.value)} value={newExercise}/>
                                                                                    <Select value={newExerciseSets} onValueChange={(newValue) => setNewExerciseSets(newValue)}>
                                                                                        <SelectTrigger className="w-[80px] md:w-[80px] focus:ring-0 focus:ring-offset-0">
                                                                                            <SelectValue placeholder='sets' />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent 
                                                                                        ref={(ref) => {
                                                                                            if (!ref) return;
                                                                                            ref.ontouchstart = (e) => {
                                                                                                e.preventDefault();
                                                                                            };
                                                                                        }}>
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
                                                                                        <SelectContent
                                                                                        ref={(ref) => {
                                                                                            if (!ref) return;
                                                                                            ref.ontouchstart = (e) => {
                                                                                                e.preventDefault();
                                                                                            };
                                                                                        }}>
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
                                                                            {/* <div className="relative py-2 w-full flex justify-center items-center">
                                                                                <Search className="absolute left-4 top-5 h-4 w-4 text-muted-foreground" />
                                                                                <Input placeholder="Search" className="pl-8 w-full mx-2" onChange={handleSearchChange} />
                                                                            </div> */}
                                                                            <TabsContent className='m-0' value="exerciseDatabase">
                                                                                <ScrollArea className="h-96 w-full rounded-md border-none bg-background">
                                                                                    <div className="px-4 py-0">
                                                                                    {filteredExercises.map((exercise) => (
                                                                                        <div onClick={() => clickToAddExercise(exercise.name)} key={exercise.name}>
                                                                                            <div className='h-[68px] flex justify-between items-center pr-8'>
                                                                                                <div className="p-2 text-base font-semibold">{exercise.name}</div>
                                                                                                {exercise.video ? (
                                                                                                <div className='mt-[6px]'>
                                                                                                    <AlertDialog>
                                                                                                        <AlertDialogTrigger>
                                                                                                            <img
                                                                                                                src={`https://img.youtube.com/vi/${exercise.video}/maxresdefault.jpg`}
                                                                                                                alt="Video Thumbnail"
                                                                                                                className="object-cover rounded-full cursor-pointer w-14 h-14"
                                                                                                            />
                                                                                                        </AlertDialogTrigger>
                                                                                                        <AlertDialogContent className='gap-0'>
                                                                                                            <div className="aspect-w-16 aspect-h-9 w-full h-72">
                                                                                                                <iframe
                                                                                                                    className="w-full h-full"
                                                                                                                    src={`https://www.youtube.com/embed/${exercise.video}`}
                                                                                                                    title="YouTube video player"
                                                                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                                                    allowFullScreen>
                                                                                                                </iframe>
                                                                                                            </div>
                                                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                                        </AlertDialogContent>
                                                                                                        </AlertDialog>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <div className='h-12 w-12'></div>
                                                                                                )
                                                                                            }
                                                                                            </div>
                                                                                            <Separator />
                                                                                        </div>
                                                                                    ))}
                                                                                    </div>
                                                                                </ScrollArea>
                                                                            </TabsContent>
                                                                            <TabsContent className='m-0' value="yourExercises">
                                                                                <ScrollArea className="h-96 w-full rounded-md border-none bg-background">
                                                                                        <div className="px-4 py-0">
                                                                                        {filteredUserExercises.map((userExercise) => (
                                                                                            <div onClick={() => clickToAddExercise(userExercise.name)} key={userExercise.name}>
                                                                                                <div className='h-[68px] flex justify-between items-center pr-8 relative'>
                                                                                                    <div className="p-2 text-base font-semibold">{userExercise.name}</div>
                                                                                                    {userExercise.video ? (
                                                                                                    <div className='mt-[6px]'>
                                                                                                        <AlertDialog>
                                                                                                            <AlertDialogTrigger>
                                                                                                                <img
                                                                                                                    src={`https://img.youtube.com/vi/${userExercise.video}/maxresdefault.jpg`}
                                                                                                                    alt="Video Thumbnail"
                                                                                                                    className="object-cover rounded-full cursor-pointer w-14 h-14"
                                                                                                                />
                                                                                                            </AlertDialogTrigger>
                                                                                                            <AlertDialogContent className='gap-0'>
                                                                                                                <div className="aspect-w-16 aspect-h-9 w-full h-72">
                                                                                                                    <iframe
                                                                                                                        className="w-full h-full"
                                                                                                                        src={`https://www.youtube.com/embed/${userExercise.video}`}
                                                                                                                        title="YouTube video player"
                                                                                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                                                        allowFullScreen>
                                                                                                                    </iframe>
                                                                                                                </div>
                                                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                                            </AlertDialogContent>
                                                                                                            </AlertDialog>
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                        <div className='h-12 w-12'></div>
                                                                                                    )
                                                                                                }
                                                                                                <AlertDialog>
                                                                                                        <AlertDialogTrigger className='absolute top-1 right-1'>
                                                                                                            <FontAwesomeIcon icon={faEllipsis} />
                                                                                                        </AlertDialogTrigger>
                                                                                                        <AlertDialogContent>
                                                                                                            <div className='flex items-center'>
                                                                                                                <Label className='mr-2'>URL:</Label>
                                                                                                                <Input value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
                                                                                                                className='w-full focus:outline-none focus:ring-0 ' placeholder="Youtube URL"/>
                                                                                                            </div>
                                                                                                            <AlertDialogFooter>
                                                                                                                <AlertDialogCancel className='mt-0'>Cancel</AlertDialogCancel>
                                                                                                                <AlertDialogAction onClick={() => handleUrl(userExercise.id)}>Upload</AlertDialogAction>
                                                                                                            </AlertDialogFooter>
                                                                                                        </AlertDialogContent>
                                                                                                    </AlertDialog>
                                                                                                </div>
                                                                                                <Separator />
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
                                                        </Drawer>) : (
                                                        <AlertDialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                                                            <AlertDialogTrigger className='w-full flex items-center'>
                                                                <div className='py-4 pb-6 px-2 text-lg text-primary font-semibold underline-offset-4 hover:underline'><FontAwesomeIcon className='mr-2' icon={faPlus}/>
                                                                Add Exercise</div>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <div className='flex flex-col'>
                                                                        <Card className='border-none m-0'>
                                                                            <CardHeader className='pt-4 pb-0 px-0 '>
                                                                                <CardTitle className='text-xl'>
                                                                                    Add New Exercise
                                                                                </CardTitle>
                                                                            </CardHeader>
                                                                            <CardContent className='px-0 py-4 flex flex-col'>
                                                                                <div className='flex items-center gap-1'>
                                                                                    <Input className='w-full' maxLength={25} placeholder="Add or Create Exercise" onChange={(event) => setNewExercise(event.target.value)} value={newExercise}/>
                                                                                    <Select value={newExerciseSets} onValueChange={(newValue) => setNewExerciseSets(newValue)}>
                                                                                        <SelectTrigger className="w-[80px] md:w-[80px] focus:ring-0 focus:ring-offset-0">
                                                                                            <SelectValue placeholder='sets' />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent 
                                                                                        ref={(ref) => {
                                                                                            if (!ref) return;
                                                                                            ref.ontouchstart = (e) => {
                                                                                                e.preventDefault();
                                                                                            };
                                                                                        }}>
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
                                                                                        <SelectContent
                                                                                        ref={(ref) => {
                                                                                            if (!ref) return;
                                                                                            ref.ontouchstart = (e) => {
                                                                                                e.preventDefault();
                                                                                            };
                                                                                        }}>
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
                                                                            <TabsList className="grid w-full grid-cols-2 gap-1 rounded-xs bg-muted">
                                                                                <TabsTrigger className='rounded-xs' value="exerciseDatabase">Exercise Database</TabsTrigger>
                                                                                <TabsTrigger className='rounded-xs' value="yourExercises">Your Exercises</TabsTrigger>
                                                                            </TabsList>
                                                                            </div>
                                                                            <Card className='border-none'>
                                                                            {/* <div className="relative py-2 w-full flex justify-center items-center">
                                                                                <Search className="absolute left-4 top-5 h-4 w-4 text-muted-foreground" />
                                                                                <Input placeholder="Search" className="pl-8 w-full mx-2" onChange={handleSearchChange} />
                                                                            </div> */}
                                                                            <TabsContent className='m-0' value="exerciseDatabase">
                                                                                <ScrollArea className="h-96 w-full rounded-md border-none bg-background">
                                                                                    <div className="py-0">
                                                                                    {filteredExercises.map((exercise) => (
                                                                                        <div onClick={() => clickToAddExercise(exercise.name)} key={exercise.name}>
                                                                                            <div className='h-[68px] flex justify-between items-center pr-8'>
                                                                                                <div className="p-2 text-base font-semibold">{exercise.name}</div>
                                                                                                {exercise.video ? (
                                                                                                <div className='mt-[6px]'>
                                                                                                    <AlertDialog>
                                                                                                        <AlertDialogTrigger>
                                                                                                            <img
                                                                                                                src={`https://img.youtube.com/vi/${exercise.video}/maxresdefault.jpg`}
                                                                                                                alt="Video Thumbnail"
                                                                                                                className="object-cover rounded-full cursor-pointer w-14 h-14"
                                                                                                            />
                                                                                                        </AlertDialogTrigger>
                                                                                                        <AlertDialogContent className='gap-0'>
                                                                                                            <div className="aspect-w-16 aspect-h-9 w-full h-72">
                                                                                                                <iframe
                                                                                                                    className="w-full h-full"
                                                                                                                    src={`https://www.youtube.com/embed/${exercise.video}`}
                                                                                                                    title="YouTube video player"
                                                                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                                                    allowFullScreen>
                                                                                                                </iframe>
                                                                                                            </div>
                                                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                                        </AlertDialogContent>
                                                                                                        </AlertDialog>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <div className='h-12 w-12'></div>
                                                                                                )
                                                                                            }
                                                                                            </div>
                                                                                            <Separator />
                                                                                        </div>
                                                                                    ))}
                                                                                    </div>
                                                                                </ScrollArea>
                                                                            </TabsContent>
                                                                            <TabsContent className='m-0' value="yourExercises">
                                                                                <ScrollArea className="h-96 w-full rounded-md border-none bg-background">
                                                                                        <div className="px-4 py-0">
                                                                                        {filteredUserExercises.map((userExercise) => (
                                                                                            <div onClick={() => clickToAddExercise(userExercise.name)} key={userExercise.name}>
                                                                                                <div className='h-[68px] flex justify-between items-center pr-8 relative'>
                                                                                                    <div className="p-2 text-base font-semibold">{userExercise.name}</div>
                                                                                                    {userExercise.video ? (
                                                                                                    <div className='mt-[6px]'>
                                                                                                        <AlertDialog>
                                                                                                            <AlertDialogTrigger>
                                                                                                                <img
                                                                                                                    src={`https://img.youtube.com/vi/${userExercise.video}/maxresdefault.jpg`}
                                                                                                                    alt="Video Thumbnail"
                                                                                                                    className="object-cover rounded-full cursor-pointer w-14 h-14"
                                                                                                                />
                                                                                                            </AlertDialogTrigger>
                                                                                                            <AlertDialogContent className='gap-0'>
                                                                                                                <div className="aspect-w-16 aspect-h-9 w-full h-72">
                                                                                                                    <iframe
                                                                                                                        className="w-full h-full"
                                                                                                                        src={`https://www.youtube.com/embed/${userExercise.video}`}
                                                                                                                        title="YouTube video player"
                                                                                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                                                        allowFullScreen>
                                                                                                                    </iframe>
                                                                                                                </div>
                                                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                                            </AlertDialogContent>
                                                                                                            </AlertDialog>
                                                                                                        </div>
                                                                                                    ) : (
                                                                                                        <div className='h-12 w-12'></div>
                                                                                                    )
                                                                                                }
                                                                                                <AlertDialog>
                                                                                                        <AlertDialogTrigger className='absolute top-1 right-1'>
                                                                                                            <FontAwesomeIcon icon={faEllipsis} />
                                                                                                        </AlertDialogTrigger>
                                                                                                        <AlertDialogContent>
                                                                                                            <div className='flex items-center'>
                                                                                                                <Label className='mr-2'>URL:</Label>
                                                                                                                <Input value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
                                                                                                                className='w-full focus:outline-none focus:ring-0 ' placeholder="Youtube URL"/>
                                                                                                            </div>
                                                                                                            <AlertDialogFooter>
                                                                                                                <AlertDialogCancel className='mt-0'>Cancel</AlertDialogCancel>
                                                                                                                <AlertDialogAction onClick={() => handleUrl(userExercise.id)}>Upload</AlertDialogAction>
                                                                                                            </AlertDialogFooter>
                                                                                                        </AlertDialogContent>
                                                                                                    </AlertDialog>
                                                                                                </div>
                                                                                                <Separator />
                                                                                            </div>
                                                                                        ))}
                                                                                        </div>
                                                                                </ScrollArea>
                                                                            </TabsContent>
                                                                            </Card>
                                                                        </Tabs>
                                                                    </div>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                        )
                                                    }
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
                                                <Label htmlFor="programName">Name</Label><Input maxLength={30} onChange={handleNameInputChange} value={programName} autoComplete="off" id="programName" />
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
                                                            <Label htmlFor="programName">Name</Label><Input maxLength={30} onChange={handleNameInputChange} value={programName} autoComplete="off" id="programName" />
                                                            <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <SheetClose asChild>
                                                                <AlertDialogAction onClick={createAndActivateProgram}>Create</AlertDialogAction>
                                                            </SheetClose>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>  
                                                </SheetHeader>
                                                <Tabs defaultValue="Your Programs" className="w-full">
                                                    <TabsList className='rounded-xs'>
                                                        <TabsTrigger  className='rounded-xs' value="Your Programs">Your Programs</TabsTrigger>
                                                        <TabsTrigger  className='rounded-xs' value="Shared">Shared</TabsTrigger>
                                                    </TabsList>
                                                    <TabsContent value="Your Programs">
                                                    <div className='flex flex-col gap-2 mt-2 overflow-y-auto max-h-[75vh] scrollbar-custom'>
                                                    {userPrograms.map((program) => (
                                                    <div
                                                        key={program.id}
                                                        className={`p-4 py-6 relative rounded border ${selectedProgram === program.id ? 'bg-secondary' : 'bg-background'}`}
                                                        onClick={() => handleProgramClick(program.id)}
                                                    >
                                                        <h1 className='text-xl'>{program.name}</h1>
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
                                                    </TabsContent>
                                                    <TabsContent value="Shared">
                                                    <div className='flex flex-col gap-2 mt-2 overflow-y-auto max-h-[75vh] scrollbar-custom'>
                                                    {sharedPrograms.map((program) => (
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
                                                                    <Button onClick={() => handleRemoveClick(program.id)} className='px-2 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>Delete Program</Button>
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                        <div className='absolute bottom-1 right-3'>
                                                            <p className='text-sm text-muted-foreground'>{program.creator.username}</p>
                                                        </div>
                                                    </div>
                                                    ))}
                                                    </div>
                                                    </TabsContent>
                                                </Tabs>
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
                                            <Label htmlFor="programName">Descripton</Label><Textarea maxLength={500} value={programPrompt} onChange={handleProgramPromptChange} autoComplete="off" id="programName" />
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
                                        className='absolute bottom-4 right-4 self-center p-4 text-lg'>
                                        Resume Workout
                                    </Button>
                                ) : (
                                    <Button
                                        size='lg'
                                        onClick={startWorkoutSession}
                                        className='absolute bottom-4 right-2 self-center p-4 text-lg'>
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
                            <SheetContent className='p-4 pr-0'>
                            {dayData.workout ? 
                                <div className='h-full mt-8 overflow-y-scroll scrollbar-custom pt-4 pb-4'>
                                    <div className='flex items-center justify-between pr-2'>
                                        <h1 className='font-semibold text-lg'>{dayData.workout.name}</h1>
                                        <h1 className='font-semibold text-base'>{formattedDate}</h1>
                                    </div>
                                        <div className='pr-2'>
                                            {dayData.exercise_logs && dayData.exercise_logs.length > 0 ? (
                                                dayData.exercise_logs.map((exercise, index) => (
                                                    <div key={exercise.id} >
                                                        <Accordion  type="single" collapsible>
                                                            <AccordionItem value="item-1">
                                                                <AccordionTrigger className='py-4'>
                                                                    <div className="font-medium pl-0 flex gap-2">
                                                                        {index + 1}. {exercise.workout_exercise.exercise.name}
                                                                        <p className='text-sm text-muted-foreground'>{exercise.sets.length} sets</p>
                                                                    </div>
                                                                </AccordionTrigger>
                                                                <AccordionContent className='pb-0'>
                                                                {exercise.sets.map((set) => {
                                                                // Dynamically create a ref for each set if it doesn't already exist
                                                                if (!fileInputRefs.current[set.id]) {
                                                                    fileInputRefs.current[set.id] = React.createRef();
                                                                }

                                                                return (
                                                                    <div key={set.id} className='px-3'>
                                                                        <div className='p-4 h-20 w-full flex justify-between items-center'>
                                                                            <p className='w-1/12 font-medium text-base'>{set.set_number}.</p>
                                                                            <p className='w-1/4 font-medium text-base'>{set.reps} {set.reps === 1 ? "rep" : "reps"}</p>
                                                                            <p className='w-1/4 font-medium text-base'>{set.weight_used ? set.weight_used : 0} lbs</p>
                                                                            {set.video ? (
                                                                                <AlertDialog>
                                                                                    <AlertDialogTrigger as="div" className="cursor-pointer w-1/4">
                                                                                        <video
                                                                                            style={{
                                                                                                width: '56px',
                                                                                                height: '56px',
                                                                                                borderRadius: '25%',
                                                                                                objectFit: 'cover',
                                                                                                pointerEvents: 'none'
                                                                                            }}
                                                                                            src={transformVideoURL(set.video)}
                                                                                            loop
                                                                                            muted
                                                                                            playsInline
                                                                                            preload="metadata"
                                                                                            onError={(e) => console.error('Video trigger error:', e)}
                                                                                        >
                                                                                            <source src={transformVideoURL(set.video)} type="video/mp4" />
                                                                                            Your browser does not support the video tag.
                                                                                        </video>
                                                                                    </AlertDialogTrigger>
                                                                                    <AlertDialogContent>
                                                                                        <div className="aspect-w-16 aspect-h-9 w-full h-72 relative">
                                                                                            <video controls autoPlay className="w-full h-full" src={transformVideoURL(set.video)} onError={(e) => console.error('Video error:', e)}>
                                                                                                Your browser does not support the video tag.
                                                                                            </video>
                                                                                        </div>
                                                                                        <AlertDialogCancel as="button">Close</AlertDialogCancel>
                                                                                        <div className='absolute top-2 right-8' onClick={() => handleDeleteVideo(set.id)}>
                                                                                            <FontAwesomeIcon size='lg' icon={faTrashCan} />
                                                                                        </div>
                                                                                    </AlertDialogContent>
                                                                                </AlertDialog>
                                                                            ) : (
                                                                                <div className='w-1/4'>
                                                                                    <input
                                                                                        type="file"
                                                                                        style={{ display: 'none' }}
                                                                                        ref={fileInputRefs.current[set.id]}
                                                                                        onChange={(e) => handleFileSelectAndUpload(e, set.id)}
                                                                                        accept="video/*"
                                                                                    />
                                                                                    <Button
                                                                                        size='sm'
                                                                                        variant='outline'
                                                                                        className='ml-auto mr-2'
                                                                                        onClick={() => fileInputRefs.current[set.id].current.click()}
                                                                                        disabled={uploading[set.id]}
                                                                                    >
                                                                                        {uploading[set.id] ? 'Uploading...' : 'Add Video'}
                                                                                    </Button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <Separator />
                                                                    </div>
                                                                );
                                                            })}
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        </Accordion>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>
                                                    <div className="text-center pt-8 text-xl font-semibold" colSpan="100%">No exercises logged for this day.</div>
                                                </div>
                                            )}
                                        </div>
                                </div>
                            : <div className='h-full flex flex items-center justify-center gap-1'>
                                <h1 className='font-semibold text-xl'>No data available for this day</h1>
                                <FontAwesomeIcon size='xl' className='mt-1' icon={faFaceFrown} />
                              </div>
                                }
                            </SheetContent>
                        </Sheet>
                    </div>
                    

                    
                    
                </div>
                ) : (
                    <div>

                    </div>
                )} 
            </Card>
        </div>
    )
}

export default Train