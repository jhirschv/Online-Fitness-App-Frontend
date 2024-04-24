import React, { useState, useEffect} from 'react';
import apiClient from '../../services/apiClient';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTrashCan, faCircleCheck} from '@fortawesome/free-regular-svg-icons';
import { faAngleLeft, faEllipsis, faPhotoFilm} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '@/components/theme-provider';

import { Toaster } from "@/components/ui/toaster"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';
  

const WorkoutSession = ({fetchSessionDetails, sessionDetails, setSessionDetails}) => {

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

    const handleRepsChange = (exerciseLogId, setId, newReps) => {
        const updatedSessionDetails = {
            ...sessionDetails,
            exercise_logs: sessionDetails.exercise_logs.map(log => {
                if (log.id === exerciseLogId) {
                    return {
                        ...log,
                        sets: log.sets.map(set => {
                            if (set.id === setId) {
                                return { ...set, reps: newReps };
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
        const updatedSessionDetails = {
            ...sessionDetails,
            exercise_logs: sessionDetails.exercise_logs.map(log => {
                if (log.id === exerciseLogId) {
                    return {
                        ...log,
                        sets: log.sets.map(set => {
                            if (set.id === setId) {
                                return { ...set, weight_used: newWeight };
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

        const { id, reps, weight_used } = updatedSet;

        const payload = {
            reps,
            weight_used,
            is_logged: true  // Set this field to true when updating
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
                        carouselApi.scrollTo(currentLogIndex + 1); // Scroll to next log
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
                console.error('Error fetching workout session details:', error);
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
    }, [carouselApi, sessionDetails]);

    const endSession = async () => {
        try {
            const response = await apiClient.post(`/end-session/${sessionDetails.id}/`);
            if (response.data.status === 'success') {
                console.log('Session ended successfully');
                fetchSessionDetails();
                goBack();
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
    
        const formData = new FormData();
        formData.append('video', file);
    
        // Set only the relevant setId to true
        setUploading(prev => ({ ...prev, [setId]: true }));
        
        try {
            const response = await apiClient.patch(`/upload_video/${setId}/`, formData);
            
            // Set only the relevant setId to false after response
            setUploading(prev => ({ ...prev, [setId]: false }));
            
            if (response.data.status === 'success') {
                console.log('Video uploaded successfully');
                fetchSessionDetails();
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
                fetchSessionDetails();
                // Optional: Update state or perform further actions after delete
            } else {
                console.error('Delete failed:', response.statusText);
            }
        } catch (error) {
            setUploading(prev => ({ ...prev, [setId]: false }));
            console.error('Error deleting video:', error);
        }
    };

    return (
        <div className={`w-full ${backgroundColorClass} md:border md:rounded-lg md:p-4`}>
            <Toaster />
            <Card className='border-0 md:border h-full w-full rounded-none md:rounded-lg relative'>
                <FontAwesomeIcon className='hidden md:block absolute top-6 left-6' onClick={goBack} size="xl" icon={faAngleLeft} />

                <div className='w-full h-full flex justify-center items-center'>
                    
                        <Carousel onApiChange={setCarouselApi} className="w-full md:mx-16 md:mt-6 md:max-w-md md:max-w-3xl">
                            <CarouselContent className='w-100vw min-w-full'>
                                {sessionDetails && sessionDetails.exercise_logs.map((exercise, index) => (
                                <CarouselItem className='w-full' key={exercise.id}   >
                                    <div>
                                    <Card className='h-full w-full border-none md:border' >
                                        <CardContent className="flex p-3 md:p-6 ">
                                            <div className='flex flex-col w-full'>
                                                <div className='flex items-center pb-4'>
                                                    <h1 className='font-semibold text-xl'>{index + 1}. {exercise.workout_exercise.exercise.name}</h1>
                                                    <Sheet>
                                                        <SheetTrigger asChild>
                                                            <Button variant='outline' className='ml-2'>History</Button>
                                                        </SheetTrigger>
                                                        <SheetContent>
                                                            <SheetHeader>
                                                            <SheetTitle>Are you absolutely sure?</SheetTitle>
                                                            <SheetDescription>
                                                                This action cannot be undone. This will permanently delete your account
                                                                and remove your data from our servers.
                                                            </SheetDescription>
                                                            </SheetHeader>
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
                                                <Separator/>
                                                {exercise.sets.map((set) => (
                                                    <div key={set.id} onClick={() => selectSet(exercise.id, set.id)} className={`h-20 flex flex-col justify-between ${selectedSets[exercise.id]?.id === set.id ? "bg-muted" : "bg-background"}`}>
                                                        <Separator/>
                                                            <div className='ml-2 flex items-center'>
                                                                <p>{set.set_number}</p>
                                                                <Label htmlFor="reps" className='mr-2'>. Reps</Label>
                                                                <Input value={set.reps !== 0 ? set.reps : ''} onChange={(e) => handleRepsChange(exercise.id, set.id, e.target.value)} 
                                                                placeholder={String(exercise.workout_exercise.reps)} id='reps' className='w-12 mr-2 text-center font-semibold text-lg'></Input>

                                                                <Label htmlFor="weight" className='mr-2'>Weight</Label>
                                                                <Input id='weight' className='w-12 mr-1 font-semibold text-lg'
                                                                value={set.weight_used || ''} // Handle potential null or undefined values
                                                                onChange={(e) => handleWeightChange(exercise.id, set.id, e.target.value)}></Input>
                                                                <p>lbs</p>
                                                                <FontAwesomeIcon className={`ml-4 ${set.is_logged ? 'text-green-500' : 'text-muted-foreground'}`} size='xl' icon={faCircleCheck} />
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
                                                <Separator/>
                                                
                                                
                                                <div className='flex gap-1 items-center pt-4' > 
                                                    <Drawer>
                                                        <DrawerTrigger asChild><Button size='lg' variant='outline'><FontAwesomeIcon size='lg' icon={faClock} /></Button></DrawerTrigger>
                                                        <DrawerContent>
                                                            <div className="h-[300px] flex flex-col">
                                                            <DrawerFooter>
                                                            <DrawerClose className='mb-4 self-bottom'> 
                                                                <Button variant="outline">Cancel</Button>
                                                            </DrawerClose>
                                                            </DrawerFooter>
                                                            </div>
                                                        </DrawerContent>
                                                    </Drawer>
                                                    <Button variant='outline' size='lg' className=' px-4 mx-2'>Add Note</Button>
                                                    <Button onClick={() => updateExerciseSet(exercise.id)} size='lg'>Log Set</Button>
                                                </div>
                                            </div>
                                            
                                            
                                        </CardContent>
                                    </Card>
                                    </div>
                                </CarouselItem>
                                ))}
                                <CarouselItem className='basis-full h-full'>
                                    <div className="p-1">
                                        <Card className='h-[600px] w-full border-none md:border'>
                                            <CardContent className="flex flex-col h-full items-center justify-center p-6 gap-2">
                                                    <h1 className='text-xl font-semibold'>Workout Finished!</h1>
                                                    <Button onClick={endSession}>End Workout</Button>

                                            </CardContent>
                                        </Card>
                                    </div>
                                    
                                </CarouselItem>
                            </CarouselContent>
                            <CarouselTabs sessionDetails={sessionDetails} />
                            <CarouselPrevious className='hidden md:flex'/>
                            <CarouselNext className='hidden md:flex'/>
                        </Carousel>   
                    
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
                            <div>
                                <Table className='h-full'>
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