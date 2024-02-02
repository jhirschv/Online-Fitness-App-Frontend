import React from 'react'
import { useState, useEffect } from 'react';
import Axios from 'axios'

const Exercises = () => {

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

  
const [name, setName] = useState("")

const handleSubmit = async (event) => {
    event.preventDefault()
    try {
        const response = await Axios.post('http://localhost:8000/exercise_create/', {
            name
        })
        console.log(response.data)
        fetchExercises()
    } catch (error) {
        console.error('There was an error!', error)
    }
}

let exerciseList = exercises.map(thing => {
return (
    <p key={thing.name} className="exercise">{thing.name}</p>
)
})

  return (
    <div className="workout-container">
      <div className="workout-content">
        <div className="exercise-form">
            <form onSubmit={handleSubmit}>
                <label>Create Exercise</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} />
                <input type="submit" />
            </form>
        </div>      
        <div>
            <h1>Exercises</h1>
            <div>{exerciseList}</div>
        </div>
      </div>
    </div>
  )
}

export default Exercises