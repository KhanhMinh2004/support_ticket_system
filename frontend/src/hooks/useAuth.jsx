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

    // useEffect(() => {
    //     const interceptor = axios.interceptors.response.use(
    //         response => response,
    //         async error => {
    //             if (error.response && error.response.status === 401) {
    //                 console.log("Token expired, attempting to refresh...");
    //                 try {
    //                     await refresh();
    //                     return axios(error.config);
    //                 } catch (refreshError) {
    //                     navigate('/', { replace: true });
    //                     return Promise.reject(refreshError);
    //                 }
    //             }
    //             return Promise.reject(error);
    //         });
    //     return () => axios.interceptors.response.eject(interceptor);
    // }, []);

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
    }, []);

    // const refresh = async () => {
    //     const refreshToken = localStorage.getItem('refresh_token');
    //     if (!refreshToken) {
    //         setError("No refresh token available");
    //         setToken("");
    //         setUser(null);
    //         localStorage.removeItem('token');
    //         localStorage.removeItem('refresh_token');
    //         navigate('/', { replace: true });
    //         return;
    //     }
    //     try {
    //         const response = await axios.post(`${API_URL}/refresh/`, {
    //             refresh_token: refreshToken
    //         }, {
    //             timeout: 500
    //         })
    //         const { access_token, refresh_token } = response.data
    //         localStorage.setItem('refresh_token', refresh_token)
    //         localStorage.setItem('token', access_token)
    //         setToken(access_token)
    //         setError(null)
    //     } catch (error) {
    //         console.error("Refresh error:", error);
    //         localStorage.removeItem('token');
    //         setError(error.response?.data?.message)
    //         setToken("")
    //         setUser(null)
    //     }
    // }

    const login = async (data) => {
        // setUser(data.user)
        // localStorage.setItem('token', data.token);
        // console.log(data.token);
        // if (data.user.is_staff) navigate("/admin")
        // else navigate("/ticket")
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
