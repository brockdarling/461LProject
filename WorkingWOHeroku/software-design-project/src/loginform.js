import React, { useState } from "react";
import "./loginform.css"
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const navigate = useNavigate();

    const navigateProjects = () => {
        navigate('/Projects');
    };

    const navigateSignup = () => {
        navigate('/Signup');
    };

    const [popupStyle, showPopup] = useState("hide")
    const popup = () => {
        var password = document.getElementById("password").value
        var username = document.getElementById("username").value
        fetch('/confirm/' + username + '/' + password)
            .then((response) => {
                if (response.ok) {
                    try {
                        return response.text();
                    }
                    catch (e) {
                        console.log("Could not parse as text")
                    }
                }
            })
            .then((data) => {
                if (data == null) {
                    alert("Some error occurred");
                } else {
                    alert(data)
                }
            });


        showPopup("login-popup")
        setTimeout(() => showPopup("hide"), 3000)
    }


    return (
        <div className="cover">
            <h1>Login</h1>
            <input style={{ marginTop: '13%' }} id="username" className="login-input" type="text" placeholder="username" />
            <input style={{ marginTop: '8%' }} id="password" className="login-input" type="password" placeholder="password" />

            {/* <div style={{ marginTop: '15%' }} className="login-btn" onClick={popup}>Login</div> */}
            <div style={{ marginTop: '15%' }} className="login-btn" onClick={navigateProjects}>Login</div>

            <div className="sign-in" style={{ marginTop: '5%' }} onClick={navigateSignup}>
                Sign Up
            </div>

            <dic className={popupStyle}>
                <h3>Login Failed</h3>
                <p>Username or password incorrect</p>
            </dic>

        </div>
    )
}

export default LoginForm