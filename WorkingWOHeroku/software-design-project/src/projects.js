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
        userPj: ''
    });

    // const [userToProj, addUserToProj] = useState({
    //     userToPj: 'testt'
    // });

    const [displayCreate, changeDisplayCreate] = useState(false);

    const [displaySelect, changeDisplaySelect] = useState(true);

    const [creatorProj, showCreatorProj] = useState(false);

    const [displayPopup, changePopupDisplay] = useState(false);

    const [displayAddUsers, changeDisplayAddUsers] = useState(false);

    const [displayAddUsersBtn, changeDisplayAddUsersBtn] = useState(true);
    
    const [viewSingle, updateViewSingle] = useState("");

    async function createProject() {
        var projectID = document.getElementById("projectID").value.replaceAll(' ', '');
        var userList = document.getElementById("userList").value.replaceAll(' ', '');
        console.log(userList);
        if (userList !== "" && !userList.includes(userID)) userList = userID+','+userList;
        var users = userList.split(',');
        users = Array.from(new Set(users));
        if (projectID !== "" && userList !== "") {
            var requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userList: users })
            };
            const response = await fetch('/createProject/' + projectID + '/' + userID, requestOptions);
            const result = await response.text();
            alert(result);
        } else if (projectID !== "" && userList === "") {
            requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userList: "all" })
            };
            const response = await fetch('/createProject/' + projectID + '/' + userID, requestOptions);
            const result = await response.text();
            alert(result);
        }
        showAllProjects();
    }

    async function getUsersProjects() {
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

    async function addUserToProject() {
        var projectID = document.getElementById("projectToAddUsers").value.replaceAll(' ', '');
        var userList = document.getElementById("addUsers").value.replaceAll(' ', '');
        
        if (projectID !== "" && userList !== "") {
            var users = userList.split(',');
            var requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userList: users })
            };
            const response = await fetch('/addUserToProject/' + projectID + '/' + userID, requestOptions);
            const result = await response.text();
            alert(result);
        } else {
            alert("Neither fields can be empty");
        }
        showAllProjects();
    }

    async function getAllProjects() {
        const response = await fetch('/allprojects', { methods: 'GET' })
        const result = await response.json();
        setState({
            data: result.map(item => ({
                pid: item.projectID,
                users: JSON.stringify(item.users)
                            .replaceAll('[', '')
                            .replaceAll(']', '')
                            .replaceAll('"', '')
                            .replaceAll(',', ', '),
                hwset1num: item.HWSet[0],
                hwset1den: item.HWSet[2],
                hwset2num: item.HWSet[1],
                hwset2den: item.HWSet[3],
                creator: item.creator,
                display: true
            }))
        });
    }

    function useForceUpdate() {
        let [value, setState] = useState(true);
        return () => setState(!value);
    }

    let forceUpdate = useForceUpdate();

    function handleSelectProject(i) {
        state.data.map((j) => {
            return j.display = false;
        });
        i.display = true;
        updateViewSingle(i.pid);
        changeDisplaySelect(false);
        forceUpdate();
    }

    function showAllProjects() {
        getUsersProjects();
        getAllProjects();
        state.data.map((j) => {
            return j.display = true;
        });
        updateViewSingle("");
        changeDisplaySelect(false);
        forceUpdate();
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
                            users: JSON.stringify(item.users)
                                        .replaceAll('[', '')
                                        .replaceAll(']', '')
                                        .replaceAll('"', '')
                                        .replaceAll(',', ', '),
                            hwset1num: item.HWSet[0],
                            hwset1den: item.HWSet[2],
                            hwset2num: item.HWSet[1],
                            hwset2den: item.HWSet[3],
                            creator: item.creator,
                            // display: true
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
                <button className="create-proj-btn" style={displayCreate ? { display: 'none' } : { display: 'flex' }} 
                    onClick={() => { 
                        getUsersProjects(); 
                        getAllProjects(); 
                        showCreatorProj(false); 
                        changeDisplaySelect(!displaySelect); 
                        changeDisplayAddUsersBtn(true) }}>
                    Select Project
                </button>
                <button className="create-proj-btn" style={displayCreate ? { display: 'none' } : { display: 'flex' }} 
                    onClick={() => { 
                        getAllProjects(); 
                        showCreatorProj(true); 
                        changeDisplaySelect(false); 
                        changeDisplayAddUsersBtn(false) }}>
                    My Projects
                </button>
                <button className="create-proj-btn" style={displayCreate ? { display: 'none' } : { display: 'flex' }} 
                    onClick={() => { 
                        showCreatorProj(false); 
                        changeDisplayCreate(!displayCreate); 
                        changeDisplaySelect(false); 
                        changeDisplayAddUsers(false); 
                        changeDisplayAddUsersBtn(true) }}>
                    Create Project
                </button>


                <div className="create-proj-div-two" style={displayCreate ? { display: 'flex', marginTop: '10px' } : { display: 'none' }}>
                    <div onMouseEnter={() => { changePopupDisplay(true); }} onMouseLeave={() => { changePopupDisplay(false); }}>
                        <input id="projectID" className="proj-input" placeholder="Project Name"></input>
                    </div>
                    <div onMouseEnter={() => { changePopupDisplay(true); }} onMouseLeave={() => { changePopupDisplay(false); }}>
                        <input id="userList" className="proj-input" placeholder="Authorized Users"></input>
                    </div>

                    <div className="create-proj-popup" style={displayPopup ? { display: 'block' } : { display: 'none' }}>
                        <p>No spaces in projectID and users list</p>
                        <p>Enter list of users separated by commas</p>
                    </div>
                </div>


                <div className="create-proj-btn" style={displayCreate ? { display: 'flex' } : { display: 'none' }}>
                    <button className="cancel-create-proj" 
                        onClick={() => { 
                            createProject(); 
                            changeDisplaySelect(false); 
                            changeDisplayCreate(false); }}>
                        Create
                    </button>
                    |
                    <button className="cancel-create-proj" 
                        onClick={() => { 
                            changeDisplaySelect(false); 
                            changeDisplayCreate(false); }}>
                        Cancel
                    </button>
                </div>
            </div>


            <div className="addUsers-div">
                <button className="addUsers-proj-btn" style={displayAddUsersBtn ? { display: 'none' } : { display: 'flex' }} 
                    onClick={() => { 
                        changeDisplayAddUsersBtn(!displayAddUsersBtn); 
                        changeDisplayAddUsers(true); 
                        changeDisplayCreate(false); }}>
                    Add User To Existing Project
                </button>


                <div className="addUsers-proj-div-two" style={displayAddUsers ? { display: 'flex', marginTop: '11px', marginRight: '-35px' } : { display: 'none' }}>
                    <input id="projectToAddUsers" className="proj-input" placeholder="Project Name" />
                </div>


                <div className="addUsers-proj-div-two" style={displayAddUsers ? { display: 'flex', marginTop: '10px', marginLeft: '20px' } : { display: 'none' }}>
                    <input id="addUsers" className="proj-input" placeholder="Add Authorized User" />
                </div>


                <div className="addUsers-proj-btn" style={displayAddUsers ? { display: 'flex', marginTop: '4.3px' } : { display: 'none' }}>
                    <button className="cancel-addUserTo-proj" 
                        onClick={() => { 
                            /*addUserToProject();*/ 
                            changeDisplaySelect(false); 
                            changeDisplayAddUsers(false); 
                            changeDisplayAddUsersBtn(false); }}>
                        Add User
                    </button>
                    |
                    <button className="cancel-addUserTo-proj" 
                        onClick={() => { 
                            changeDisplaySelect(false); 
                            changeDisplayAddUsers(false); 
                            changeDisplayAddUsersBtn(false); }}>
                        Cancel
                    </button>
                </div>
            </div>


            <div className="select-project" style={displaySelect ? { display: 'flex', padding: "10px" } : { display: 'none' }}>
                {state.data.map((i) => {
                    return i.pid !== "DoNotDelete" ? <button className="select-proj-button" onClick={() => handleSelectProject(i)}><SelectProj name={i.pid} userID={userID} users={i.users} /></button> : null
                })}
                

                <button className="create-proj-btn" style={{ marginTop: "20px" }} onClick={() => showAllProjects()}>
                    Show All Projects
                </button>
            </div>


            <div className="projcover">
                {!displaySelect && !creatorProj ? 
                    state.data.map((i) => {
                        return i.pid !== "DoNotDelete" && i.display === true ?
                            (i.pid === userProj.userPj ?
                                <SingleProject 
                                    project={i}
                                    view={viewSingle} 
                                    updateDisp={changeDisplaySelect} 
                                    refreshProject={getAllProjects}  
                                    userID={userID} 
                                    joinState={'Leave'} />
                                : 
                                <SingleProject 
                                    project={i}
                                    view={viewSingle} 
                                    updateDisp={changeDisplaySelect} 
                                    refreshProject={getAllProjects} 
                                    userID={userID} 
                                    joinState={'Join'} />
                            )
                        : null
                    }) 
                : 
                (!displaySelect && creatorProj ? 
                    state.data.map((i) => {
                        return i.pid !== "DoNotDelete" && i.display === true ?
                            (i.pid === userProj.userPj ?
                                (i.creator === userID ? 
                                    <SingleProject 
                                        project={i}
                                        view={viewSingle} 
                                        updateDisp={changeDisplaySelect} 
                                        refreshProject={getAllProjects}
                                        userID={userID}
                                        joinState={'Leave'} /> 
                                : null)
                            : 
                                (i.creator === userID ? 
                                    <SingleProject 
                                        project={i}
                                        view={viewSingle} 
                                        updateDisp={changeDisplaySelect} 
                                        refreshProject={getAllProjects} 
                                        userID={userID} 
                                        joinState={'Join'} /> 
                                : null)
                            )
                            : null
                    }) : null
                )}
            </div>
        </div>
    )
}

export default Projects