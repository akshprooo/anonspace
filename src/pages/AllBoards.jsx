import React, { useContext } from 'react'
import Sidebar from '../components/Layout/Sidebar'
import BoardsMain from '../components/AllBoards/Main'
import {PublicBoardsContext} from '../context/PublicBoardsProvider'

const AllBoards = () => {

  const { boards } = useContext(PublicBoardsContext);

  return (
    <div className='w-full h-full flex'>
      <Sidebar />
      <BoardsMain boards={boards} />
    </div>
  )
}

export default AllBoards