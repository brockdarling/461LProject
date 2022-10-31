import React, { useState, useEffect } from 'react';
//import UserInfo from './UserInfo';
import LoginForm from "./loginform.js";
import Projects from './projects.js';
import Signup from "./signup.js";
//import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
//import Routes from './Routes';
//import uuidv4 from 'uuid/v4'




function App() {
  // const [data, setData] = useState([{}])
  // useEffect(() => {
  //   fetch("/members").then(
  //     res => res.json()
  //   ).then(
  //     data => {
  //       setData(data)
  //       console.log(data)
  //     }
  //   )
  // }, [])

  return (
    <div className = "page">
      <Router>
        <Routes>

          <Route exact path = '/' element={<LoginForm/>} />
          <Route path = '/Signup' element={<Signup/>} />
          <Route path = '/Projects' element={<Projects/>} />

          {/* <Redirect to= "/" /> if any route is an error, redirect to login page */}

        </Routes>

      </Router>
    
    </div>

    // <div className = "page">
    //   <Projects/>
    // </div>
    // <div className="page">
    //   <LoginForm />
    // </div>
    // <div className="page">
    //   <Signup />
    // </div>
  );
}

export default App;
