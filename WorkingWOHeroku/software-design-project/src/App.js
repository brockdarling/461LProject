import React, { useState, useEffect } from 'react';
//import UserInfo from './UserInfo';
import LoginForm from "./loginform.js";
import Projects from './projects.js';
import Signup from "./signup.js";


//import uuidv4 from 'uuid/v4'
function App() {

  const [data, setData] = useState([{}])
  useEffect(() => {
    fetch("/members").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])

  return (
    // <div className = "page">
    //   <Projects/>
    // </div>
     <div className="page">
       <LoginForm />
     </div>
    //<div className="page">
     // <Signup />
    //</div>
  );
}

export default App;
