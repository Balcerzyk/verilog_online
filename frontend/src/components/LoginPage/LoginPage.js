import React, { useState, useEffect } from 'react';
 
import config from "../../config.json";
import { sendRequest } from '../../utils';

const LoginPage = (props) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                type="text"
                name="username"
                value={username}
                onChange={handleChangeUsername}
                placeholder="Username"/>
                
                <label htmlFor="password">Password</label>
                <input
                type="password"
                name="password"
                value={password}
                onChange={handleChangePassword}
                placeholder="Password"/>
                
                {error}
                <input type="submit" value="Login" />
            </form>
        </div>
    );

    function handleChangeUsername(event) {
        setUsername(event.target.value);
    }

    function handleChangePassword(event) {
        setPassword(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();

        if(username.length <= 0 || password.length <= 0) {
            setError("Username and password are required");
        }
        else if(password.length <= 5) {
            setError("Password must be longer than 5 characters");
        }
        else {
            sendData();
        }
    }

    function sendData(){
        let requestObject = {
            url: `${config.SERVER_URL}/api/users/login`, 
            method: 'POST', 
            data: [{name: 'username', value: username}, {name: 'password', value: password}]
        }
        sendRequest(requestObject)
        .then(response => response.json())
        .then(result => {
            let user = {
                username: username,
                token: result.token
            }
            props.login(user);
        })
        .catch(setError('Username or password is invalid'));
    }
}

export default LoginPage;


