import React,{useContext, useEffect} from 'react'
import { useFetchWithToken } from '../hooks/useFetch'
import { UserContext } from '../UserContext'

export const Profile =  () => {

    const {user} = useContext(UserContext);

    useEffect(() => {

        const getData = async () => {
            const result = await useFetchWithToken('auth/me','GET',user.token);
            console.log(result)

          };
      
          getData();

    
       
    }, []);


  return (
    <div>Profile</div>
  )
}
