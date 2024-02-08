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
  import { faArrowLeft, faEllipsis  } from '@fortawesome/free-solid-svg-icons';
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
  import axios from 'axios';

const Create = () => {

    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        const options = {
          method: 'GET',
          url: 'https://exercisedb.p.rapidapi.com/exercises/equipment/barbell',
          params: {limit: '50'},
          headers: {
            'X-RapidAPI-Key': 'e1b32c3a83msh346e8bfab8e7057p1dd446jsnf5b1b4e06fba',
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
          }
        };
    
        async function fetchData() {
          try {
            const response = await axios.request(options);
            const names = response.data.map(exercise => exercise.name);
            setExercises(names)
          } catch (error) {
            console.error(error);
          }
        }
    
        fetchData();
      }, []);

      useEffect(() => {
        console.log(exercises); // This will log the updated state
      }, [exercises]);

    let navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };
    

    return (
        <div className='w-full flex bg-popover border rounded-lg p-4'>
            <div className='w-3/5 mb-12'>
                
                <Card className='h-full mr-4'>
                    <FontAwesomeIcon onClick={handleClick} className='ml-2 mt-3' size='xl' icon={faArrowLeft} />
                    <CardHeader>
                        <CardTitle className='font-bold'>Workout Name</CardTitle>
                        <CardDescription>Workout Description</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className='mb-2'>Exercises</p>
                        <Card className='relative'> 
                            <div className='absolute top-2 right-4'>
                                <Popover>
                                    <PopoverTrigger><FontAwesomeIcon icon={faEllipsis} /></PopoverTrigger>
                                    <PopoverContent>Place content for the popover here.</PopoverContent>
                                </Popover>
                            </div> 
                            
                            <CardContent className="mt-5 flex">
                                <p className='mt-3'>Back Squat</p>

                                <div className='flex items-center ml-10'>
                                <Select>
                                    <SelectTrigger className="w-[80px] focus:ring-0 focus:ring-offset-0">
                                        <SelectValue placeholder="sets" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>sets</SelectLabel>
                                            <SelectItem value="cat">1</SelectItem>
                                            <SelectItem value="cat">2</SelectItem>
                                            <SelectItem value="cat">3</SelectItem>
                                            <SelectItem value="cat">4</SelectItem>
                                            <SelectItem value="cat">5</SelectItem>
                                            <SelectItem value="cat">6</SelectItem>
                                            <SelectItem value="cat">7</SelectItem>
                                            <SelectItem value="cat">8</SelectItem>
                                            <SelectItem value="cat">9</SelectItem>
                                            <SelectItem value="cat">10</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <h1 className='m-3 font-bold'>X</h1>
                                <Select>
                                    <SelectTrigger className="w-[80px] focus:ring-0 focus:ring-offset-0">
                                        <SelectValue placeholder="reps" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>reps</SelectLabel>
                                            <SelectItem value="cat">1</SelectItem>
                                            <SelectItem value="cat">2</SelectItem>
                                            <SelectItem value="cat">3</SelectItem>
                                            <SelectItem value="cat">4</SelectItem>
                                            <SelectItem value="cat">5</SelectItem>
                                            <SelectItem value="cat">6</SelectItem>
                                            <SelectItem value="cat">7</SelectItem>
                                            <SelectItem value="cat">8</SelectItem>
                                            <SelectItem value="cat">9</SelectItem>
                                            <SelectItem value="cat">10</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                </div>                            
                            </CardContent>                        
                        </Card>
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
                        {exercises.map((name)=> {
                            return (
                                <div key={name}>
                                    <div className="text-sm">{name}</div>
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