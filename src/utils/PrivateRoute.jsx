import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = () => {

    let { user } = useContext(AuthContext);

    return !user? <Navigate to='/login'/> : <Outlet />
}
    
  
export default PrivateRoute;