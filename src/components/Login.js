import React, { useState } from 'react';
import Axios from 'axios';

const USER_AUTH_ENDPOINT = 'https://candidate.neversitup.com/todo/users/auth';

const Login = ({setSession}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await Axios.post(USER_AUTH_ENDPOINT, {
                "username": username,
                "password": password
            });
            if(response.data.token){
                localStorage.setItem('access_token', response.data.token);
                setSession({
                    isLoggedIn: true,
                    currentUser: response.data.token
                });
            }
        } catch (error) {
            setSession({
                isLoggedIn: false,
                currentUser: null,
                errorMessage: error.message
            });
        }
    }
    
    const handleUsername = event => {
        setUsername(event.target.value)
    }

    const handlePassword = event => {
        setPassword(event.target.value)
    }
    return (
        <div>
            <label htmlFor="username">Username</label>
            <input type="email" name="username" placeholder="Email" onChange={handleUsername} required/>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" placeholder="Password" onChange={handlePassword} required/>
            <button type="button" name="username" onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login