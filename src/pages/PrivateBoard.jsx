import React from 'react'
import Sidebar from '../components/Layout/Sidebar'
import Page from '../components/Board/Page'
import { useParams } from 'react-router-dom'

const PrivateBoard = () => {

  const {id} = useParams();

  return (
    <div className='w-full min-h-full flex'>
        <Sidebar />
        <Page id={id} />
    </div>
  )
}

export default PrivateBoard;