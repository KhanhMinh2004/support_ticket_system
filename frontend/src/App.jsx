import { Routes, Route } from 'react-router-dom'
import { UserTicketForm } from './pages/userpages/TicketForm'
import SignIn from './pages/publicpages/SignIn'
import SignUp from './pages/publicpages/SignUp'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css'

function App() {
    return (
        <Routes>
            <Route path="/signin" element = {<SignIn/>}/>
            <Route path="/signup" element = {<SignUp/>}/>
            <Route path="/ticket" element={<UserTicketForm/>}/>
        </Routes>
    )
}

export default App
