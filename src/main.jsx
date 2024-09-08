import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import GameRoom from './components/GameRoom.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path='/home' element={<App/>}/>
        <Route path='/game/:roomCode' element={<GameRoom/>}/>
      </Routes>
    </Router>
  </StrictMode>,
)