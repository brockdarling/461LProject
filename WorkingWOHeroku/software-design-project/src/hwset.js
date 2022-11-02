import React, { useState, useRef } from "react";
import "./hwset.css"

class HWSet extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: props.name,
            username: props.username,
            users: props.users,
            HW1num: props.HW1num,
            HW1den: props.HW1den,
            HW2num: props.HW2num,
            HW2den: props.HW2den,
            joinButton: 'Join',
            hw1Input: 0,
            hw2Input: 0
        }
        console.log(this.state.username);   
    }
    render() {
        return (
            <div className="hwsetinfo">
                <div className="hwsetbox">
                    <h4 style={{ width: '200px'}}>HWSet1: {this.state.HW1num}/{this.state.HW1den}</h4>
                    <h4 style={{ width: '200px'}}>HWSet2: {this.state.HW2num}/{this.state.HW2den}</h4>
                </div>
                <div className="statusgrid">
                    <div className="statusrow">
                        <input onChange={this.handleHW1Input}
                            className="hw-input"
                            type="text"
                            placeholder="Enter Qty"
                        />

                        <button onClick={() => {
                            var qty = this.state.hw1Input;
                            this.handleCheckIn(1, qty, this.state.HW1den)
                        }} variant="text">Check In</button>
                        <button onClick={() => {
                            var qty = this.state.hw1Input;
                            this.handleCheckOut(1, qty, this.state.HW1den)
                        }} variant="text">Check Out</button>
                    </div>
                    <div className="statusrow">
                        <input onChange={this.handleHW2Input}
                            className="hw-input"
                            type="text"
                            placeholder="Enter Qty"
                        />
                        <button onClick={() => {
                            var qty = this.state.hw2Input;
                            this.handleCheckIn(2, qty, this.state.HW2den)
                        }} variant="text">Check In</button>
                        <button onClick={() => {
                            var qty = this.state.hw2Input;
                            this.handleCheckOut(2, qty, this.state.HW2den)
                        }} variant="text">Check Out</button>
                    </div>
                </div>
                <div>
                    <button className="leave-join-btn" onClick={() => {
                        this.handleJoinLeave(
                        )
                    }} variant="text">{this.state.joinButton}</button>
                </div>
            </div>
        );
    }

    handleHW1Input = (event) => {
        this.setState({ hw1Input: event.target.value })
    }

    handleHW2Input = (even) => {
        this.setState({ hw2Input: even.target.value })
    }


    handleCheckIn(hwset, qty, maxQty) {
        fetch('/checkIn/' + this.state.name + '/' + hwset + '/' + qty + '/' + maxQty)
            .then((response) => {
                if (response.ok) {
                    try {
                        return response.json();
                    }
                    catch (e) {
                        console.log("Could not parse as text")
                    }
                }
            })
            .then((data) => {
                if (data == null) {
                    alert("Some error occurred");
                } else {
                    // var projid = data["projectid"]
                    var hwsetval = data["hwset"]
                    var quantity = data["qty"]
                    var setsCheckedIn = data["setsCheckedIn"]
                    if (hwset == 1) {
                        this.setState({ HW1num: quantity });
                    }
                    else {
                        this.setState({ HW2num: quantity });
                    }
                    if (setsCheckedIn == 0) {
                        alert("No Sets Checked In");
                    }
                    else {
                        alert(setsCheckedIn + " hardware checked in from HWSet" + hwsetval)
                    }
                }
            });

    }

    handleCheckOut(hwset, qty, maxQty) {

        fetch('/checkOut/' + this.state.name + '/' + hwset + '/' + qty + '/' + maxQty)
            .then((response) => {
                if (response.ok) {
                    try {
                        return response.json();
                    }
                    catch (e) {
                        console.log("Could not parse as text")
                    }
                }
            })
            .then((data) => {
                if (data == null) {
                    alert("Some error occurred");
                } else {
                    // var projid = data["projectid"]
                    var hwsetval = data["hwset"]
                    var quantity = data["qty"]
                    var setsCheckedOut = data["setsCheckedOut"]
                    if (hwset == 1) {
                        this.setState({ HW1num: quantity });
                    }
                    else {
                        this.setState({ HW2num: quantity });
                    }
                    if (setsCheckedOut == 0) {
                        alert("No Sets Checked Out");
                    }
                    else {
                        alert(setsCheckedOut + " hardware checked out from HWSet" + hwsetval)
                    }
                }
            });

    }

    handleJoinLeave() {

        if (this.state.joinButton === 'Join') {
            fetch('/joinProject/' + this.state.name + '/' + 'user1' + '/' + 'brok')
                .then((response) => {
                    if (response.ok) {
                        try {
                            return response.text();
                        }
                        catch (e) {
                            console.log("Could not parse as text")
                        }
                    }
                })
                .then((data) => {
                    if (data == null) {
                        alert("Some error occurred");
                    } else {
                        var projectid = data
                        alert("Joined " + projectid)
                    }
                });
            this.setState({ joinButton: 'Leave' })

        }
        else {
            fetch('/leaveProject/' + this.state.name + '/' + 'user1' + '/' + 'brok')
                .then((response) => {
                    if (response.ok) {
                        try {
                            return response.text();
                        }
                        catch (e) {
                            console.log("Could not parse as text")
                        }
                    }
                })
                .then((data) => {
                    if (data == null) {
                        alert("Some error occurred");
                    } else {
                        var projectid = data
                        alert("Left " + projectid)
                    }
                });
            this.setState({ joinButton: 'Join' })
        }
    }
}

export default HWSet