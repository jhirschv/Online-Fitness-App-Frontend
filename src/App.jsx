import { useState, useEffect } from 'react'
import './App.css'
import Workouts from './_root/pages/Workouts';
import Clients from './_root/pages/Clients';
import Exercises from './_root/pages/Exercises';
import RootLayout from './_root/RootLayout'
import { Routes, Route } from 'react-router-dom';


function App() {

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/page1" element={<Workouts />} />
        <Route path="/page2" element={<Clients />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/" element={<h1>Dashboard</h1>} />
      </Route>
    </Routes>
  )
}

export default App
