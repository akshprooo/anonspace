import { useContext, useEffect } from 'react'
import { userContext } from '../context/UserProvider';
import AuthForm from '../components/Layout/AuthForm';
import React from 'react';

const PageWrapper = ({ children }) => {
  const { loggedin, setLoggedin, setClientToken } = useContext(userContext);
  const {user} = useContext(userContext);

  useEffect(() => {
    console.log("loggedin:", loggedin)
  }, [loggedin]);

  return (
  user.banned ? (
    <h1>YOU ARE BANNED..!</h1>
  ) : (
    <main>
      {loggedin 
        ? <div className="w-full min-h-full">{children}</div>
        : <AuthForm onSuccess={(token) => { 
            setClientToken(token); 
            setLoggedin(true); 
          }} 
        />
      }
    </main>
  )
);
}

export default PageWrapper;
