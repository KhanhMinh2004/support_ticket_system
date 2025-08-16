import {createContext, useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
const AuthContext = createContext()

const API_URL = import.meta.env.VITE_API_URL

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || "")
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetch(`${API_URL}/me/`, {
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

    const login = async (data) => {
        // setUser(data.user)
        // localStorage.setItem('token', data.token);
        // console.log(data.token);
        // if (data.user.is_staff) navigate("/admin")
        // else navigate("/ticket")
        try{
            const response = await axios.post(`${API_URL}/login`, data)
            const {message, user, token} = response.data

            localStorage.setItem('token', token)
            setUser(user)
            setToken(token)
            setError(null)
            if (user.is_staff) navigate('/admin', { replace: true })
            else navigate('/ticket')
        } catch (error) {
            console.error("Login error:", error);
            localStorage.removeItem('token');
            setError(error.response?.data?.message)
            setToken("")
            setUser(null)
        }
    }
    const logout = () => {
        setUser(null)
        localStorage.removeItem('token');
        navigate('/', { replace: true })
    }
    return (
        <AuthContext.Provider value={{user, login, logout, loading, error}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
    return useContext(AuthContext);
}