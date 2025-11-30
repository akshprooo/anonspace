import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import UserProvider from './context/UserProvider.jsx'
import PublicBoardsProvider from './context/PublicBoardsProvider.jsx'

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <PublicBoardsProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PublicBoardsProvider>
  </UserProvider>
)
