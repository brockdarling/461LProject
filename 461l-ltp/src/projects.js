import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import "./projects.css"
import SingleProject from "./singleProject";
import SelectProj from "./selectProj";
import { useNavigate } from "react-router-dom";

function Projects() {
    const navigate = useNavigate();

    const refreshPage = () => {
        navigate('/Projects');
    }

    const location = useLocation();
    const userID = location.state.user;

    const [state, setState] = useState({
        data: []
    });

    const [displayCreate, changeDisplayCreate] = useState(false);

    const [displaySelect, changeDisplaySelect] = useState(false);

    function handleSelectProject(i) {
        state.data.map((j) => {
            j.display = false;
        });
        i.display = true;
        changeDisplaySelect(false);
        forceUpdate();
    }

    function showAllProjects() {
        state.data.map((j) => {
            j.display = true;
        });
        changeDisplaySelect(false);
        forceUpdate();
    }

    function useForceUpdate() {
        let [value, setState] = useState(true);
        return () => setState(!value);
    }

    async function createProject() {
        var projectID = document.getElementById("projectID").value.replaceAll(' ', '');
        var userList = document.getElementById("userList").value.replaceAll(' ', '');
        var users = userList.split(',');
        // userList = '["'+userList.replaceAll(',','","')+'"]';
        if (projectID !== "" && userList !== ""){
            var requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({userList: users})
            };
            await fetch('/createProject/'+projectID+'/'+userID, requestOptions ); 
        } else if (projectID !== "" && userList === "") {
            var requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({userList: "all"})
            };
            await fetch('/createProject/'+projectID+'/'+userID, requestOptions ); 
        }
    }

    let forceUpdate = useForceUpdate();

    useEffect(() => {
        fetch('/allprojects', { methods: 'GET' })
            .then(response => {
                return response.json();
            })
            .then((jsonData) => {
                setState({
                    data: jsonData.map(item => ({
                        pid: item.projectID,
                        users: JSON.stringify(item.users).replaceAll('[', '').replaceAll(']', '').replaceAll('"', '').replaceAll(',', ', '),
                        hwset1num: item.HWSet[0],
                        hwset1den: item.HWSet[2],
                        hwset2num: item.HWSet[1],
                        hwset2den: item.HWSet[3],
                        display: true
                    })),
                })
            });
    }, [])

    return (
        <div>
            <div className="create-proj-div">
                <button className="create-proj-btn" style={displayCreate ? { display: 'none' } : { display: 'flex' }} onClick={() => { changeDisplaySelect(!displaySelect) }}>
                    Select Project
                </button>
                <button className="create-proj-btn" style={displayCreate ? { display: 'none' } : { display: 'flex' }} onClick={() => { changeDisplayCreate(!displayCreate); changeDisplaySelect(false)}}>
                    Create Project
                </button>
                <button className="create-proj-btn" onClick={refreshPage}>
                    Refresh
                </button>
                <div className="create-proj-div-two" style={displayCreate ? { display: 'flex', marginTop: '10px' } : { display: 'none' }}>
                    <input id="projectID" className="proj-input" placeholder="Project Name"></input>
                    <input id="userList" className="proj-input" placeholder="Authorized Users"></input>
                    <div>
                        <p>No spaces in projectID and users list</p>
                        <p>Enter list of users separated by commas</p>
                    </div>
                </div>
                <div className="create-proj-btn" style={displayCreate ? { display: 'flex' } : { display: 'none' }}>
                    <button className="cancel-create-proj" onClick={() => { createProject(); changeDisplaySelect(false); changeDisplayCreate(false) }}>Create</button>
                    <text>|</text>
                    <button className="cancel-create-proj" onClick={() => { changeDisplaySelect(false); changeDisplayCreate(false) }}>Cancel</button>
                </div>
            </div>
            <div className="select-project" style={displaySelect ? { display: 'flex', padding: "10px" } : { display: 'none' }}>
                {state.data.map((i) => {
                    return i.pid !== "DoNotDelete" ? <button className="select-proj-button" onClick={() => handleSelectProject(i)}><SelectProj name={i.pid} userID={userID} users={i.users} /></button> : null
                })}
                <button className="create-proj-btn" style={{ marginTop: "20px" }} onClick={() => showAllProjects()}>Show All Projects</button>
            </div>

            <div className="projcover">
                {state.data.map((i) => {
                    return i.pid !== "DoNotDelete" && i.display === true ? <SingleProject name={i.pid} userID={userID} users={i.users} HW1num={i.hwset1num} HW1den={i.hwset1den} HW2num={i.hwset2num} HW2den={i.hwset2den} /> : null
                })}
            </div>
        </div>
    )
}

export default Projects