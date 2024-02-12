import React, { useState, useEffect } from 'react';
import axios from 'axios';


export default function YourWorkouts() {

    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/programs/')  // Adjust the URL based on your actual API endpoint
        .then(response => response.json())
        .then(data => setPrograms(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);


    return (
        <div>
            {programs.map(program => (
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
            ))}
        </div>
    )
 
}

