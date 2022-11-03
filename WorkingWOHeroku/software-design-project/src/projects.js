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

    const [displayCreate, changeDisplayCreate] = useState(true);

    const [displaySelect, changeDisplaySelect] = useState(true);


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
                        hwset2den: item.HWSet[3]
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
                <button className="create-proj-btn" onClick={() => { changeDisplayCreate(!displayCreate); changeDisplaySelect(false) }}>
                    Create Project
                </button>
                <div className="create-proj-div-two" style={displayCreate ? { display: 'flex', marginTop: '10px' } : { display: 'none' }}>
                    <input className="proj-input" placeholder="Project Name">
                    </input>
                    <input className="proj-input" placeholder="Authorized Users">

                    </input>
                </div>
            </div>

            <div className="select-project" style={displaySelect ? { display: 'flex', padding: "10px" } : { display: 'none' }}>
                {state.data.map((i) => {
                    return i.pid !== "DoNotDelete" ?  <SelectProj name={i.pid} userID={userID} users={i.users}/> : null
                    // return i.pid !== "DoNotDelete" ? <SingleProject name={i.pid} userID={userID} users={i.users} HW1num={i.hwset1num} HW1den={i.hwset1den} HW2num={i.hwset2num} HW2den={i.hwset2den} /> : null
                })}
            </div>

            <div className="projcover">


                {/* <h1>Projects</h1> */}
                {state.data.map((i) => {
                    return i.pid !== "DoNotDelete" ? <SingleProject name={i.pid} userID={userID} users={i.users} HW1num={i.hwset1num} HW1den={i.hwset1den} HW2num={i.hwset2num} HW2den={i.hwset2den} /> : null
                })}
            </div>

        </div>


    )
}

export default Projects