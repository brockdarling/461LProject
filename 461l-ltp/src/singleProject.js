import React, { useState } from "react";
import "./singleProject.css"
import HWSet from "./hwset";

class SingleProject extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: props.name,
            userID: props.userID,
            users: props.users,
            HW1num: props.HW1num,
            HW1den: props.HW1den,
            HW2num: props.HW2num,
            HW2den: props.HW2den,
            joinState: props.joinState
        };
    }
    render() {
        // console.log(this.state.name + ": " + this.state.joinState);
        return (
            <div className="projectbox">
                <h2 style={{ paddingLeft: '40px', width: '16%', overflow: "hidden" }}>{this.state.name}</h2>
                <div style={{ color: "#423e3e", width: '15%' }}>{"Users: "}{this.state.users}</div>
                <HWSet name={this.state.name} userID={this.state.userID} HW1num={this.state.HW1num} HW1den={this.state.HW1den} HW2num={this.state.HW2num} HW2den={this.state.HW2den} joinState={this.state.joinState}></HWSet>
            </div>
        )
    }
}

export default SingleProject
