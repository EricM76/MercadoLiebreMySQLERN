import { useEffect, useState } from 'react';
const baseURL = process.env.REACT_APP_API_URL_BASE;

export const useFetchWithoutToken = (endpoint, method = 'GET',data) => {

    const url = `${baseURL}/${endpoint}`
   
    const [state, setState] = useState({
        loading : true,
         data : null
    });

    useEffect(() => {

        const fetchData = async () => {
            let response;

            if(method === 'GET'){
                response = await fetch(url, {
                    method
                });
            }

            if(method === 'POST'){
                response = await fetch(url, {
                    method,
                    body : JSON.stringify(data),
                    headers : {
                        'Content-type' : 'application/json'
                    },
                });
            }
          
            let result = await response.json();

            console.log(result);
             
            setState({
                loading : false,
                data : result
            })

        }

        fetchData()
       
    }, [endpoint]);

    return state
}
