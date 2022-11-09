import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import "./projects.css"
import SingleProject from "./singleProject";
import SelectProj from "./selectProj";

function Projects() {
    const location = useLocation();
    const userID = location.state.user;

    const [state, setState] = useState({
        data: []
    });

    const [userProj, setUserProj] = useState({
        userPj: 'testagain'
    });

    const [displayCreate, changeDisplayCreate] = useState(false);

    const [displaySelect, changeDisplaySelect] = useState(true);

    function handleSelectProject(i) {
        state.data.map((j) => {
            j.display = false;
        });
        i.display = true;
        changeDisplaySelect(false);
        forceUpdate();
    }

    function showAllProjects() {
        getUsersAndProject();
        getAllProjects();
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
        if (userList !== "" && !userList.contains(userID)) userList = userID+','+userList;
        var users = userList.split(',');
        if (projectID !== "" && userList !== ""){
            var requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({userList: users})
            };
            const response = await fetch('/createProject/'+projectID+'/'+userID, requestOptions);
            const result = await response.text(); 
            alert(result);
        } else if (projectID !== "" && userList === "") {
            var requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({userList: "all"})
            };
            const response = await fetch('/createProject/'+projectID+'/'+userID, requestOptions); 
            const result = await response.text();
            alert(result);
        }
        showAllProjects();
    }

    let forceUpdate = useForceUpdate();

    async function getUsersAndProject() {
        const response = await fetch('/getUsersProjects', { methods: 'GET' });
        const result = await response.json();
        var i = 0;
        for (i = 0; i < result.length; i++) {
            if (result[i].uid === userID) {
                setUserProj({                
                    userPj: (Object.keys(result[i].projects))
                });
            }
        }
    }

    async function getAllProjects() {
        const response = await fetch('/allprojects', { methods: 'GET' })
        const result = await response.json();
        setState({
            data: result.map(item => ({
                pid: item.projectID,
                users: JSON.stringify(item.users).replaceAll('[', '').replaceAll(']', '').replaceAll('"', '').replaceAll(',', ', '),
                hwset1num: item.HWSet[0],
                hwset1den: item.HWSet[2],
                hwset2num: item.HWSet[1],
                hwset2den: item.HWSet[3],
                creator: item.creator,
                display: true
            }))
        });
    }

    useEffect(() => {
        if (displaySelect) {
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
                        creator: item.creator,
                        display: true
                    })),
                })
            });
        }
    }, [displaySelect])

    useEffect(() => {
        if (displaySelect) {
            fetch('/getUsersProjects', { methods: 'GET' })
                .then(response => {
                    return response.json();
                })
                .then((jsonData) => {
                    var i = 0;
                    for (i = 0; i < jsonData.length; i++) {
                        if (jsonData[i].uid === userID) {
                            // console.log(jsonData[i].uid + ": " + userID + ": " + Object.keys(jsonData[i].projects)[0]);
                            setUserProj({                
                                userPj: (Object.keys(jsonData[i].projects)[0])
                            });
                        }
                    }
                })
        }
    }, [displaySelect, userID])

    return (
        <div>
            <div className="create-proj-div">
                <button className="create-proj-btn" style={displayCreate ? { display: 'none' } : { display: 'flex' }} onClick={() => { getUsersAndProject(); getAllProjects(); changeDisplaySelect(!displaySelect); }}>
                    Select Project
                </button>
                <button className="create-proj-btn" style={displayCreate ? {display: 'none'} : {display : 'flex'}} onClick={() => {/* GOOD LUCK ARJUN!*/ changeDisplaySelect(false);}}>
                    My Projects
                </button>
                <button className="create-proj-btn" style={displayCreate ? { display: 'none' } : { display: 'flex' }} onClick={() => { changeDisplayCreate(!displayCreate); changeDisplaySelect(false) }}>
                    Create Project
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
                {!displaySelect ? state.data.map((i) => {
                    return i.pid !== "DoNotDelete" && i.display === true ? 
                                (i.pid === userProj.userPj ?
                                    <SingleProject name={i.pid} userID={userID} users={i.users} HW1num={i.hwset1num} HW1den={i.hwset1den} HW2num={i.hwset2num} HW2den={i.hwset2den} joinState={'Leave'} />
                                    : <SingleProject name={i.pid} userID={userID} users={i.users} HW1num={i.hwset1num} HW1den={i.hwset1den} HW2num={i.hwset2num} HW2den={i.hwset2den} joinState={'Join'} />)
                                : null
                }) : ""}
            </div>
        </div>
    )
}

export default Projects