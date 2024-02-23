import React from 'react'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCirclePlus, faPlus, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import { faShareFromSquare } from '@fortawesome/free-regular-svg-icons';
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const ProgramOverview = () => {
    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    const { programId } = useParams();
    const [program, setProgram] = useState(null);
    const [phase, setPhase] = useState(null)
    const [defaultTabValue, setDefaultTabValue] = useState('');

    useEffect(() => {
        if (phase && phase.workouts && phase.workouts.length > 0) {
          setDefaultTabValue(phase.workouts[0].name);
        } else {
          setDefaultTabValue(''); // Reset or set to a default/fallback value if no workouts
        }
      }, [phase])

    const [phaseName, setPhaseName] = useState('')
    const [weeks, setWeeks] = useState('')

    const handlePhaseNameChange = (event) => {
        setPhaseName(event.target.value);
      };
    const handleWeekChange = (value) => {
    setWeeks(value);

    };
    function createPhase() {
    const phaseData = {
        program: programId,
        name: phaseName,
        weeks: weeks 
    };

    apiClient.post('/phases/', phaseData) 
    .then(response => {
        const updatedProgram = { ...program };

        if (!updatedProgram.phases) {
            updatedProgram.phases = [];
        }
        updatedProgram.phases.push(response.data);

        setProgram(updatedProgram);
        setPhaseName("")
        setWeeks("")
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
    }
    
    function deletePhase(phaseId) {
    apiClient.delete(`/phases/${phaseId}/`) // Use the DELETE method to request program deletion
    .then(() => {
        setProgram(currentProgram => ({
        ...currentProgram,
        phases: currentProgram.phases.filter(phase => phase.id !== phaseId)
        }));
    })
    .catch(error => {
        console.error('Error deleting the phase:', error);
    });
    }

    useEffect(() => {
    apiClient.get(`/user_programs/${programId}/`)
        .then(response => {
            setProgram(response.data)
            if (response.data.phases && response.data.phases.length > 0) {
                // Set the phase state to the first item in the phases array
                setPhase(response.data.phases[0]);
            }
            })
        
        .catch(error => console.error('Error:', error));
    }, [programId]);

    const navigate = useNavigate();

    const editWorkout = (programId) => {
        navigate(`/create/`); // Navigate to program details page
    };



    return (
    <div className={`w-full ${backgroundColorClass} border rounded-lg p-4`}>
        <Card className='h-full w-full flex flex-col'>
            <div className='p-6 flex justify-between items-center'>
                <div className='flex'>
                    <h1 className='text-2xl font-semibold'>16 Week Strength Program</h1>
                    <Badge variant='secondary' className='ml-4 text-xs'>Active</Badge>
                </div>
                <Button variant='outline'><FontAwesomeIcon className='mr-1' icon={faPlus} />Add Phase</Button>
            </div>
            <div className='flex flex-col'>
                <div className='flex w-full px-6 h-20'>
                {program && program.phases && program.phases.map((block, phaseIndex) => (
                <div key={block.id} onClick={() => setPhase(block)} className={`flex flex-col justify-center items-center flex-1 border ${theme === 'light' && block.id === (phase?.id) ? 'text-background' : 'text-foreground'} ${block.id === (phase?.id) ? 'bg-primary' : 'bg-background'} ${phase?.id !== block.id && 'hover:bg-primary-darker'} transition duration-300 ease-in-out`}><p className='text-xl font-semibold'>{block.name}</p><p className='text-sm'>{block.weeks} Weeks</p></div>
            ))}
                </div>
                
            </div>
            <div className='w-full h-full px-6 pt-4'>
                {phase? (
                    <Card className='px-2 h-[97%]'>
                        <div className='flex justify-between items-center'>
                            <h1 className='p-4 text-xl font-semibold'>{phase.name}</h1>
                            <Button variant='outline'>
                                <FontAwesomeIcon className='mr-1' icon={faPlus} /> Add Workout
                            </Button>
                        </div>
                        {phase && phase.workouts && phase.workouts.length > 0 ? (
                            <Tabs key={defaultTabValue} defaultValue={defaultTabValue} className="w-full rounded-sm">
                                <div className='flex items-center'>
                                <TabsList className={`grid w-full ${phase && phase.workouts ? `grid-cols-${phase.workouts.length > 12 ? 12 : phase.workouts.length}` : 'grid-cols-1'}`}>
                                    
                                    {phase && phase.workouts && phase.workouts.map((workout, index)=> (
                                        
                                        <TabsTrigger key={workout.id} value={workout.name}>{workout.name}</TabsTrigger>
                                    ))}
                                </TabsList>
                                </div>
                            {phase && phase.workouts && phase.workouts.map((workout, index) => (
                                <TabsContent key={workout.id} value={workout.name}>
                                    <Card className='border-none h-80'>
                                        <CardContent className="space-y-2">
                                            <Table className='h-full'>
                                                <TableHeader>
                                                <TableRow className='relative'>
                                                    <TableHead className="w-1/3">Exercise</TableHead>
                                                    <TableHead className='w-1/3'>Sets x Reps</TableHead>
                                                    <TableHead className="w-1/3">Note</TableHead>
                                                    <TableHead onClick={editWorkout} className='absolute right-0 pb-0.5 flex items-center'><p className='mr-2'>Edit Workout</p><FontAwesomeIcon size="lg" icon={faPenToSquare} /></TableHead>
                                                </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                {workout.workout_exercises && workout.workout_exercises.length > 0 ? (
                                                    workout.workout_exercises.map((lift) => (
                                                        <TableRow key={lift.id}>
                                                            <TableCell className="w-1/3 font-medium">{lift.exercise.name}</TableCell>
                                                            <TableCell >{lift.sets} x {lift.reps}</TableCell>
                                                            <TableCell>{lift.note}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan="3" className="hover:bg-background text-center text-2xl font-semibold text-muted-foreground pt-20">No Exercises Added</TableCell>
                                                    </TableRow>
                                                )}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            ))}
                            </Tabs>
                             ) : (
                                <div className='flex justify-center items-center h-80 mt-[33px]'><h1 className='text-2xl font-semibold text-muted-foreground'>No Workouts Added</h1></div>
                              )
                            }
                    </Card>
                ) : (
                    <Card className='flex justify-center items-center px-2 h-[97%]'>
                        <h1 className='text-2xl font-semibold text-muted-foreground'>No Phases Added</h1>
                    </Card>
                )}
                
            
            </div>
            
        </Card>
    </div>
  )
}

export default ProgramOverview













{/* <div className='grid grid-cols-2 gap-4 px-4'>
                <div className='flex my-4 flex-col w-full h-96 flex-grow border rounded-lg'>
                <h1 className='pt-4 pb-1 text-2xl font-semibold text-center'>Phase Details</h1>
                <h1 className='text-lg font-semibold text-center text-muted-foreground'>Accumulation</h1>
                <Table className='h-full'>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Day</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Edit</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody onClick={handleProgramClick}>
                        <TableRow>
                            <TableCell className="font-medium">1</TableCell>
                            <TableCell>Upper Body 1</TableCell>
                            <TableCell className="text-right"><FontAwesomeIcon icon={faPenToSquare} /></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">2</TableCell>
                            <TableCell>Lower Body 2</TableCell>
                            <TableCell className="text-right"><FontAwesomeIcon icon={faPenToSquare} /></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">3</TableCell>
                            <TableCell>Upper Body 2</TableCell>
                            <TableCell className="text-right"><FontAwesomeIcon icon={faPenToSquare} /></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">4</TableCell>
                            <TableCell>Lower Body 2</TableCell>
                            <TableCell className="text-right"><FontAwesomeIcon icon={faPenToSquare} /></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </div>
                <div className='flex my-4 flex-col w-full h-96 flex-grow border rounded-lg'>
                <h1 className='pt-4 pb-1 text-2xl font-semibold text-center'>Workout Details</h1>
                <h1 className='text-lg font-semibold text-center text-muted-foreground'>Lower Body 1</h1>
                <Table className='h-full'>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Exercise</TableHead>
                        <TableHead>Sets x Reps</TableHead>
                        <TableHead>Note</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody onClick={handleProgramClick}>
                        <TableRow>
                            <TableCell className="font-medium w-36">Back Squat</TableCell>
                            <TableCell>5 x 5</TableCell>
                            <TableCell>Build up to a heavy top set</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium w-48">Romanian Deadlift</TableCell>
                            <TableCell>5 x 5</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium w-36">Split Squat</TableCell>
                            <TableCell>3 x 8</TableCell>
                            <TableCell>Focus on Form</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium w-36">Calf Raise</TableCell>
                            <TableCell>3 x 8</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </div>
            </div> */}