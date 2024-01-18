import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Workout.css'

const workout = () => {

  const { id } = useParams();
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // Fetch exercises for the workout
    const fetchExercises = async () => {
      const response = await fetch(`http://localhost:8000/exercises/${id}`);
      const data = await response.json();
      setExercises(data);
      console.log(data)
    };

    fetchExercises();
  }, [id]);

  return (
    <div className="workout-details">
      {exercises.map(exercise => (
        <div key={exercise.name}>
          <p>
          {exercise.name}
          </p>
        </div>
      ))}
    </div>
  );
}

export default workout