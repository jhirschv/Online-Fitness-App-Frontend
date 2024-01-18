import React from 'react'
import "./Create.css";
import { useState, useEffect } from 'react';

const CreateWorkout = () => {

  const [exercise, setExercise] = useState('');
  const [exercises, setExercises] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents page reload on form submit
    if (exercise) {
      setExercises([...exercises, exercise]); // Add new exercise to the list
      setExercise(''); // Reset the input field
    }
  };

  return (
    <div className='workout-container'>
      <div className='create-workout-container'>
          <div className='workout-display-container'>
              <h1>Workout</h1>
              {exercises.map((ex, index) => (
            <h3 key={index}>{ex}</h3> // Render each exercise
          ))}
          </div>
          <div className='add-exercise-container'>
          <form onSubmit={handleSubmit}>
              <label>Add Exercise</label>
              <input type="text" value={exercise} onChange={e => setExercise(e.target.value)} />
              <input type="submit" />
          </form>
          </div>
      </div>
    </div>
    
  )
}

export default CreateWorkout