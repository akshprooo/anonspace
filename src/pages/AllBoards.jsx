import React from 'react'
import Sidebar from '../components/Layout/Sidebar'
import BoardsMain from '../components/AllBoards/Main'

const AllBoards = () => {

  return (
    <div className='w-full min-h-full flex'>
      <Sidebar />
      <BoardsMain />
    </div>
  )
}

export default AllBoards