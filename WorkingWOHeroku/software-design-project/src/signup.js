import React, { useState } from "react";
import "./loginform.css"
import { useNavigate } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();

    async function addNewUserToDB() {
        var password = document.getElementById("password").value
        var username = document.getElementById("username").value
        var uid = document.getElementById('uid').value
        const response = await fetch('/new/' + username + '/' + password + '/' + uid);
        const result = await response.text();
        if (result === null || result === username+" is already a user") {
            alert("This username or userid already exists");
        } else {
            navigate('/Projects');
        }
    }

    const navigateLogin = () => {
        navigate('/');
    };
    
    return (
        <div className="cover">
            <h1>Signup</h1>
            <input style={{ marginTop: '10%' }} id="username" className="login-input" type="text" placeholder="username" />
            <input style={{ marginTop: '7%' }} id="uid" className="login-input" type="text" placeholder="user id" />
            <input style={{ marginTop: '7%' }} id="password" className="login-input" type="password" placeholder="password" />

            <div style={{ marginTop: '13%' }} className="login-btn" onClick={addNewUserToDB}>Sign Up</div>

            <div className = "sign-in" style={{ marginTop: '5%' }} onClick={navigateLogin}>
                Login
            </div>

        </div>
    )
}

export default Signup