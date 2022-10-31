import React, { useState } from "react";
import "./loginform.css"
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const Signup = () => {
    const navigate = useNavigate();

    const navigateProjects = () => {
        navigate('/Projects');
      };

    const navigateLogin = () => {
        navigate('/');
    };

    const [popupStyle, showPopup] = useState("hide")
    const popup = () => {
        var password = document.getElementById("password").value
        var username = document.getElementById("username").value
        var uid = document.getElementById('uid').value
        fetch('/new/' + username + '/' + password + '/' + uid)
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
            <h1>Signup</h1>
            <input style={{ marginTop: '10%' }} id="username" className="login-input" type="text" placeholder="username" />
            <input style={{ marginTop: '7%' }} id="uid" className="login-input" type="text" placeholder="user id" />
            <input style={{ marginTop: '7%' }} id="password" className="login-input" type="password" placeholder="password" />

            {/* <div style={{ marginTop: '13%' }} className="login-btn" onClick={popup}>Sign Up</div> */}
            <div style={{ marginTop: '13%' }} className="login-btn" onClick={navigateProjects}>Sign Up</div>

            <div className = "sign-in" style={{ marginTop: '5%' }} onClick={navigateLogin}>
                Login
            </div>

            <dic className={popupStyle}>
                <h3>Login Failed</h3>
                <p>Username or password incorrect</p>
            </dic>

        </div>
    )
}

export default Signup