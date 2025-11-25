import React, { createContext, useEffect, useState } from "react";

export const userContext = createContext(null);

const UserProvider = ({ children }) => {
    const [clientToken, setClientToken] = useState(null);
    const [loggedin, setLoggedin] = useState(false);
    const [authMode, setAuthMode] = useState("detect"); 
    // detect → login/register based on token

    useEffect(() => {
        const token = localStorage.getItem("clientToken");

        if (token) {
            setClientToken(token);
            setAuthMode("login"); // must login to verify password
        } else {
            setAuthMode("register"); // no account, must register
        }
    }, []);

    return (
        <userContext.Provider
            value={{ clientToken, setClientToken, loggedin, setLoggedin, authMode }}
        >
            {children}
        </userContext.Provider>
    );
};

export default UserProvider;
