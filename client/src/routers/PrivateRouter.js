
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../UserContext';



export const PrivateRouter = () => {

    const {user} = useContext(UserContext);

    if(!user.logged){
        return <Navigate to="/users/login"/>
    }

  return <Outlet/>
}
