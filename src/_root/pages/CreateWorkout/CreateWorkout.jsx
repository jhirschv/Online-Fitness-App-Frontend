import React from 'react'
import "./Create.css";
import { useState, useEffect } from 'react';
import Axios from 'axios'

const CreateWorkout = () => {

  const [workoutExercises, setWorkoutExercises] = useState([])

  const handleClick = (exerciseName) => {
    if (!workoutExercises.includes(exerciseName)) {
      setWorkoutExercises([...workoutExercises, exerciseName]);
    }
      console.log(workoutExercises)
  }

  const createWorkout = () => {
    
  }

  let workoutExerciseList = workoutExercises.map(exercise => {
    return (
      <div className="exercise">
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

  const [exercises, setExercises] = useState([]);

  const fetchExercises = () => {
    Axios.get('http://localhost:8000/exercises/').then((res) => {
      setExercises(res.data)
      console.log('pinging')
  })  
  }

  useEffect(() => {
    fetchExercises()
    }, []);

  let exerciseList = exercises.map(thing => {
    return (
        <p onClick={() => handleClick(thing.name)} key={thing.name} className="exercise">{thing.name}</p>
    )
    })

  const [name, setName] = useState("")

  const handleSubmit = async (event) => {
      event.preventDefault()
      try {
          const response = await Axios.post('http://localhost:8000/exercise_create/', {
              name
          })
          console.log(response.data)
          fetchExercises()
          setName('');
      } catch (error) {
          console.error('There was an error!', error)
      }
  }

  

  /* const [exercise, setExercise] = useState('');
  const [exercises, setExercises] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents page reload on form submit
    if (exercise) {
      setExercises([...exercises, exercise]); // Add new exercise to the list
      setExercise(''); // Reset the input field
    }
  }; */

  return (
    <div className='workout-container'>
      <div className='create-workout-container'>
        <div className="workout-display-container" >
          <form onSubmit={createWorkout}>
            <label>Enter Workout Name</label>
            <input type="text" />
            <div>
              {workoutExerciseList}
            </div>
            <input type="submit" value='Create Workout'/>
          </form>
        </div>
        <div className="add-exercise-container">
          <form onSubmit={handleSubmit}>
            <label>Enter New Exercise</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}/>
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