import React, { useState } from "react";
import "./selectProj.css"

class SelectProj extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: props.name,
            userID: props.userID,
            users: props.users,
        };
    }

    render() {
        return (
            <div className="select-proj-div">
                <h3 style={{ width: "30%", textAlign: "left" }}>
                    {this.state.name}
                </h3>
                <h4 style={{ width: "60%", textAlign: "right" }}>
                    {this.state.users}
                </h4>
            </div>


        )
    }
}

export default SelectProj
