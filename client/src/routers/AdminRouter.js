
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../UserContext';



export const AdminRouter = () => {

    const {user} = useContext(UserContext);
    if(user.rolId == 1){

      return <Outlet/>

    }else {
      return <Navigate  to='/'/>
    }

}

