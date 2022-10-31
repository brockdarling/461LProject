import React, { useState } from "react";
import "./hwset.css"
// import Button from '@mui/material/Button';
import { Form, FormGroup, Label, Input, FormText } from "reactstrap";




class HWSet extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            name: props.name,
            users: props.users,
            HW1num: props.HW1num,
            HW1den: props.HW1den,
            HW2num: props.HW2num,
            HW2den: props.HW2den,
            joinButton: 'Join'
        }
    }
    render() {
        return (
            <div className="hwsetinfo">
                <div className="hwsetbox">
                    <h4>HWSet1: {this.state.HW1num}/{this.state.HW1den}</h4>
                    <h4>HWSet2: {this.state.HW2num}/{this.state.HW2den}</h4>
                </div>
                <div className="statusgrid">
                    <div className="statusrow">
                        <input
                            className="hw-input" 
                            type="text"
                            placeholder="Enter Qty"
                            id="hw1qty"
                        />
                        <button onClick={() => {
                            var qty = document.getElementById("hw1qty").value
                            this.handleCheckIn(1, qty, this.state.HW1den)
                        }} variant="text">Check In</button>
                        <button onClick={() => {
                            var qty = document.getElementById("hw1qty").value
                            this.handleCheckOut(1, qty, this.state.HW2den)
                        }} variant="text">Check Out</button>
                    </div>
                    <div className="statusrow">
                        <input 
                            className="hw-input"
                            type="text"
                            placeholder="Enter Qty"
                            id="hw2qty"
                        />
                        <button onClick={() => {
                            var qty = document.getElementById("hw2qty").value
                            this.handleCheckIn(2, qty, this.state.HW2den)
                        }} variant="text">Check In</button>
                        <button onClick={() => {
                            var qty = document.getElementById("hw2qty").value
                            this.handleCheckOut(2, qty, this.state.HW2den)
                        }} variant="text">Check Out</button>
                    </div>
                </div>
                <div>
                    <button className = "leave-join-btn" onClick={() => {
                        this.handleJoinLeave(
                        )
                    }} variant="text">{this.state.joinButton}</button>
                </div>
            </div>
        );
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
                    if(hwset == 1){
                        //+ what is this plus?
                        alert(this.state.HW1num)
                        this.state.HW1num.setState({HW1num : qty})
                        alert(this.state.HW1num)
                    }
                    else{
                        this.state.HW2num.setState(this.state.HW2num - quantity)
                    }
                    
                    alert(quantity + " hardware checked in from HWSet" + hwsetval)
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
                    alert(quantity + " hardware checked out from HWSet" + hwsetval)
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