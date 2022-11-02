import React, { useState } from "react";
import "./loginform.css"
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const navigate = useNavigate();

    async function confirmUserLogin() {
        var password = document.getElementById("password").value
        var username = document.getElementById("username").value
        const response = await fetch('/confirm/' + username + '/' + password);
        const result = await response.text();
        if (result === null || result === username+" is not a user for the website" || result === password+" is not the correct password") {
            alert("Incorrect username or password");
        } else {
            navigate('/Projects', {state: {user: username}});
        }
    }

    const navigateSignup = () => {
        navigate('/Signup');
    };

    return (
        <div className="cover">
            <h1>Login</h1>
            <input style={{ marginTop: '13%' }} id="username" className="login-input" type="text" placeholder="username" />
            <input style={{ marginTop: '8%' }} id="password" className="login-input" type="password" placeholder="password" />

            <div style={{ marginTop: '15%' }} className="login-btn" onClick={confirmUserLogin}>Login</div>

            <div className="sign-in" style={{ marginTop: '5%' }} onClick={navigateSignup}>
                Sign Up
            </div>

        </div>
    )
}

export default LoginForm