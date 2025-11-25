import React from 'react'
import Sidebar from '../components/Layout/Sidebar'
import Main from '../components/Home/Main'

const Home = () => {
  return (
    <div className='w-full min-h-full flex'>
        <Sidebar />
        <Main />
    </div>
  )
}

export default Home