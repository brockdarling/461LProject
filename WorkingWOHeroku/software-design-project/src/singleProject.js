import React from "react";
import "./singleProject.css"
import HWSet from "./hwset";

class SingleProject extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: props.project.pid,
            users: props.project.users,
            HW1num: props.project.hwset1num,
            HW1den: props.project.hwset1den,
            HW2num: props.project.hwset2num,
            HW2den: props.project.hwset2den,
            viewSingle: props.view,
            updateDisp: props.updateDisp,
            refreshProject: props.refreshProject,
            userID: props.userID,
            joinState: props.joinState
        };
    }
    render() {
        console.log("Reload" + this.state.HW1num)
        return (
            <div className="projectbox">
                <h2 style={{ paddingLeft: '40px', width: '16%', overflow: "hidden" }}>
                    {this.state.name}
                </h2>

                <div style={{ color: "#423e3e", width: '15%' }}>{"Users: "}
                    {this.state.users}
                </div>

                <HWSet 
                    name={this.state.name} 
                    HW1num={this.state.HW1num} 
                    HW1den={this.state.HW1den} 
                    HW2num={this.state.HW2num} 
                    HW2den={this.state.HW2den} 
                    view={this.state.viewSingle} 
                    updateDisp={this.state.updateDisp} 
                    refreshProject={this.state.refreshProject} 
                    userID={this.state.userID} 
                    joinState={this.state.joinState} />
            </div>
        )
    }
}

export default SingleProject
