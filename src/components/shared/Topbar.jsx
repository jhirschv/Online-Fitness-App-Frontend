import React from 'react'
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const Topbar = () => {
  //let { user, logoutUser } = useContext(AuthContext)

  return (
    <div  className="w-full h-16 flex items-center justify-between px-4 border">
        <Link to="/" className="ml-4 text-2xl font-bold">Home</Link>
        <FontAwesomeIcon icon={faRightFromBracket} size="xl mr-4"/>
    </div>
  )
}

export default Topbar