import { Routes, Route } from 'react-router-dom'
import { UserTicketForm } from './pages/TicketForm'
import '@fontsource/roboto/200.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css'
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
    return (
        <Routes>
            <Route path="/ticket" element={<UserTicketForm/>}/>
            <Route path="/admin" element={<AdminDashboard/>}/>
        </Routes>
    )
}

export default App
