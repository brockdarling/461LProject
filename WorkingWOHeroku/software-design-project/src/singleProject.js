import React, { useState } from "react";
import "./singleProject.css"
import HWSet from "./hwset";
// import Button from '@mui/material/Button';


class SingleProject extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            name: props.name,
            users: props.users,
            HW1num: props.HW1num,
            HW1den: props.HW1den,
            HW2num: props.HW2num,
            HW2den: props.HW2den
        };
    }

    render(){
        return (
            <div className="projectbox">
                <h2>{this.state.name}</h2>
                <text style={{color: "#423e3e"}}>{"Users: "}{this.state.users}</text>
                <HWSet name = {this.state.name} HW1num={this.state.HW1num} HW1den={this.state.HW1den} HW2num={this.state.HW2num} HW2den={this.state.HW2den}></HWSet>
            </div>
        )
    }
}

export default SingleProject
