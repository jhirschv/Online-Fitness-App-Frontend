import React from 'react'
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Link } from "react-router-dom";

const Topbar = () => {
  let { user, logoutUser } = useContext(AuthContext)

  return (
    <div  className="w-full h-16 flex items-center px-4">
        <Link to="/">Home</Link>
        <span> | </span>
        {user ? (
            <p onClick={logoutUser}>Logout</p>
        ) : (
            <Link to="/login" >Login</Link>
        )}
        {user && <p>Hello {user.username}!</p>}
    </div>
  )
}

export default Topbar