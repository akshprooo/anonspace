import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const userContext = createContext(null);

const UserProvider = ({ children }) => {
    const [clientToken, setClientToken] = useState(null);
    const [loggedin, setLoggedin] = useState(false);
    const [authMode, setAuthMode] = useState("detect");
    const api_url = import.meta.env.VITE_API_URL;
    const [user, setUser] = useState({})

    const getUser = async ()=>{
        const res = await axios.post(api_url+'/api/auth/getuser', {clientToken});
        setUser(res.data);
    }

    useEffect(() => {
        const token = localStorage.getItem("clientToken");

        if (token) {
            setClientToken(token);
            setAuthMode("login");
        } else {
            setAuthMode("register");
        }
    });

    useEffect(()=>{
        console.log(user);
    }, [user])

    return (
        <userContext.Provider
            value={{ clientToken, setClientToken, loggedin, setLoggedin, authMode, user, getUser }}
        >
            {children}
        </userContext.Provider>
    );
};

export default UserProvider;
