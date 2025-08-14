import { set } from "date-fns";
import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("Token from localStorage:", token);
        if (token) {
            fetch("http://localhost:8000/api/me/", {
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            .then(res => {
                if (!res.ok) throw new Error("Invalid token");
                return res.json();
            })
            .then(data => {
                setUser(data);
            })
            .catch(() => {
                localStorage.removeItem('token');
            })
            .finally(() => setLoading(false));
        
        } else {
            setLoading(false);
        }
    }, []);

    const login = (data) => {
        setUser(data.user)
        localStorage.setItem('token', data.token);
        console.log(data.token);
        if (data.user.is_staff) navigate("/admin")
        else navigate("/ticket")
    }
    const logout = () => {
        setUser(null)
        localStorage.removeItem('token');
        navigate('/', { replace: true })
    }
    return (
        <AuthContext.Provider value={{user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
    return useContext(AuthContext);
}