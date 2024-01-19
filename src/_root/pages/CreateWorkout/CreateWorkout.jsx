import React from 'react'
import "./Create.css";
import { useState, useEffect } from 'react';
import Axios from 'axios'

const CreateWorkout = () => {

  const [workoutExercises, setWorkoutExercises] = useState([])
  const [exercises, setExercises] = useState([]);
  const [workoutName, setWorkoutName] = useState('')
  const [exercise, setExercise] = useState("")

  const clickToAddExercise = (exerciseName) => {
    if (!workoutExercises.includes(exerciseName)) {
      setWorkoutExercises([...workoutExercises, exerciseName]);
    }
      console.log(workoutExercises)
  }
  const createWorkout = async (event) => {
    event.preventDefault();

    const workoutData = {
        name: workoutName,
        exercises: workoutExercises, 
    };

    try {
        const response = await fetch('http://localhost:8000/workout_create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(workoutData),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
            setWorkoutExercises([])
            setWorkoutName('')
            // Handle successful response
        } else {
            // Handle errors
            console.error('Failed to create workout');
        }
    } catch (error) {
        console.error('Error:', error);
    }
  };
  const createExercise = async (event) => {
    event.preventDefault()
    try {
        const response = await Axios.post('http://localhost:8000/exercise_create/', {
            name: exercise
        })
        console.log(response.data)
        fetchExercises()
        setExercise('');
    } catch (error) {
        console.error('There was an error!', error)
    }
  }
  const fetchExercises = () => {
    Axios.get('http://localhost:8000/exercises/').then((res) => {
      setExercises(res.data)
      console.log('pinging')
  })  
  }
  useEffect(() => {
    fetchExercises()
  }, []);

  let workoutExerciseList = workoutExercises.map(exercise => {
    return (
      <div key={exercise} className="exercise">
        <p key={exercise}>{exercise}</p>
        <div>
          <label>Sets</label>
          <input className='sets-input' type='number'/>
          <label>X Reps</label>
          <input className='reps-input' type='number'/>
          <label>Notes</label>
          <input className='notes-input' type='text'/>
        </div>
      </div>   
  )})

  let exerciseList = exercises.map(thing => {
    return (
        <p onClick={() => clickToAddExercise(thing.name)} key={thing.name} className="exercise">{thing.name}</p>
    )
  })

  return (
    <div className='workout-container'>
      <div className='create-workout-container'>
        <div className="workout-display-container" >
          <form onSubmit={createWorkout}>
            <label>Enter Workout Name</label>
            <input type="text" value={workoutName} onChange={e => setWorkoutName(e.target.value)}/>
            <div>
              {workoutExerciseList}
            </div>
            <input type="submit" value='Create Workout'/>
          </form>
        </div>
        <div className="add-exercise-container">
          <form onSubmit={createExercise}>
            <label>Enter New Exercise</label>
            <input type="text" value={exercise} onChange={e => setExercise(e.target.value)}/>
            <input type="submit" />
          </form>
          <h1>Click To Add</h1>
          {exerciseList}
        </div>       
      </div>
    </div>
    
  )
}

export default CreateWorkout