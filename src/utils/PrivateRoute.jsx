import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {

    let { currentUser } = useContext(AuthContext);

    return currentUser? <Outlet /> : <Navigate to='/login'/>
  };
  
  export default PrivateRoute;