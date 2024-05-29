import React, { useState, useEffect} from 'react';
import apiClient from '../../services/apiClient';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectGroup,
SelectLabel,
SelectValue,
} from "@/components/ui/select"
import { Separator } from '@/components/ui/separator';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
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
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselTabs
} from "@/components/ui/sessionCarousel"
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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTrashCan, faCircleCheck} from '@fortawesome/free-regular-svg-icons';
import { faAngleLeft, faEllipsis, faPhotoFilm, faPlus, faXmark} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/components/theme-provider';

import { Toaster } from "@/components/ui/toaster"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';
import { useMediaQuery } from '@mui/material';
  

const WorkoutSession = ({setCelebrate, fetchSessionDetails, sessionDetails, setSessionDetails}) => {
    const isSmallScreen = useMediaQuery('(max-width: 767px)');
    const { toast } = useToast()

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', // "2024"
        month: 'long', // "March"
        day: 'numeric', // "1"
      });
      

    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';
    const [selectedSets, setSelectedSets] = useState({});
    const [carouselApi, setCarouselApi] = useState(null);

    const selectSet = (exerciseId, setId) => {
        const selectedExerciseLog = sessionDetails.exercise_logs.find(log => log.id === exerciseId);
        const setSelected = selectedExerciseLog.sets.find(set => set.id === setId);
        setSelectedSets(prev => ({
            ...prev,
            [exerciseId]: setSelected
        }));
    };

    const preventInvalidInput = (e) => {
        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
            e.preventDefault();
        }
    };

    const handleRepsChange = (exerciseLogId, setId, newReps) => {
        // Validate the newReps value
        const repValue = newReps === '' ? null : parseInt(newReps, 10);
        if (repValue !== null && (isNaN(repValue) || repValue < 0 || repValue > 999)) {
            return; // Do not update if the value is not valid
        }
    
        const updatedSessionDetails = {
            ...sessionDetails,
            exercise_logs: sessionDetails.exercise_logs.map(log => {
                if (log.id === exerciseLogId) {
                    return {
                        ...log,
                        sets: log.sets.map(set => {
                            if (set.id === setId) {
                                return { ...set, reps: repValue };
                            }
                            return set;
                        })
                    };
                }
                return log;
            })
        };
        setSessionDetails(updatedSessionDetails);
    };
    
    const handleWeightChange = (exerciseLogId, setId, newWeight) => {
        // Validate the newWeight value
        const weightValue = newWeight === '' ? null : parseFloat(newWeight);
        if (weightValue !== null && (isNaN(weightValue) || weightValue < 0 || weightValue > 999)) {
            return; // Do not update if the value is not valid
        }
    
        const updatedSessionDetails = {
            ...sessionDetails,
            exercise_logs: sessionDetails.exercise_logs.map(log => {
                if (log.id === exerciseLogId) {
                    return {
                        ...log,
                        sets: log.sets.map(set => {
                            if (set.id === setId) {
                                return { ...set, weight_used: weightValue };
                            }
                            return set;
                        })
                    };
                }
                return log;
            })
        };
        setSessionDetails(updatedSessionDetails);
    };

    const findUpdatedSet = (setId) => {
        for (const exerciseLog of sessionDetails.exercise_logs) {
            for (const set of exerciseLog.sets) {
                if (set.id === setId) {
                    return set; // This set has the latest reps and weight_used values
                }
            }
        }
        return null; // In case the set isn't found
    };

    const navigate = useNavigate();

    function goBack() {
        navigate(-1);
    }

    const updateExerciseSet = (exerciseId) => {
        const selectedSet = selectedSets[exerciseId];
        if (!selectedSet) return;
    
        const updatedSet = findUpdatedSet(selectedSet.id);
        if (!updatedSet) {
            console.error('Set not found');
            return;
        }
    
        // Get the default reps from the exercise in case reps are null
        const defaultReps = sessionDetails.exercise_logs.find(log => log.id === exerciseId)?.workout_exercise.reps;
    
        const { id, weight_used } = updatedSet;
        const repsToUse = updatedSet.reps !== null ? updatedSet.reps : defaultReps;
    
        const payload = {
            reps: repsToUse,
            weight_used,
            is_logged: true
        };
    
        apiClient.patch(`/exercise_set_update/${id}/`, payload)
            .then(response => {
                fetchSessionDetails();
                console.log(response.data)
                const currentLog = sessionDetails.exercise_logs.find(log => log.id === exerciseId);
                const currentIndex = currentLog.sets.findIndex(set => set.id === id);
                const nextUnloggedSet = currentLog.sets.slice(currentIndex + 1).find(set => set.weight_used === null || set.weight_used === 0);
                const allSetsLogged = currentLog.sets.every(set => set.weight_used !== null && set.weight_used !== 0);
    
                if (allSetsLogged) {
                    const currentLogIndex = sessionDetails.exercise_logs.findIndex(log => log.id === exerciseId);
                    if (currentLogIndex !== -1 && currentLogIndex + 1 < sessionDetails.exercise_logs.length) {
                        carouselApi.scrollTo(currentLogIndex + 1);
                    }
                }
    
                setSelectedSets(prev => ({
                    ...prev,
                    [exerciseId]: nextUnloggedSet || currentLog.sets.find(set => set.weight_used === null || set.weight_used === 0) || null
                }));
    
                toast({
                    title: "Set Updated",
                    description: "The exercise set has been successfully logged."
                });
            })
            .catch(error => {
                console.error('Error updating exercise set:', error);
                toast({
                    title: "Set Update Failed",
                    description: "The exercise set has not been logged.",
                    variant: "destructive"
                });
            });
    }

    const initialSetupDoneRef = useRef(false);

    useEffect(() => {
        if (sessionDetails && sessionDetails.exercise_logs && !initialSetupDoneRef.current) {
            const initialSelectedSets = {};
            sessionDetails.exercise_logs.forEach(log => {
                const nonLoggedSet = log.sets.find(set => set.weight_used === null || set.weight_used === 0);
                if (nonLoggedSet) {
                    initialSelectedSets[log.id] = nonLoggedSet;
                } else {
                    initialSelectedSets[log.id] = log.sets[0]; // Assuming we select the first set if all are logged
                }
            });
            setSelectedSets(initialSelectedSets);
            initialSetupDoneRef.current = true; // Mark that initial setup has been done
        }
    }, [sessionDetails]);

    const hasScrolledRef = useRef(false);
    const [triggerScroll, setTriggerScroll] = useState(false);


    function determineTargetIndex(logs) {
        let lastLoggedIndex = -1;
        for (let i = 0; i < logs.length; i++) {
            const hasLoggedSet = logs[i].sets.some(set => set.weight_used !== null && set.weight_used !== 0);
            if (hasLoggedSet) {
                lastLoggedIndex = i;
            }
        }
        return lastLoggedIndex;
    }

    useEffect(() => {
        if (!carouselApi || !sessionDetails || hasScrolledRef.current) return; // Check if already scrolled
        
        // Logic to determine the slide index to navigate to
        const targetIndex = determineTargetIndex(sessionDetails.exercise_logs);
        if (targetIndex !== -1) {
            setTimeout(() => {
                carouselApi.scrollTo(targetIndex);
                hasScrolledRef.current = true; // Mark as scrolled
            }, 100); // Adjusted to 100ms as per your comment
        }
    }, [carouselApi, sessionDetails, triggerScroll]);

    const endSession = async () => {
        try {
            const response = await apiClient.post(`/end-session/${sessionDetails.id}/`);
            if (response.data.status === 'success') {
                console.log('Session ended successfully');
                fetchSessionDetails();
                setCelebrate(true);
                navigate('/');
                // Additional logic to handle UI updates or redirections
            } else {
                console.error('Failed to end session:', response.data.message);
            }
        } catch (error) {
            console.error('Error ending the session:', error.response.data);
        }
    };

    const [uploading, setUploading] = useState({});
    const fileInputRefs = useRef({});

    useEffect(() => {
        if (sessionDetails) {
          sessionDetails.exercise_logs.forEach(exercise => {
            exercise.sets.forEach(set => {
              if (!fileInputRefs.current[set.id]) {
                fileInputRefs.current[set.id] = React.createRef();
              }
            });
          });
        }
      }, [sessionDetails]);

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

    const handleFileSelectAndUpload = async (event, setId) => {
        const file = event.target.files[0];
        if (!file) return;
    
        // Create a video element to check the duration
        const videoElement = document.createElement('video');
        const fileURL = URL.createObjectURL(file);
        videoElement.src = fileURL;
    
        videoElement.onloadedmetadata = async () => {
            URL.revokeObjectURL(fileURL); // Clean up the object URL
    
            // Check the duration of the video
            if (videoElement.duration > 60) {
                alert('Video length must be 1 minute or less.');
                return;
            }
    
            const formData = new FormData();
            formData.append('video', file);
    
            // Set only the relevant setId to true
            setUploading(prev => ({ ...prev, [setId]: true }));
    
            try {
                const response = await apiClient.patch(`/upload_video/${setId}/`, formData);
    
                // Set only the relevant setId to false after response
                setUploading(prev => ({ ...prev, [setId]: false }));
    
                if (response.status === 200) {
                    console.log('Video uploaded successfully');
                    fetchSessionDetails();
                } else {
                    console.error('Upload failed:', response.data);
                }
            } catch (error) {
                setUploading(prev => ({ ...prev, [setId]: false }));
                if (error.response) {
                    console.error('Error uploading video:', error.response.data);
                } else {
                    console.error('Error uploading video:', error);
                }
            }
        };
    };

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
                console.log('Video deleted successfully');
                fetchSessionDetails();                // Optional: Update state or perform further actions after delete
            } else {
                console.error('Delete failed:', response.statusText);
            }
        } catch (error) {
            setUploading(prev => ({ ...prev, [setId]: false }));
            console.error('Error deleting video:', error);
        }
    };

    const [exerciseHistories, setExerciseHistories] = useState({}); // Stores history by exercise ID

    useEffect(()=>{
        console.log('Exercise Histories:', exerciseHistories);
    }, [exerciseHistories])

    const fetchExerciseHistory = async (exerciseId) => {
        try {
            const response = await apiClient.get(`/exercise-sets/history/${exerciseId}/`);
            if (response.status === 200) {
                setExerciseHistories(prev => ({ ...prev, [exerciseId]: response.data }));
            } else {
                console.error('Failed to fetch history:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching exercise set history:', error.response ? error.response.data : 'No response');
        }
    };

    const [originalNotes, setOriginalNotes] = useState({});
    const [currentNotes, setCurrentNotes] = useState({});
    const [editModes, setEditModes] = useState({});

    // Initialize original and current notes
    useEffect(() => {
        if (!sessionDetails || !sessionDetails.exercise_logs) {
            // Possibly set some default state or return to avoid proceeding
            console.log('Session details are not loaded yet.');
            return;
        }
    
        const initialNotes = {};
        sessionDetails.exercise_logs.forEach(exercise => {
            initialNotes[exercise.id] = exercise.note || '';
        });
        setOriginalNotes(initialNotes);
        setCurrentNotes(initialNotes);
        initializeEditModes(initialNotes);
    }, [sessionDetails]);

    const initializeEditModes = (notes) => {
        const editModes = {};
        Object.keys(notes).forEach(key => {
            editModes[key] = false;  // Start with all notes not in edit mode
        });
        setEditModes(editModes);
    };

    const handleNoteChange = (exerciseId, newNote) => {
        setCurrentNotes(prevNotes => ({
            ...prevNotes,
            [exerciseId]: newNote
        }));
    };

    const saveNote = async (exerciseLogId, note) => {
        try {
            const response = await apiClient.patch(`/exercise_log_update/${exerciseLogId}/`, {
                note: note
            });
            if (response.status === 200) {
                console.log('Note updated successfully');
                fetchSessionDetails()
                toast({
                    title: "Note saved",
                    description: "The exercise log has been successfully updated."
                });
                // Optionally, refresh data or handle UI response
            } else {
                console.error('Failed to update note:', response.data.message);
                toast({
                    title: "Note Update Failed",
                    description: "The note has not been logged.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error updating the note:', error.response ? error.response.data : error);
            toast({
                title: "Note Update Failed",
                description: "The note has not been logged.",
                variant: "destructive"
            });
            // Optionally, handle error in the UI
        }
    };

    const cancelEdit = (exerciseId) => {
        // Revert to original notes
        setCurrentNotes(prev => ({
            ...prev,
            [exerciseId]: originalNotes[exerciseId]
        }));
        // Explicitly set edit mode to false for this exercise
        setEditModes(prevModes => ({
            ...prevModes,
            [exerciseId]: false
        }));
    };

    const toggleEditMode = (exerciseId) => {
        setEditModes(prevModes => ({
            ...prevModes,
            [exerciseId]: !prevModes[exerciseId]
        }));
    };

    const handleAddExerciseSet = async (logId, reps) => {
        try {
            const response = await apiClient.post(`/exercise-logs/${logId}/exercise-sets/`);
            console.log('Exercise set created:', response.data);
            fetchSessionDetails();
            // Optionally update your state here to reflect the new exercise set
        } catch (error) {
            console.error('Error creating exercise set:', error);
            alert(error.response.data.error); 
        }
    };

    const handleDeleteLastSet = async (logId) => {
        try {
            const response = await apiClient.delete(`/exercise-logs/${logId}/delete-last-set/`);
            console.log(response.data);
            fetchSessionDetails();
            // Optionally update your state here to remove the deleted set from the UI
        } catch (error) {
            console.error('Error deleting last set:', error.response.data);
            toast({
                title: "Deletion Failed",
                description: "Cannot delete the set. The number of sets does not exceed the workout plan.",
                variant: "destructive"
            });
        }
    };


    const [newExercise, setNewExercise] = useState("")
    const [exercises, setExercises] = useState([]);
    const [userExercises, setUserExercises] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const closeDrawer = () => setIsDrawerOpen(false);

    const addNewExerciseLog = async () => {
        const payload = {
            workout_session: sessionDetails.id, // Assuming 'sessionDetails.id' holds a value like 269
            exercise_name: newExercise
        };
    
        try {
            const response = await apiClient.post('create-exercise-log/', payload);
            console.log('Successfully logged:', response.data);
            setNewExercise("")
            closeDrawer();
            await fetchSessionDetails();
            toast({
                title: "Exercise Added",
                description: "The exercise has been successfully added."
            });
            hasScrolledRef.current = false; // Reset the scroll flag here
            setTriggerScroll(prev => !prev);
        } catch (error) {
            console.error('Failed to log exercise:', error);
        }
    };

    useEffect(() => {
        apiClient.get('exercises/').then((res) => {
            setExercises(res.data)
        })
        apiClient.get('user_exercises/').then((res) => {
            setUserExercises(res.data);
        });
    }, [])

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

    const clickToAddExercise = (exerciseName) => {
        setNewExercise(exerciseName)
    }

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

    return (
        <div className={`w-full ${backgroundColorClass} lg:border lg:rounded-lg lg:p-4`}>
            <Toaster />
            <Card className='border-0 md:border h-full w-full rounded-none md:rounded-lg relative'>
                <FontAwesomeIcon className='absolute top-0 xl:top-4 left-4 z-20' onClick={goBack} size="lg" icon={faAngleLeft} />

                <div className='w-full h-full flex justify-center'>
                        {sessionDetails && 
                        <Carousel key={sessionDetails.exercise_logs.length} onApiChange={setCarouselApi} className="h-full flex flex-col w-full lg:mx-16 lg:mt-6 lg:max-w-md lg:max-w-2xl">
                            <CarouselContent className='min-w-full'>
                                {sessionDetails && sessionDetails.exercise_logs.map((exercise, index) => (
                                <CarouselItem className='w-full' key={exercise.id}   >
                                    <div>
                                    <Card className='h-full w-full border-none md:border' >
                                        <CardContent className="flex p-0 pt-4">
                                            <div className='flex flex-col w-full' style={{ height: `calc(100vh - 170px)` }}>
                                                <div className='flex items-center pb-4'>
                                                    <h1 className='pl-4 font-semibold text-xl'>{index + 1}. {exercise.workout_exercise.exercise.name}</h1>
                                                    <Sheet>
                                                        <SheetTrigger asChild>
                                                            <Button variant='outline' className='ml-2' onClick={() => fetchExerciseHistory(exercise.workout_exercise.exercise.id)}>History</Button>
                                                        </SheetTrigger>
                                                        <SheetContent className="md:w-[400px] w-[100%]">
                                                            <SheetHeader>
                                                            <SheetTitle className='flex justify-between mt-2'>
                                                                <p>{exercise.workout_exercise.exercise.name} History</p>
                                                                <p className='text-sm text-muted-foreground mr-4'>Most Recent</p>
                                                            </SheetTitle>
                                                            </SheetHeader>
                                                            <div className="overflow-y-scroll scrollbar-custom h-[95%] w-full w-full my-4">
                                                                {exerciseHistories[exercise.workout_exercise.exercise.id]
                                                                ?.slice()  // Creates a shallow copy of the array
                                                                .reverse()?.map(set => (
                                                                    <div className='p-4 h-20 flex items-center border-b' key={set.id}>
                                                                        <p className='font-semibold text-lg'>{set.reps} x {set.weight_used ? `${set.weight_used} lbs` : 'No weight logged'}</p>
                                                                        {set.video ? (
                                                                                <AlertDialog>
                                                                                    <AlertDialogTrigger as="div" className="cursor-pointer ml-auto">
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
                                                                                </AlertDialog>) : (
                                                                                    <div className='w-[56px]'></div>
                                                                                )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </SheetContent>
                                                        </Sheet>
                                                    {exercise.workout_exercise.exercise.video ? (
                                                                <div className='ml-auto mr-4 h-14 w-14'>
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger>
                                                                            <img
                                                                                src={`https://img.youtube.com/vi/${exercise.workout_exercise.exercise.video}/maxresdefault.jpg`}
                                                                                alt="Video Thumbnail"
                                                                                className="object-cover rounded-full cursor-pointer w-14 h-14"
                                                                            />
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent className='gap-0'>
                                                                            <div className="aspect-w-16 aspect-h-9 w-full h-72">
                                                                                <iframe
                                                                                    className="w-full h-full"
                                                                                    src={`https://www.youtube.com/embed/${exercise.workout_exercise.exercise.video}`}
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
                                                <div className='scrollbar-custom overflow-y-scroll md:pr-2 border-none' style={{ height: `calc(100vh - 205px)` }}>
                                                {exercise.sets.map((set) => (
                                                    <div key={set.id} onClick={() => selectSet(exercise.id, set.id)} className={`h-20 flex flex-col justify-between ${selectedSets[exercise.id]?.id === set.id ? "bg-muted" : "bg-background"}`}>
                                                        <Separator/>
                                                            <div className='ml-4 flex items-center'>
                                                                <p className='w-4'>{set.set_number}</p>
                                                                
                                                                <Input 
                                                                    type='number'
                                                                    inputMode='numeric'
                                                                    value={set.reps !== null ? set.reps : ''}
                                                                    onChange={(e) => handleRepsChange(exercise.id, set.id, e.target.value)} 
                                                                    onKeyDown={preventInvalidInput}
                                                                    placeholder={String(exercise.workout_exercise.reps)}
                                                                    id="reps"
                                                                    className="w-16 ml-1 mr-1 text-center font-semibold text-lg"
                                                                />
                                                                <Label htmlFor="reps" className='mr-2'>Reps</Label>

                                                                <Input id='weight' className='w-16 ml-1 mr-2 font-semibold text-lg'
                                                                inputMode='numeric'
                                                                type='number'
                                                                value={set.weight_used || ''} // Handle potential null or undefined values
                                                                onChange={(e) => handleWeightChange(exercise.id, set.id, e.target.value)}
                                                                onKeyDown={preventInvalidInput}></Input>
                                                                <p>lbs</p>
                                                                <FontAwesomeIcon className={`ml-2 md:ml-4 ${set.is_logged ? 'text-green-500' : 'text-muted-foreground'}`} size='xl' icon={faCircleCheck} />
                                                                {set.video ? (
                                                                <AlertDialog>
                                                                <AlertDialogTrigger as="div" className="cursor-pointer ml-auto mr-4">
                                                                    <video
                                                                        style={{
                                                                            width: '56px',  // equivalent to w-14 in TailwindCSS
                                                                            height: '56px', // equivalent to h-14 in TailwindCSS
                                                                            borderRadius: '25%', // makes the video rounded like rounded-full
                                                                            objectFit: 'cover', // covers the video area, similar to object-cover for images
                                                                            pointerEvents: 'none' // ensures video cannot be interacted with directly
                                                                        }}
                                                                        src={transformVideoURL(set.video)}
                                                                        loop
                                                                        muted
                                                                        playsInline
                                                                        preload="metadata"
                                                                        onError={(e) => {
                                                                            console.error('Video trigger error:', e);
                                                                        }}
                                                                    >
                                                                        <source src={transformVideoURL(set.video)} type="video/mp4" />
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent >
                                                                    <div className="aspect-w-16 aspect-h-9 w-full h-72 relative">
                                                                    <video controls autoPlay className="w-full h-full" src={transformVideoURL(set.video)}  onError={(e) => {
                                                                        console.error('Video error:', e);
                                                                        console.error('Error occurred with video source:', e.target.src);
                                                                    }}>
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
                                                                <>
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
                                                                </>
                                                            )}
                                                            </div>
                                                        <Separator/>
                                                    </div>  
                                                ))}
                                                <div className={`h-20 flex flex-col justify-between`}>
                                                        <Separator/>
                                                            <div className='ml-3 flex items-center'>
                                                                <FontAwesomeIcon onClick={() => handleAddExerciseSet(exercise.id, exercise.workout_exercise.reps)} size='lg' className='text-muted-foreground' icon={faPlus} />
                                                                <Input 
                                                                disabled
                                                                    placeholder={String(exercise.workout_exercise.reps)}
                                                                    id="reps"
                                                                    className="w-16 ml-2 mr-1 text-center font-semibold text-lg"
                                                                />
                                                                <Label htmlFor="reps" className='mr-2 text-muted-foreground'>Reps</Label>

                                                                <Input disabled id='weight' className='w-16 ml-1 mr-2 font-semibold text-lg'></Input>
                                                                <p className='text-muted-foreground'>lbs</p>
                                                                <AlertDialog>
                                                                <AlertDialogTrigger className='ml-auto mr-4' asChild>
                                                                    <Button variant='secondary' className='text-md'>Delete</Button>
                                                                    </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete your last set.
                                                                    </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDeleteLastSet(exercise.id)} className='bg-destructive text-destructive-foreground hover:bg-destructive/90'>Delete</AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        <Separator/>
                                                    </div>
                                                </div>
                                                
                                                
                                                <div className='flex gap-1 items-center pt-4 ml-4 mt-auto' > 
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant='outline' size='lg' className='px-4 mx-2'>
                                                                {currentNotes[exercise.id] ? <p>View Note</p> : <p>Add Note</p>}
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Note</AlertDialogTitle>
                                                            </AlertDialogHeader>
                                                            <Textarea 
                                                                maxLength={500}
                                                                className="resize-none h-28 text-md"
                                                                value={currentNotes[exercise.id] || ''}  // Use currentNotes here
                                                                onChange={(e) => handleNoteChange(exercise.id, e.target.value)}
                                                                disabled={!editModes[exercise.id]}
                                                            />
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel onClick={() => cancelEdit(exercise.id)}>Cancel</AlertDialogCancel>
                                                                {editModes[exercise.id] ? (
                                                                    <AlertDialogAction onClick={() => saveNote(exercise.id, currentNotes[exercise.id])}>
                                                                        Save Changes
                                                                    </AlertDialogAction>
                                                                ) : (
                                                                    <Button variant="outline" onClick={() => toggleEditMode(exercise.id)}>
                                                                        Edit
                                                                    </Button>
                                                                )}
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                    <Button onClick={() => updateExerciseSet(exercise.id)} size='lg'>Log Set</Button>
                                                </div>
                                                <CarouselTabs sessionDetails={sessionDetails} />
                                            </div>
                                            
                                            
                                        </CardContent>
                                    </Card>
                                    </div>
                                </CarouselItem>
                                ))}
                                <CarouselItem className='basis-full'>
                                    <div className="p-1 h-full">
                                        <Card className='h-full w-full border-none md:border flex flex-col justify-between'>
                                            <CardContent className="flex flex-col h-full items-center justify-center p-6 gap-4">
                                                    <h1 className='text-2xl font-semibold'>Workout Finished!</h1>
                                                    <Button size='lg' className='text-lg' onClick={endSession}>End Workout</Button>
                                                    <p className='text-sm text-muted-foreground'>or</p>
                                                    {isSmallScreen ? (
                                                    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                                                        <DrawerTrigger asChild>
                                                            <Button variant='secondary' size='lg' className='text-lg'>Add Exercise</Button>
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
                                                                            <div className='flex items-center gap-1 w-full'>
                                                                                <Input maxLength={25} placeholder="Add or Create Exercise" onChange={(event) => setNewExercise(event.target.value)} value={newExercise}/>
                                                                            </div>
                                                                            <Button className='text-lg w-full mt-4' onClick={addNewExerciseLog}>Add</Button>
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
                                                                            <Input value={searchTerm} placeholder="Search" className="pl-8 w-full mx-2" onChange={handleSearchChange} />
                                                                        </div>
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
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant='secondary' size='lg' className='text-lg'>Add Exercise</Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <div className='flex flex-col'>
                                                                        <Card className='border-none m-0'>
                                                                            <CardHeader className='pt-4 pb-0 px-0 '>
                                                                                <CardTitle className='text-xl'>
                                                                                    Add New Exercise
                                                                                </CardTitle>
                                                                            </CardHeader>
                                                                            <CardContent className='px-0 py-4 flex flex-col items-end'>
                                                                                <div className='flex items-center gap-1 w-full'>
                                                                                    <Input maxLength={25} placeholder="Add or Create Exercise" onChange={(event) => setNewExercise(event.target.value)} value={newExercise}/>
                                                                                </div>
                                                                                <Button className='text-lg w-full mt-4' onClick={addNewExerciseLog}>Add</Button>
                                                                            </CardContent>
                                                                        </Card>
                                                                        <Tabs  defaultValue='exerciseDatabase'>
                                                                            <div className='flex justify-center items-center w-full pb-2'>
                                                                            <TabsList className="mx-0 grid w-full grid-cols-2 gap-1 rounded-xs bg-muted">
                                                                                <TabsTrigger className='rounded-xs' value="exerciseDatabase">Exercise Database</TabsTrigger>
                                                                                <TabsTrigger className='rounded-xs' value="yourExercises">Your Exercises</TabsTrigger>
                                                                            </TabsList>
                                                                            </div>
                                                                            <Card className='border-none'>
                                                                            <div className="relative py-2 w-full flex justify-center items-center">
                                                                                <Search className="absolute left-3 top-5 h-4 w-4 text-muted-foreground" />
                                                                                <Input value={searchTerm} placeholder="Search" className="pl-8 w-full mx-0" onChange={handleSearchChange} />
                                                                            </div>
                                                                            <TabsContent className='m-0' value="exerciseDatabase">
                                                                                <ScrollArea className="h-96 w-full rounded-md border-none bg-background">
                                                                                <div className="px-0 py-0">
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
                                            <div className='w-full h-9'>
                                                <CarouselTabs sessionDetails={sessionDetails} />
                                            </div>
                                        </Card>
                                    </div>
                                    
                                </CarouselItem>
                            </CarouselContent>
                            <CarouselPrevious className='hidden md:flex'/>
                            <CarouselNext className='hidden md:flex'/>
                        </Carousel>} 
                    
                    <div className='hidden xl:block flex-1 h-full'>
                        <Card className='rounded-none h-full flex-2 p-6'>
                            <div className='flex items-center justify-between pr-2 mb-4'>
                                <h1 className='font-semibold text-lg'>{currentDate}: {sessionDetails && sessionDetails.workout.name}</h1>
                                <div className=''>
                                    <Popover>
                                        <PopoverTrigger><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                                        <PopoverContent>Place content for the popover here.</PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                            <div className='h-[67vh] overflow-y-scroll scrollbar-custom'>
                                <Table>
                                    <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px] pl-0">Exercise</TableHead>
                                        <TableHead>Sets x Reps</TableHead>
                                        <TableHead>Note</TableHead>
                                    </TableRow>
                                    </TableHeader>
                                    <TableBody >
                                        {sessionDetails && sessionDetails.workout.workout_exercises.map((exercise) => (
                                            <TableRow key={exercise.id}>
                                                <TableCell className="font-medium w-36 pl-0">{exercise.exercise.name}</TableCell>
                                                <TableCell>{`${exercise.sets} x ${exercise.reps}`}</TableCell>
                                                <TableCell>{exercise.note || ''}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>   
                    </div>

                </div>






            

                   {/*  <div className='flex relative items-center justify-center p-6'>
                        <FontAwesomeIcon className='absolute top-6 left-6' onClick={goBack} size="xl" icon={faAngleLeft} />
                        <h1 className='text-2xl font-semibold'>May 3, 2024: Lower Body 1</h1>
                    </div> */}
                    
                    





                        
            </Card>
        </div>
        
        
        
    )
}

export default WorkoutSession