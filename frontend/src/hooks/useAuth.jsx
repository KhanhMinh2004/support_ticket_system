import {createContext, useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate();

    const login = (data) => {
        setUser(data)

        if (data.is_staff) navigate("/admin")
        else navigate("/ticket")
    }
    const logout = () => {
        setUser(null)
        localStorage.removeItem('token');
        navigate('/', { replace: true })
    }
    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
    return useContext(AuthContext);
}