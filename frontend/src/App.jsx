import { Routes, Route } from 'react-router-dom'
import { UserTicketForm } from './pages/TicketForm/TicketForm'
import './App.css'

function App() {
  return (
    <Routes>
        <Route path="/ticket" element={<UserTicketForm/>}/>
    </Routes>
  )
}

export default App
