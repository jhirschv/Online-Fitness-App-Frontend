import React, { useState, useEffect } from 'react';
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
import { faClock} from '@fortawesome/free-regular-svg-icons';
import { faAngleLeft, faEllipsis} from '@fortawesome/free-solid-svg-icons';
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


        apiClient.patch(`/exercise_set_update/${id}/`, { reps, weight_used })
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
                                                    <Button variant='outline' className='ml-2'>History</Button>
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
                                                {exercise.sets.map((set) => (
                                                    <div key={set.id} onClick={() => selectSet(exercise.id, set.id)} className={`${selectedSets[exercise.id]?.id === set.id ? "bg-muted" : "bg-background"}`}>
                                                        <Separator/>
                                                            <div className='flex items-center m-2 py-2'>
                                                                <p>{set.set_number}</p>
                                                                <Label htmlFor="reps" className='mr-2'>. Reps</Label>
                                                                <Input type={"number"} value={set.reps !== 0 ? set.reps : ''} onChange={(e) => handleRepsChange(exercise.id, set.id, e.target.value)} 
                                                                placeholder={String(exercise.workout_exercise.reps)} id='reps' className='w-12 mr-2 text-center font-semibold text-lg'></Input>

                                                                <Label htmlFor="weight" className='mr-2'>Weight</Label>
                                                                <Input type={"number"} id='weight' className='w-12 mr-1 font-semibold text-lg'
                                                                value={set.weight_used || ''} // Handle potential null or undefined values
                                                                onChange={(e) => handleWeightChange(exercise.id, set.id, e.target.value)}></Input>
                                                                <p>lbs</p>
                                                                <Button variant='outline' className='ml-auto'>Add Video</Button>
                                                            </div>
                                                        <Separator/>
                                                    </div>  
                                                ))}
                                                
                                                
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