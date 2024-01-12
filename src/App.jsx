import { useState, useEffect } from 'react'
import './App.css'
import Page1 from './_root/pages/page1';
import Page2 from './_root/pages/page2';
import RootLayout from './_root/RootLayout'
import { Routes, Route } from 'react-router-dom';


function App() {

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/page1" element={<Page1 />} />
        <Route path="/page2" element={<Page2 />} />
        <Route path="/" element={<h1>Home</h1>} />
      </Route>
    </Routes>
  )
}

export default App
