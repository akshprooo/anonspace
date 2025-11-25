import { useContext, useEffect } from 'react'
import { userContext } from '../context/UserProvider';
import AuthForm from '../components/Layout/AuthForm';

const PageWrapper = ({ children }) => {
  const { loggedin, setLoggedin, setClientToken } = useContext(userContext);

  useEffect(() => {
    console.log("loggedin:", loggedin)
  }, [loggedin]);

  return (
    <main>
      {loggedin 
        ? <div className="w-full min-h-full">{children}</div>
        : <AuthForm onSuccess={(token)=>{ setClientToken(token); setLoggedin(true); }} />
      }
    </main>
  );
}

export default PageWrapper;
