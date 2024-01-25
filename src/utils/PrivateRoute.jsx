import React from 'react'
import { Route, Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Login from '../_root/pages/Login';

const PrivateRoute = () => {
    console.log('private route works');
    const isAuthenticated = true
  
    return isAuthenticated? <Outlet /> : <Navigate to='/login'/>
  };
  
  export default PrivateRoute;