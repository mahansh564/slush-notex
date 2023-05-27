import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState({ id: 0, name: "" })
    const [auth, setAuth] = useState(false)

    const navigate = useNavigate();

    const IsLogged = async () => {
        const token = localStorage.getItem('id');
        const name = localStorage.getItem('name');
        try {
            if (token) {
                setAuth(true)
                setUser({ id: token, name: name})
            }
            else {
                localStorage.removeItem("id");
                localStorage.removeItem('name');
                setAuth(false)
                setUser({ id: 0, name: "" })
            }
        } catch (error) {
                localStorage.removeItem("id");
                localStorage.removeItem('name');
                setAuth(false)
                setUser({ id: 0, name: "" })
        }
    }

    const logout = () => {
        localStorage.removeItem("id");
        localStorage.removeItem('name');
        setAuth(false)
        console.log("logout");
        navigate("/login");
    }

    useEffect(() => {
        IsLogged()
    }, [auth])

    const values = {
        setAuth,
        auth,
        logout,
        user
    }

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export default AuthContext
