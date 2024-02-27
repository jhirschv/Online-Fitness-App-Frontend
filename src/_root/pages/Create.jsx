import React from 'react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut } from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from '@/components/ui/input'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faArrowLeft, faXmark, faAngleLeft, faCircleChevronLeft, faPenToSquare, faEllipsis, faFileVideo } from '@fortawesome/free-solid-svg-icons';
  import { faCircleLeft } from '@fortawesome/free-regular-svg-icons';

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
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { Search } from "lucide-react"
  import { useNavigate } from 'react-router-dom';
  import Axios from 'axios';
  import { Button } from "@/components/ui/button"
  import { useTheme } from '@/components/theme-provider';
  import { Textarea } from "@/components/ui/textarea"
  import { Label } from "@/components/ui/label"


  

const Create = () => {
    const { theme } = useTheme();
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    const [workout, setWorkout] = useState()
    const [workoutExercises, setWorkoutExercises] = useState([])
    const [exercises, setExercises] = useState([]);
    const [visibleTextareas, setVisibleTextareas] = useState({});
    const [phase, setPhase] = useState({});
    const [editMode, setEditMode] = useState(true)

    const { phaseId, workoutId } = useParams();
    let location = useLocation();
    let program = location.state.program;

    useEffect(() => {
        apiClient.get(`/workouts/${workoutId}/`)
            .then(response => {
                setWorkout(response.data)
                setWorkoutExercises(response.data.workout_exercises)
                console.log(response.data.workout_exercises)
                })
            
            .catch(error => console.error('Error:', error));
        }, [workoutId]);

    useEffect(() => {
        apiClient.get(`/phases/${phaseId}/`)
            .then(response => {
                setPhase(response.data)
                })
            
            .catch(error => console.error('Error:', error));
        }, [workoutId]);


    function createWorkoutExercise(exerciseId) {
        const newWorkoutExercise = {
            exercise_id: exerciseId,
            sets: null,
            reps: null,
            note: "",
            video: null,
            workout: workoutId, 
        };

        apiClient.put(`/workout_exercises/6/`, newWorkoutExercise) 
        .then(response => {
            console.log('Workout updated successfully:', response.data);
        })
        .catch(error => {
            console.error('Failed to update workout:', error);
        });
    }

    
    function updateWorkout() {
        console.log(workoutExercises)
        const workoutData = {
            id: workoutId,
            workout_exercises: workoutExercises.map(({id, exercise, sets, reps, note, video}) => ({
                id,
                workout: workoutId,
                exercise_id: exercise.id, 
                sets: sets === "" ? 0 : parseInt(sets, 10), // Convert to integer or use null
                reps: reps === "" ? 0 : parseInt(reps, 10), 
                note,
                video,
            })),
            name: workout.name,
            phase: phase.id
        }
        apiClient.put(`/workouts/${workoutId}/`, workoutData) 
        .then(response => {
            console.log('Workout updated successfully:', response.data);
        })
        .catch(error => {
            console.error('Failed to update workout:', error);
        });
        }

    const fetchExercises = () => {
        Axios.get('http://localhost:8000/exercises/').then((res) => {
          setExercises(res.data)
      })  
      }
      useEffect(() => {
        fetchExercises()
      }, []);

    const clickToAddExercise = (exerciseToAdd) => {

        const isAlreadyIncluded = workoutExercises.some(
            (exerciseDetail) => exerciseDetail.exercise.id === exerciseToAdd.id
        );
        if (!isAlreadyIncluded) {
            const newExerciseDetail = {
                exercise: exerciseToAdd,
                sets: "", 
                reps: "", 
                note: "",
                video: null,
                workout: workoutId, 
            };

        setWorkoutExercises([...workoutExercises, newExerciseDetail]);
        console.log(workoutExercises)
        } else {
            console.log("already included");
        }
      }

    let navigate = useNavigate();

    function goBack() {
        navigate(-1);
    }

    let workoutExerciseList = workoutExercises.map(exerciseDetail => {
        const { exercise, sets, reps } = exerciseDetail;
        return (
            <Card key={exercise.id} className='relative mt-1 mb-1 mr-3'> 
            {editMode ? 
            <div className='absolute top-2 right-4'>
                <Popover>
                    <PopoverTrigger><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                    <PopoverContent>Place content for the popover here.</PopoverContent>
                </Popover>
            </div> : <></>}
            {editMode ?
            <CardContent className="h-20 py-4 flex justify-between items-center">
                <p className='w-1/4 font-semibold'>{exercise.name}</p>

                 
                <div className='flex items-center ml-10'>
                <Select>
                    <SelectTrigger className="w-[80px] focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder={`${sets? sets : 'sets'}`} />
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
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <FontAwesomeIcon className='m-3' icon={faXmark} />
                <Select>
                    <SelectTrigger className="w-[80px] focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder={`${reps? reps : 'reps'}`} />
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
                        </SelectGroup>
                    </SelectContent>
                </Select> 
                </div>     
                 
                <div className='flex flex-col'>
                    <FontAwesomeIcon onClick={() => {setVisibleTextareas(prev => ({...prev, [exercise]: !prev[exercise]}))}} size='lg' icon={faPenToSquare} />
                    <p className='text-xs mt-1'>Add Note</p>
                </div>   
                <div className='flex flex-col mr-2'>
                    <FontAwesomeIcon size="lg"icon={faFileVideo} />   
                    <p className='text-xs mt-1'>Add Video</p>
                </div>
                        
            </CardContent>
            : 
            <CardContent className="h-20 py-4 flex items-center">
                <p className='w-1/4 font-semibold'>{exercise.name}</p>
                <div className='self-center flex items-center ml-36'>
                    <p className='text-lg font-semibold'>{sets}  x  {reps}</p>
                </div>
                
            </CardContent>
            }   
            <CardFooter className='p-0'>
                {visibleTextareas[exercise] && 
                <div className='w-full mb-2 mx-6'>
                    <Label>Note</Label><Textarea className='min-h-[20px] h-10 overflow-y-auto resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0' spellcheck="false"/>
                </div>}
            </CardFooter>                     
        </Card>
            )})

    

    return (
        <div className={`w-full flex ${backgroundColorClass} border rounded-lg p-4`}>
            <div className='w-3/5'>
                
                <Card className='mr-4 h-full flex flex-col'>
                    <CardHeader className='flex flex-row items=center justify-between'>
                        <div>
                        {workout ? (
                            <>
                                <CardTitle className='font-semibold'>{workout.name}  <FontAwesomeIcon onClick={()=> setEditMode(currentState => !currentState)} className='ml-1' size='xs' icon={faPenToSquare} /></CardTitle>
                                <CardDescription>{program.name} &gt; {phase.name}</CardDescription>
                            </>
                        ) : (
                            <p>Loading...</p> // Placeholder content or a loader can be placed here
                        )}
                        </div>
                        <FontAwesomeIcon onClick={goBack} size="xl" icon={faAngleLeft} />
                        
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-96 w-full rounded-md">
                            <div>
                                {workoutExerciseList.length > 0 ? workoutExerciseList : <div className=' flex justify-center items-center w-full h-96 text-muted-foreground font-semibold text-xl'>
                                    <h1 className='text-muted-foreground font-semibold text-xl'>No Exercises</h1></div>}
                            </div>
                        </ScrollArea>
                        {editMode ? <Button onClick={() => updateWorkout()} className='mt-6'>Save Changes</Button>: <> </>}
                   </CardContent>
                </Card>
            </div>
            {editMode ? 
            <div className='flex-1 flex-col'>
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
                
                <ScrollArea className="h-96 w-full rounded-md border bg-background">
                    <div className="p-4">
                        <h4 className="mb-4 text-xl font-bold leading-none">Add Exercises</h4>
                        {exercises.map((exercise)=> {
                            return (
                                <div onClick={() => clickToAddExercise(exercise)} key={exercise.name}>
                                    <div className="text-sm">{exercise.name}</div>
                                    <Separator className="my-2" />
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea> 

            </div>
            : <></> }
            
        </div>
  )
}

export default Create