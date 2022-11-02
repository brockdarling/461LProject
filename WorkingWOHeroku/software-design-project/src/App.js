import React, { useState, useEffect } from 'react';
import LoginForm from "./loginform.js";
import Projects from './projects.js';
import Signup from "./signup.js";
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";

//import uuidv4 from 'uuid/v4'
function App() {

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
  );
}

export default App;
