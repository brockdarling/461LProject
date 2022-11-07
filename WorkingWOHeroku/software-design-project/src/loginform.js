import React, { useState } from "react";
import "./loginform.css"
import { useNavigate } from "react-router-dom";

function LoginForm() {
    const navigate = useNavigate();

    async function confirmUserLogin() {
        var password = document.getElementById("password").value
        var userID = document.getElementById("userID").value
        if (userID !== "" && password !== "") {
            const response = await fetch('/confirm/' + userID + '/' + password);
            const result = await response.text();
            if (result === null || result === userID+" is not a user for the website" || result === password+" is not the correct password") {
                alert("Incorrect userID or password");
            } else {
                navigate('/Projects', {state: {user: userID}});
            } 
        } else {
            alert("UserID and Password cannot be empty");
        }
    }

    const navigateSignup = () => {
        navigate('/Signup');
    };

    return (
        <div className="cover">
            <h1>Login</h1>
            <input style={{ marginTop: '13%' }} id="userID" className="login-input" type="text" placeholder="userID" />
            <input style={{ marginTop: '8%' }} id="password" className="login-input" type="password" placeholder="password" />

            <div style={{ marginTop: '15%' }} className="login-btn" onClick={confirmUserLogin}>Login</div>

            <div className="sign-in" style={{ marginTop: '5%' }} onClick={navigateSignup}>
                Sign Up
            </div>

        </div>
    )
}

export default LoginForm