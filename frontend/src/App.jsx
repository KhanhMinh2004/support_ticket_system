import { Routes, Route } from 'react-router-dom'
import { UserTicketForm } from './pages/userpages/TicketForm'
import SignIn from './pages/publicpages/SignIn'
import SignUp from './pages/publicpages/SignUp'
import Analyst from './pages/adminpages/Analyst'
import AdminDashboard from "./pages/adminpages/AdminDashboard.jsx";
import '@fontsource/roboto/200.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css'
import { useNavigate } from 'react-router-dom'
import { use, useEffect } from 'react'


function PrivateRoute({ children }) {
    const navigate = useNavigate();
    const role = localStorage.getItem("role")
    
    useEffect(() => {
        if (role !== 'admin'){
            navigate('/signin')
        }
    }, [role, navigate])
    return children
}

function App() {
    return (
        <Routes>
            <Route path="/signin" element = { <SignIn/> }/>
            <Route path="/signup" element = {<SignUp/>}/>
            <Route path="/ticket" element={<UserTicketForm/>}/>
            <Route path="/analyst" element={<PrivateRoute> <Analyst/> </PrivateRoute>}/>
            <Route path="/admin" element={<AdminDashboard/>}/>
        </Routes>
    )
}

export default App
