import React from 'react'
import Sidebar from '../components/Layout/Sidebar'
import HomeMain from '../components/Home/Main'

const Home = () => {
  return (
    <div className='w-full min-h-full flex'>
        <Sidebar />
        <HomeMain />
    </div>
  )
}

export default Home