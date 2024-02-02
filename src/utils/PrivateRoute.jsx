import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = () => {

    //let { user } = useContext(AuthContext);
    return <Outlet />
}
    /* return user? <Outlet /> : <Navigate to='/login'/>
  }; */
  
export default PrivateRoute;