import {Routes, Route, Navigate} from 'react-router-dom'
import { UserTicketForm } from './pages/userpages/TicketForm'
import SignIn from './pages/publicpages/SignIn'
import SignUp from './pages/publicpages/SignUp'
import Analyst from './pages/adminpages/Analyst'
import AdminDashboard from "./pages/adminpages/AdminDashboard.jsx";
import SplashScreen from './pages/publicpages/SPLash.jsx'


import '@fontsource/roboto/200.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import {AdminRoute, UserRoute} from "./component/ProtectedRoute.jsx";
import { AuthProvider } from './hooks/useAuth.jsx'
import {useSelector} from "react-redux";



function App() {
    const seenSplash = useSelector((state) => state.splash.isFirstOpen);

    return (
        <AuthProvider>
            <Routes>
                {seenSplash && <Route path="/" element={<SplashScreen/>}/>}
                {!seenSplash && <Route path="/" element={<Navigate to="/signin" replace />} />}
                <Route path="/signin" element = { <SignIn/>}/>
                <Route path="/signup" element = {<SignUp/>}/>
                
                <Route element={<UserRoute/>}>
                    <Route path="ticket" element={<UserTicketForm/>}/>
                </Route>
                
                
                <Route element={<AdminRoute/>}>
                    <Route path="admin" element={<AdminDashboard/>}/>
                    <Route path="analyst" element={<Analyst/>}/>
                </Route>
            </Routes>
        </AuthProvider>
    )
}
export default App
