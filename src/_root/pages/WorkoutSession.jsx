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
  

const WorkoutSession = () => {

    const { toast } = useToast()

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', // "2024"
        month: 'long', // "March"
        day: 'numeric', // "1"
      });


    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    const { sessionId } = useParams();
    const [sessionDetails, setSessionDetails] = useState(null);
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

    
 
    useEffect(() => {
        // Fetch the workout session details by sessionId
        apiClient.get(`/workoutSession/${sessionId}/`)
            .then(response => {
                setSessionDetails(response.data);
                const initialSelectedSets = {};
                response.data.exercise_logs.forEach(log => {
                    const nonLoggedSet = log.sets.find(set => set.weight_used === null || set.weight_used === 0);
                    if (nonLoggedSet) {
                        initialSelectedSets[log.id] = nonLoggedSet;
                    } else {
                        initialSelectedSets[log.id] = log.sets[0]; // Assuming we select the first set if all are logged
                    }
                });
                setSelectedSets(initialSelectedSets);
            })
            .catch(error => {
                console.error('Error fetching workout session details:', error);
            });
    }, [sessionId]);

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
        console.log('carouselApi updated', carouselApi);
        console.log('sessionDetails updated', sessionDetails);
        if (!carouselApi || !sessionDetails) return; // Ensure API and data are loaded
    
        // Logic to determine the slide index to navigate to
        const targetIndex = determineTargetIndex(sessionDetails.exercise_logs);
        if (targetIndex !== -1) {
            setTimeout(() => {
                carouselApi.scrollTo(targetIndex);
            }, 20); // Introduce a 100ms delay
        }
    }, [carouselApi, sessionDetails]); // Depend on carouselApi and session details

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
                                    <div >
                                    <Card className='h-full w-full border-none md:border' >
                                        <CardContent className="flex p-6 ">
                                            <div className='flex flex-col w-full'>
                                                <div className='flex items-center pb-4'>
                                                    <h1 className='font-semibold text-xl'>{index + 1}. {exercise.workout_exercise.exercise.name}</h1>
                                                    <Button variant='outline' className='ml-2'>History</Button>
                                                </div>
                                                {exercise.sets.map((set) => (
                                                    <div key={set.id} onClick={() => selectSet(exercise.id, set.id)} className={`${selectedSets[exercise.id]?.id === set.id ? "bg-muted" : "bg-background"}`}>
                                                        <Separator/>
                                                            <div className='flex items-center m-2 py-2'>
                                                                <p>{set.set_number}</p>
                                                                <Label htmlFor="reps" className='mr-2'>. Reps</Label>
                                                                <Input value={set.reps !== 0 ? set.reps : ''} onChange={(e) => handleRepsChange(exercise.id, set.id, e.target.value)} 
                                                                placeholder={String(exercise.workout_exercise.reps)} id='reps' className='w-12 mr-2 text-center'></Input>

                                                                <Label htmlFor="weight" className='mr-2'>Weight</Label>
                                                                <Input id='weight' className='w-12 mr-1'
                                                                value={set.weight_used || ''} // Handle potential null or undefined values
                                                                onChange={(e) => handleWeightChange(exercise.id, set.id, e.target.value)}></Input>
                                                                <p>lbs</p>

                                                                <Button variant='outline' className='hidden md:block mx-2'>Add Note</Button>
                                                                <Button variant='outline' className='hidden md:block'>Add Video</Button>
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
                                                    <Button onClick={goBack}>End Workout</Button>

                                            </CardContent>
                                        </Card>
                                    </div>
                                    
                                </CarouselItem>
                            </CarouselContent>
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