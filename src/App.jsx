import React from 'react'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import AllBoards from './pages/AllBoards'
import PublicBoard from './pages/PublicBoard'
import PrivateBoard from './pages/PrivateBoard'
import Post from './pages/Post'
import PageWrapper from './pages/PageWrapper'

const App = () => {
  return (
    <div className='w-full min-h-screen bg-black text-white'>


      <Routes>
        <Route path='/' element={<PageWrapper><Home /></PageWrapper>} />
        <Route path='/boards' element={<PageWrapper><AllBoards /></PageWrapper>} />
        <Route path='/board/public/:id' element={<PageWrapper><PublicBoard /></PageWrapper>} />
        <Route path='/board/private/:id' element={<PageWrapper><PrivateBoard /></PageWrapper>} />
        <Route path='/board/private/:boardId/post/:postId' element={<PageWrapper><Post /></PageWrapper>} />
        <Route path='/board/public/:boardId/post/:postId' element={<PageWrapper><Post /></PageWrapper>} />
        <Route path='/post/:postId' element={<PageWrapper><Post /></PageWrapper>} />
      </Routes>


    </div>
  )
}

export default App