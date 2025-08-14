import {useAuth} from "../hooks/useAuth.jsx";
import {Navigate, Outlet} from "react-router-dom";

export const UserRoute = () => {
    const { user } = useAuth();
    console.log(user)
    if (!user) return <Navigate to="/signin" replace/>;
    if (!user.is_staff) return <Outlet/>
};

export const AdminRoute = () => {
    const { user } = useAuth();
    console.log(user)
    if (!user) return <Navigate to="/signin" replace />;
    if (user.is_staff) return <Outlet/>
};