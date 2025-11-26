import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { userContext } from '../../context/UserProvider';

const BoardsMain = () => {

  const clientToken = localStorage.getItem('clientToken');
  const api_url = import.meta.env.VITE_API_URL;
  const {user, setUser} = useContext(userContext);

  const getPublicBoards = async ()=>{
    const res = await axios.get(api_url+'/api/boards/get', {headers: {
      "x-client-token": clientToken,
    }})
    // setUser(res.data)
    console.log(res)
  }

  useEffect(()=>{
    getPublicBoards();
  })

  
  return (
    <div className='w-full lg:w-3/4 min-h-screen lg:pl-1 lg:p-3'>
        <main className='h-full w-full lg:border-2 lg:rounded-lg lg:border-white/30'>
        </main>
    </div>
  )
}

export default BoardsMain