import React, { useState, useEffect } from 'react';
 
import config from "../../config.json";
import { sendRequest } from '../../utils';

import './RegisterPage.css'

const RegisterPage = (props) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [error, setError] = useState("");

    return (
        <div className='formDiv'>
            <a className='signInText'>Sign up</a>
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

                <input
                className='passwordInput'
                type="password"
                name="passwordRepeat"
                value={passwordRepeat}
                onChange={handleChangePasswordRepeat}
                placeholder="Repeat password"/>
                
                <div className='errorDiv'> 
                    {error}<br/>
                </div>
                <input className='submitButton' type="submit" value="Register" />
            </form>
            <div> 
                <a className='signInTextBottom' >Do You have an account already? </a>
                <a className='link' onClick = {() => {props.showRegisterPage(false)}}>Sign in!</a>
            </div>
        </div>
    );

    function handleChangeUsername(event) {
        setUsername(event.target.value);
    }

    function handleChangePassword(event) {
        setPassword(event.target.value);
    }

    function handleChangePasswordRepeat(event) {
        setPasswordRepeat(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();

        if(username.length <= 0 || password.length <= 0) {
            setError("Username and password are required");
        }
        else if(password.length <= 5) {
            setError("Password must be longer than 5 characters");
        }
        else if(password != passwordRepeat) {
            setError("Passwords must match");
        }
        else {
            sendData();
        }
    }

    function sendData(){
        let requestObject = {
            url: `${config.SERVER_URL}/api/users/register`, 
            method: 'POST', 
            data: [{name: 'username', value: username}, {name: 'password', value: password}]
        }
        sendRequest(requestObject)
        .then(response => {
            if(response.status == 201) {
              response.text().then(text => {
                props.showRegisterPage(false);
              })
            }
            else {
                setError('This username already exists');
            }
        });
    }
}

export default RegisterPage;


