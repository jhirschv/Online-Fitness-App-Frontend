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
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

const Train = () => {
    const { theme } = useTheme();
    const navigate = useNavigate();

    function startTrainingSession() {
        navigate('/workoutSession')
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
                setActiveProgram(response.data);
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

    const [activeProgram, setActiveProgram] = useState(null)
    const [selectedProgram, setSelectedProgram] = useState(null)
    const handleProgramClick = (programId) => {
        setSelectedProgram(programId)
        console.log(selectedProgram);
      };
    const [userPrograms, setUserPrograms] = useState([])
    const [currentWorkout, setCurrentWorkout] = useState(null);
    


    useEffect(() => {
        apiClient.get('/get_active_program/') // Make sure the endpoint matches your Django URL configuration
        .then(response => {
            setActiveProgram(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    useEffect(() => {
        apiClient.get('/current_workout/') // Make sure the endpoint matches your Django URL configuration
        .then(response => {
            setCurrentWorkout(response.data)
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
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


    const [date, setDate] = React.useState(new Date())
    // Determine the background color class based on the theme
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    return (
        <div className={`${backgroundColorClass} w-full p-4 border rounded-lg`}>
            <Card className='h-full w-full flex flex-col'>
                <div className='flex h-full'>

                    <div className='flex flex-col h-full justify-between basis-2/5 pl-6'>
                        <div className='flex flex-col pr-2 py-6'>
                            <div className='flex mb-4'>
                                {activeProgram? <h1 className='mr-2 text-2xl font-semibold'>{activeProgram.name}</h1> : <h1 className='mr-2 text-2xl font-semibold'>No Active Program</h1>}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline">Change Program</Button>
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
                                </Sheet>
                            </div>
                            
                            
                            <div className='flex items-center justify-between pr-2'>
                                {currentWorkout?
                                <h1 className='font-semibold text-lg'>Lower Body 1</h1>
                                :<h1>No Current Workout</h1>
                                }
                                <div>
                                    <Popover>
                                        <PopoverTrigger><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                                        <PopoverContent>Place content for the popover here.</PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        
                            <Table className='h-full'>
                                <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px] pl-0">Exercise</TableHead>
                                    <TableHead>Sets x Reps</TableHead>
                                    <TableHead>Note</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody >
                                {currentWorkout && currentWorkout.workout_exercises.map((exercise) => (
                                    <TableRow key={exercise.id}>
                                        <TableCell className="font-medium w-36 pl-0">{exercise.exercise.name}</TableCell>
                                        <TableCell>{`${exercise.sets} x ${exercise.reps}`}</TableCell>
                                        <TableCell>{exercise.note || ''}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </div>
                        
                        <div className='mb-6'>
                            <Button onClick={startTrainingSession} className='self-center w-1/2 p-6 text-lg'>Start Training!</Button>
                            <Button variant='outline' className='mx-2 self-center w-1/3 mb-4 p-6 text-lg'>Skip Workout</Button>
                        </div>
                        
                    </div>

                    <div className='flex h-full items-center justify-center basis-3/5'>
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="h-[90%] m-4"
                        />
                    </div>
                    

                    
                    
                </div>
            </Card>
        </div>
    )
}

export default Train