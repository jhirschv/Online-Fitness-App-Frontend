import React from 'react'
import { useEffect, useState } from 'react'
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
  import { faArrowLeft, faXmark, faCircleChevronLeft, faPenToSquare, faEllipsis, faFileVideo } from '@fortawesome/free-solid-svg-icons';
  faCircleLeft
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
  
  // Determine the background color class based on the theme
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    const [workoutExercises, setWorkoutExercises] = useState([])
    const [exercises, setExercises] = useState([]);
    const [visibleTextareas, setVisibleTextareas] = useState({});

    const fetchExercises = () => {
        Axios.get('http://localhost:8000/exercises/').then((res) => {
          setExercises(res.data)
      })  
      }
      useEffect(() => {
        fetchExercises()
      }, []);

    const clickToAddExercise = (name) => {
        if (!workoutExercises.includes(name)) {
          setWorkoutExercises([...workoutExercises, name]);
        } else {
            console.log("already included")
        }
      }

      let workoutExerciseList = workoutExercises.map(exercise => {
        
        return (
            <Card key={exercise} className='relative mt-1 mb-1 mr-3'> 
            <div className='absolute top-2 right-4'>
                <Popover>
                    <PopoverTrigger><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                    <PopoverContent>Place content for the popover here.</PopoverContent>
                </Popover>
            </div> 
            
            <CardContent className="py-4 flex justify-between items-center">
                <p className='w-1/4'>{exercise}</p>

                <div className='flex items-center ml-10'>
                <Select>
                    <SelectTrigger className="w-[80px] focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="sets" />
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
                        <SelectValue placeholder="reps" />
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
                    <FontAwesomeIcon size='xl' onClick={() => {setVisibleTextareas(prev => ({...prev, [exercise]: !prev[exercise]}))}} icon={faPenToSquare} />
                    <p className='text-xs mt-1'>Add Note</p>
                </div>   
                <div className='flex flex-col mr-2'>
                    <FontAwesomeIcon size="xl"icon={faFileVideo} />   
                    <p className='text-xs mt-1'>Add Video</p>
                </div>
                        
            </CardContent>   
            <CardFooter className='p-0'>
                {visibleTextareas[exercise] && <div className='w-full mb-2 mx-6'><Label>Note</Label><Textarea className='min-h-[20px] h-10 overflow-y-auto resize-none'/></div>}
            </CardFooter>                     
        </Card>
          )})

    let navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };
    

    return (
        <div className={`w-full flex ${backgroundColorClass} border rounded-lg p-4`}>
            <div className='w-3/5'>
                
                <Card className='mr-4 h-full flex flex-col'>
                    <FontAwesomeIcon onClick={handleClick} className=' self-start ml-6 mt-4' size='xl' icon={faCircleLeft}/>
                    <CardHeader>
                        <CardTitle className='font-bold'>Workout Name</CardTitle>
                        <CardDescription>Workout Description</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className='mb-2'>Exercises</p>
                        <ScrollArea className="h-full w-full rounded-md">
                            <div>
                                {workoutExerciseList}
                            </div>
                        </ScrollArea>
                        <Button className='bg-secondary text-secondary-foreground mt-6'>Create Workout</Button>
                   </CardContent>
                </Card>
            </div>

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
                                <div onClick={() => clickToAddExercise(exercise.name)} key={exercise.name}>
                                    <div className="text-sm">{exercise.name}</div>
                                    <Separator className="my-2" />
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>

            </div>
            
        </div>
  )
}

export default Create