import { useState, useEffect } from 'react'
import './App.css'
import Workouts from './_root/pages/Workouts';
import Workout from './_root/pages/Workout/Workout';
import PrivateRoute from './utils/PrivateRoute'
import CreateWorkout from './_root/pages/CreateWorkout/CreateWorkout';
import Clients from './_root/pages/Clients';
import Register from './_root/pages/Register';
import Login from './_root/pages/Login';
import Exercises from './_root/pages/Exercises';
import RootLayout from './_root/RootLayout'
import { Routes, Route } from 'react-router-dom';


function App() {

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route element={<PrivateRoute />}>
          <Route index element={<h1>Dashboard</h1>} />
          <Route path="createWorkout" element={<CreateWorkout />} />  
          <Route path="/Workout/:id" element={<Workout />} />
          <Route path="/page1" element={<Workouts />} />
          <Route path="/page2" element={<Clients />} />
          <Route path="/exercises" element={<Exercises />} />
        </Route>
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
