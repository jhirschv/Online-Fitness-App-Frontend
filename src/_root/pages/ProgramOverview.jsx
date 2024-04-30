import React from 'react'
import apiClient from '../../services/apiClient';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    } from "@/components/ui/select"
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faEye, faEllipsis, faCirclePlus, faPlus, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
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
          setDefaultTabValue(phase.workouts[0].id);
        } else {
          setDefaultTabValue(''); // Reset or set to a default/fallback value if no workouts
        }
      }, [phase])

    const [phaseName, setPhaseName] = useState('')
    const [weeks, setWeeks] = useState('')
    const [workoutName, setWorkoutName] = useState('')

    const handleWorkoutNameChange = (event) => {
        setWorkoutName(event.target.value)
    }

    const handlePhaseNameChange = (event) => {
        setPhaseName(event.target.value);
      };
    const handleWeekChange = (value) => {
    setWeeks(value);

    };

    function createWorkout() {
        const workoutData = {
            phase: phase.id,
            name: workoutName,
            workout_exercises: []
        };
    
        apiClient.post('/workouts/', workoutData) 
        .then(response => {
            const newWorkout = response.data; 

            setPhase(prevPhase => {

                const updatedWorkouts = [...prevPhase.workouts, newWorkout];
                return { ...prevPhase, workouts: updatedWorkouts };
            });

            setProgram(prevProgram => {
                const updatedPhases = prevProgram.phases.map(p => {
                    if (p.id === phase.id) {
                        const updatedWorkouts = [...p.workouts, newWorkout];
                        return { ...p, workouts: updatedWorkouts };
                    }
                    return p; 
                });
                return { ...prevProgram, phases: updatedPhases };
            });
            setWorkoutName("");
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
        }

    function deleteWorkout(workoutId) {
        apiClient.delete(`/workouts/${workoutId}/`)
        .then(() => {

            setPhase(prevPhase => {
                const updatedWorkouts = prevPhase.workouts.filter(workout => workout.id !== workoutId);
                return { ...prevPhase, workouts: updatedWorkouts };
            });

            setProgram(prevProgram => {
                const updatedPhases = prevProgram.phases.map(p => {
                    if (p.id === phase.id) {
                        const updatedWorkouts = p.workouts.filter(workout => workout.id !== workoutId);
                        return { ...p, workouts: updatedWorkouts };
                    }
                    return p;
                });
                return { ...prevProgram, phases: updatedPhases };
            });
        })
        .catch(error => {
            console.error('Error deleting the phase:', error);
        });
        }


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


    /* useEffect(() => {
    apiClient.get(`/user_programs/${programId}/`)
        .then(response => {
            setProgram(response.data)
            if (response.data.phases && response.data.phases.length > 0) {
                // Set the phase state to the first item in the phases array
                
            }
            })
        
        .catch(error => console.error('Error:', error));
    }, [programId]); */

    const navigate = useNavigate();

    const editWorkout = (workoutId) => {
        navigate(`/edit/${phase.id}/${workoutId}`, { state: { program } });// Navigate to program details page
    };



    return (
    <div className={`w-full ${backgroundColorClass} md:border md:rounded-lg md:p-4`}>
        <Card className='border-0 md:border h-full w-full flex flex-col rounded-none md:rounded-lg'>
            <div className='p-6 flex justify-between items-center'>
                <div className='flex'>
                {program ? (
                    <>
                            <h1 className='text-2xl font-semibold'>{program.name}</h1>
                            <Badge variant='secondary' className='ml-4 text-xs'>Active</Badge>
                    </>
                ) : (
                    <p>Loading...</p> // Placeholder content or a loader can be placed here
                )}
                </div>

                <AlertDialog>
                    <AlertDialogTrigger>
                        <div className="h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                            <FontAwesomeIcon className='mr-1' icon={faPlus} /> Block</div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Create Phase</AlertDialogTitle>
                        <Label htmlFor="programName">Name</Label><Input value={phaseName} onChange={handlePhaseNameChange} autoComplete="off" id="programName" />
                        <Label htmlFor="select">Weeks</Label>
                        <Select value={weeks} onValueChange={handleWeekChange} id='select'>
                          <SelectTrigger className="w-[80px] focus:ring-0 focus:ring-offset-0">
                              <SelectValue placeholder="weeks" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectGroup>
                                  <SelectLabel>Weeks</SelectLabel>
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
                              </SelectGroup>
                          </SelectContent>
                        </Select>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={createPhase}>Create Phase</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                
            </div>
            <div className='flex flex-col'>
                <div className='flex w-full px-6 h-20'>
                {program && program.phases && program.phases.map((block, phaseIndex) => (
                <div style={{ flexGrow: block.weeks }} key={block.id} onClick={() => setPhase(block)} className={`relative flex flex-col justify-center items-center border ${theme === 'light' && block.id === (phase?.id) ? 'text-background' : 'text-foreground'} ${block.id === (phase?.id) ? 'bg-primary' : 'bg-background'} ${phase?.id !== block.id && 'hover:bg-accent'} transition duration-300 ease-in-out`}><p className='text-md md:text-xl font-semibold'>{block.name}</p><p className='text-sm'>{block.weeks} Weeks</p>
                <div onClick={(event) => event.stopPropagation()} className='absolute top-0 right-2'>
                    <Popover>
                        <PopoverTrigger className='pb-2 pl-2'><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                        <PopoverContent className='w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md'>
                            <Button onClick={() => deletePhase(block.id)} className='px-2 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>Delete Phase</Button>
                            </PopoverContent>
                    </Popover>
                </div>
            </div>
            ))}
                </div>
                
            </div>
            <div className='w-full h-full px-6 pt-4'>
                {phase? (
                    <Card className='px-2 h-[97%]'>
                        <div className='flex justify-between items-center'>
                            <h1 className='p-4 text-xl font-semibold'>{phase.name}</h1>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <div className="h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                                        <FontAwesomeIcon className='mr-1' icon={faPlus} /> Workout</div>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Create Workout</AlertDialogTitle>
                                    <Label htmlFor="programName">Name</Label><Input value={workoutName} onChange={handleWorkoutNameChange} autoComplete="off" id="workoutName" />
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={createWorkout}>Create Workout</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        {phase && phase.workouts && phase.workouts.length > 0 ? (
                            <Tabs key={defaultTabValue} defaultValue={defaultTabValue} className="hidden md:block w-full rounded-sm">
                                <div className='flex justify-center items-center'>
                                <TabsList className={'flex w-[95%] rounded-xs bg-muted '}>
                                    
                                    {phase && phase.workouts && phase.workouts.map((workout, index)=> (
                                        
                                        <TabsTrigger className='flex-1 gap-1 rounded-xs' key={workout.id} value={workout.id}>{workout.name}</TabsTrigger>
                                    ))}
                                </TabsList>
                                </div>

                            {phase && phase.workouts && phase.workouts.map((workout, index) => (
                                <TabsContent key={workout.id} value={workout.id}>
                                    <Card className='border-none h-80'>
                                        
                                        <CardContent className="space-y-2">
                                            <div className='relative h-4'>
                                                <div onClick={(event) => event.stopPropagation()} className='absolute top-0 right-4'>
                                                    <Popover>
                                                        <PopoverTrigger className='pb-2 pl-2'><FontAwesomeIcon size='lg' icon={faEllipsis} /></PopoverTrigger>
                                                        <PopoverContent className='w-full overflow-hidden rounded-md border bg-background p-0 text-popover-foreground shadow-md'>
                                                            <Button onClick={() => deleteWorkout(workout.id)} className='px-2 py-1.5 text-sm outline-none hover:bg-accent hover:bg-destructive bg-popover text-secondary-foreground'>Delete Workout</Button>
                                                            </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>
                                            
                                            <Table className='h-full'>
                                                <TableHeader>
                                                <TableRow className='relative'>
                                                    <TableHead className="w-1/3">Exercise</TableHead>
                                                    <TableHead className='w-1/3'>Sets x Reps</TableHead>
                                                    <TableHead className="w-1/3">Note</TableHead>
                                                    <TableHead onClick={() => editWorkout(workout.id)} className='text-foreground absolute right-0 pb-0.5 flex items-center'><p className='mr-2'>View Workout</p><FontAwesomeIcon icon={faEye} /></TableHead>
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