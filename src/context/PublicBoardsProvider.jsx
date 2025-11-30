import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react'


export const PublicBoardsContext = createContext(null);

const PublicBoardsProvider = ({children}) => {

    const clientToken = localStorage.getItem('clientToken');
    const api_url = import.meta.env.VITE_API_URL;

    const [boards, setBoards] = useState();
    
    const getPublicBoards = async ()=>{
        const res = await axios.get(api_url+'/api/boards/get', {headers: {
            "x-client-token": clientToken,
        }})
        setBoards(res.data);
    }

    useEffect(()=>{
        getPublicBoards();
    }, []);

    useEffect(()=>{
        console.log(boards);
    }, [boards])

  return (
    <PublicBoardsContext.Provider value={{boards, getPublicBoards}}>
        {children}
    </PublicBoardsContext.Provider>
  )
}

export default PublicBoardsProvider