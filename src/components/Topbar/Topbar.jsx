import React from 'react'
import './Topbar.css'
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Topbar = () => {
  const { logout } = useContext(AuthContext);

  const handleClick = (e) => {
    logout()
  };

  return (
    <div onClick={handleClick} className='topbar'>
      <img className="main-logo"src='/assets/images/TrainerZ-logo.svg' alt="My SVG" />
      <div className="right-topbar">
        <img className="logout-icon" src='/assets/icons/logout (1).png' alt="My SVG" />
        <p>Logout</p>
      </div>
      
    </div>
  )
}

export default Topbar