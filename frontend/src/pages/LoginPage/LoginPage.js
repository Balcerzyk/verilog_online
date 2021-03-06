import React, { useState, useEffect } from 'react';
 
import config from "../../config.json";
import { sendRequest } from '../../utils';

import './LoginPage.css'

const LoginPage = (props) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    return (
        <div className='formDiv'>
            <a className='signInText'>Sign in</a>
            <form className='form' onSubmit={handleSubmit}>
        
                <input
                className='usernameInput'
                type="text"
                name="username"
                value={username}
                onChange={handleChangeUsername}
                placeholder="Username"/>
                
                <input
                className='passwordInput'
                type="password"
                name="password"
                value={password}
                onChange={handleChangePassword}
                placeholder="Password"/>
                
                <div className='errorDiv'> 
                    {error}<br/>
                </div>
                <input className='submitButton' type="submit" value="Login" />
            </form>
            <div className='signUpTextBottom'> 
                <a>You do not have an account? </a><a className='link' onClick = {() => {props.showRegisterPage(true)}}>Sign up!</a>
            </div>
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
        .then(response => {
            if(response.status == 200) {
              response.text().then(text => {
                let user = {
                    username: username,
                    token: text
                }
                props.login(user);
              })
            }
            else {
                setError('Invalid username or password');
            }
        });
    }
}

export default LoginPage;


