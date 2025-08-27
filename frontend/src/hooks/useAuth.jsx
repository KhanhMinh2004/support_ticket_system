import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
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
    }, [token]);


    const login = async (data) => {
        try {
            const response = await axios.post(`${API_URL}/login`, data)
            const { message, user, access_token, refresh_token } = response.data

            console.log("Login response:", response.data)

            localStorage.setItem('token', access_token)
            localStorage.setItem('refresh_token', refresh_token)
            setUser(user)
            setToken(access_token)
            setError(null)
            if (user.is_staff) navigate('/admin', { replace: true })
            else navigate('/ticket')
        } catch (error) {
            console.error("Login error:", error);
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            setError(error.response?.data?.message)
            setToken("")
            setUser(null)
        }
    }

    const loginWithGoogle = async (googleToken) => {
        try {
            const response = await axios.post(`${API_URL}/login/google`, { token: googleToken })
            console.log("Google Login request:", { token: googleToken })
            const { message, user, access_token, refresh_token } = response.data

            console.log("Google Login response:", response.data)

            localStorage.setItem('token', access_token)
            localStorage.setItem('refresh_token', refresh_token)
            setUser(user)
            setToken(access_token)
            setError(null)
            if (user.is_staff) navigate('/admin', { replace: true })
            else navigate('/ticket')
        } catch (error) {
            console.error("Google Login error:", error);
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            setError(error.response?.data?.message)
            setToken("")
            setUser(null)
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        navigate('/', { replace: true })
    }
    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
    return useContext(AuthContext);
}
