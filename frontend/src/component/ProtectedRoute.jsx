import {useAuth} from "../hooks/useAuth.jsx";
import {Navigate, Outlet} from "react-router-dom";

export const UserRoute = () => {
    const { user, loading } = useAuth();
    console.log(user)
    if (loading) return null; 
    if (!user) return <Navigate to="/signin" replace/>;
    return <Outlet/>
};

export const AdminRoute = () => {
    const { user, loading } = useAuth();
    console.log(user)
    if (loading) return null; 
    if (!user) return <Navigate to="/signin" replace />;
    if (user.is_staff) return <Outlet/>
};