import React, { useState, useEffect } from 'react';
import apiClient from '../../services/apiClient';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from '@/components/theme-provider';
import { useNavigate } from 'react-router-dom';


export default function YourWorkouts() {

    const { theme } = useTheme();
  
    const backgroundColorClass = theme === 'dark' ? 'bg-popover' : 'bg-secondary';

    const [programs, setPrograms] = useState([]);
    const navigate = useNavigate();

    const handleProgramClick = (programId) => {
        navigate(`/programs/${programId}`); // Navigate to program details page
    };


    useEffect(() => {
        apiClient.get('/user_programs/') // Make sure the endpoint matches your Django URL configuration
        .then(response => {
            setPrograms(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);

    return (

        <div className={`w-full ${backgroundColorClass} border rounded-lg p-4`}>
            <Card className='h-full w-full'>
                <div>
                    <h1 className='text-center text-3xl font-bold p-6'>Programs</h1>
                    <div className='grid grid-cols-4 gap-4 w-full p-4' >
                    {programs.map(program => (
                        <div key={program.id} onClick={() => handleProgramClick(program.id)}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{program.name}</CardTitle>
                                    <CardDescription>{program.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                </CardContent>
                                <CardFooter>
                                    <p>Creator: {program.creator.username[0].toUpperCase() + program.creator.username.slice(1)}</p>
                                </CardFooter>
                            </Card>
                        </div>
                    ))}
                    
                    </div>
                </div>
                <Button onClick={()=>navigate('/create')} className='m-4 bg-muted-foreground'>Create New Program</Button>
            </Card>
        </div>
        
        
    )
 
}

{/* {programs.map(program => (
                <div key={program.id}>
                <h1>{program.name}</h1>
                <p>{program.description}</p>
                {program.phases.map(phase => (
                    <div key={phase.id}>
                    <h3>Phase {phase.number}: {phase.weeks} weeks</h3>
                    {phase.workouts.map(workout => (
                        <div key={workout.id}>
                        <h4>Workout: {workout.name}</h4>
                        {workout.workout_exercises.map(exercise => (
                            <div key={exercise.id}>
                            <p>Exercise: {exercise.exercise.name}</p>
                            <p>Sets: {exercise.sets}, Reps: {exercise.reps}</p>
                            {exercise.note && <p>Note: {exercise.note}</p>}
                            {exercise.video && <p><a href={exercise.video}>Video</a></p>}
                            </div>
                        ))}
                        </div>
                    ))}
                    </div>
                ))}
                </div>
            ))} */}