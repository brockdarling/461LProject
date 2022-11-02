import React, { useState } from "react";
import "./projects.css"
import SingleProject from "./singleProject";

const nametemp = "Project 1"
const userstemp = "Tyler"
const HW1numtemp = 10
const HW1dentemp = 50
const HW2numtemp = 5
const HW2dentemp = 15


class Projects extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: nametemp,
            users: userstemp,
            HW1num: HW1numtemp,
            HW1den: HW1dentemp,
            HW2num: HW2numtemp,
            HW2den: HW2dentemp,
            createProj: false,
            projects: SingleProject[{}]
        };
        // [todos, setTodos] = useState([]);
    }

    // getAllProjects() {
    //     fetch('/allprojects', {methods: 'GET'})
    //     .then(response => {
    //         return response.json();
    //     })
    //     .then((data) =>
    //         this.setState({
    //             items: data.map(item => ({
    //                 projectid: item.projectID,
    //                 users: item.users,
    //                 hwsets: item.HWSet
    //             }))
    //         })
    //     )
    // }

    // renderProjects() {
    //     return this.state.items.map(item => {
    //         <SingleProject name={item.projectid} users={item.users} HW1num={item.hwsets[0]} HW1den={item.hwsets[2]} HW2num={item.hwsets[1]} HW2den={item.hwsets[3]} />
    //     })    
    // }

    render() {
        // {this.getAllProjects()}
        return (
            <div>
                <div className="create-proj-div">
                    <div className="proj-name-div" style={{display:this.state.createProj  ? 'block' : 'none' }}>
                        {/* <text>
                            Project Name:
                        </text> */}
                        <input className="proj-input" type="text"
                            placeholder="Enter Name">
                        </input>
                    </div>
                    <button className="create-proj-btn" onClick={() => {
                        this.handleCreateProj(this.state.createProj
                        )
                    }}>
                        Create Project
                    </button>
                </div>
                <div className="projcover">
                    {/* <h1>Projects</h1> */}
                    {/* {this.renderProjects()} */}

                    {this.state.projects}
                    <SingleProject name={"ProjectTest"} users={this.state.users} HW1num={this.state.HW1num} HW1den={this.state.HW1den} HW2num={this.state.HW2num} HW2den={this.state.HW2den} />
                    <SingleProject name={this.state.name} users={this.state.users} HW1num={this.state.HW1num} HW1den={this.state.HW1den} HW2num={this.state.HW2num} HW2den={this.state.HW2den} />
                    {/* <SingleProject name={"ProjectTest"} users={this.state.users} HW1num={this.state.HW1num} HW1den={this.state.HW1den} HW2num={this.state.HW2num} HW2den={this.state.HW2den} />
                <SingleProject name={"ProjectTest"} users={this.state.users} HW1num={this.state.HW1num} HW1den={this.state.HW1den} HW2num={this.state.HW2num} HW2den={this.state.HW2den} />
                <SingleProject name={"ProjectTest"} users={this.state.users} HW1num={this.state.HW1num} HW1den={this.state.HW1den} HW2num={this.state.HW2num} HW2den={this.state.HW2den} /> */}

                </div>
            </div >
        )
    }

    handleCreateProj(createProj) {
        if (createProj === false) {
            this.setState({createProj: true})
        } else {
            this.setState({ createProj: false})
            this.addNewProject()
        }
    }
    addNewProject(){
        this.setState({projects: ([{SingleProject}, ...this.state.projects])})
    }
}

export default Projects