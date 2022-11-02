import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import "./projects.css"
import SingleProject from "./singleProject";

function Projects() {
    const location = useLocation();
    const username = location.state.user;

    const [state, setState] = useState({
        data: []
    });

    useEffect(() => {
        fetch('/allprojects', {methods: 'GET'})
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
        <div className="projcover">
            <h1>Projects</h1>
            {state.data.map((i) => {
                return <SingleProject name={i.pid} username={username} users={i.users} HW1num={i.hwset1num} HW1den={i.hwset1den} HW2num={i.hwset2num} HW2den={i.hwset2den} />
            })}
        </div>
    )
}

export default Projects