import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import Todo from './components/Todo';
import Login from './components/Login';
import Axios from 'axios';

function App() {
  const [session, setSession] = useState({
    isLoggedIn: false,
    currentUser: null,
    errorMessage: null,
  });

  useEffect(() => {
      const access_token = localStorage.getItem('access_token')
      if(access_token){
        setSession({
          isLoggedIn: true,
          currentUser: access_token,
          errorMessage: null
        });
      }
    return () => {
    }
  }, [])
  const handleLogout = () => {
    setSession({
      isLoggedIn: false,
      currentUser: null
    });
  }
  return (
    <div className="App">
      {session.isLoggedIn ?
        (<Todo session={session}/>)
      :
        (<Login setSession={setSession}/>)
      }
    </div>
  );
}

export default App;
