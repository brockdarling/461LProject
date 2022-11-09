import React from "react";
import "./hwset.css"

class HWSet extends React.Component {

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
            joinButton: props.joinState,
            hw1Input: 0,
            hw2Input: 0,
            refreshProject: props.refreshProject
        }
    }
    render() {
        return (
            <div className="hwsetinfo">
                <div className="hwsetbox">
                    <h4 style={{ width: '200px' }}>HWSet1: {this.state.HW1num}/{this.state.HW1den}</h4>
                    <h4 style={{ width: '200px' }}>HWSet2: {this.state.HW2num}/{this.state.HW2den}</h4>
                </div>
                <div className="statusgrid">
                    <div className="statusrow">
                        <input onChange={this.handleHW1Input}
                            className="hw-input"
                            type="text"
                            placeholder="Enter Qty"
                        />

                        <button className="checkinbtn" onClick={() => {
                            var qty = this.state.hw1Input;
                            this.handleCheckIn(1, qty)
                        }} variant="text">Check In</button>
                        <button style={{ borderLeft: '0px' }} className="checkinbtn" onClick={() => {
                            var qty = this.state.hw1Input;
                            this.handleCheckOut(1, qty)
                        }} variant="text">Check Out</button>
                    </div>
                    <div className="statusrow">
                        <input onChange={this.handleHW2Input}
                            className="hw-input"
                            type="text"
                            placeholder="Enter Qty"
                        />
                        <button className="checkinbtn" onClick={() => {
                            var qty = this.state.hw2Input;
                            this.handleCheckIn(2, qty);
                        }} variant="text">Check In</button>
                        <button style={{ borderLeft: '0px' }} className="checkinbtn" onClick={() => {
                            var qty = this.state.hw2Input;
                            this.handleCheckOut(2, qty);
                        }} variant="text">Check Out</button>
                    </div>
                </div>
                <div style={{ width: '10%' }}>
                    <button className="leave-join-btn" onClick={() => {
                        this.handleJoinLeave()
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


    async handleCheckIn(hwset, qty) {
        if (qty !== 0 && qty !== "") {
            const response = await fetch('/checkIn/' + this.state.name + '/' + hwset + '/' + qty + '/' + this.state.userID);
            const resultText = await response.text();
            if (resultText === "") {
                alert("Some error occurred");
            } else if (resultText === "Must join project in order to checkin hardware"){
                alert(resultText);
            } else {
                const result = JSON.parse(resultText);
                var hwsetval = result["hwset"]
                var quantity = result["qty"]
                var setsCheckedIn = result["setsCheckedIn"]
                if (hwset === 1) {
                    this.setState({ HW1num: quantity });
                }
                else {
                    this.setState({ HW2num: quantity });
                }
                if (setsCheckedIn === 0) {
                    alert("No Sets Checked In");
                }
                else {
                    alert(setsCheckedIn + " hardware checked in from HWSet" + hwsetval)
                }
                this.state.refreshProject();
            }
        }
    }

    async handleCheckOut(hwset, qty) {
        if (qty !== 0 && qty !== "") {
            const response = await fetch('/checkOut/' + this.state.name + '/' + hwset + '/' + qty + '/' + this.state.userID);
            const resultText = await response.text();
            if (resultText === "") {
                alert("Some error occurred");
            } else if (resultText === "Must join project in order to checkout hardware"){
                alert(resultText);
            } else {
                const result = JSON.parse(resultText);
                var hwsetval = result["hwset"]
                var quantity = result["qty"]
                var setsCheckedOut = result["setsCheckedOut"]
                if (hwset === 1) {
                    this.setState({ HW1num: quantity });
                }
                else {
                    this.setState({ HW2num: quantity });
                }
                if (setsCheckedOut === 0) {
                    alert("No Sets Checked Out");
                }
                else {
                    alert(setsCheckedOut + " hardware checked out from HWSet" + hwsetval)
                }
                this.state.refreshProject();
            }
        }
    }

    async handleJoinLeave() {
        if (this.state.joinButton === 'Join') {
            const response = await fetch('/joinProject/' + this.state.name + '/' + this.state.userID);
            const result = await response.text();
            if (result === null) {
                alert("Some error occurred");
            } else if (result.includes("Cannot join")) {
                alert(result);
            } else {
                alert(result);
                this.setState({ joinButton: 'Leave' })
            }
        } else {
            const response = await fetch('/leaveProject/' + this.state.name + '/' + this.state.userID);
            const result = await response.text();
            if (result === null) {
                alert("Some error occurred");
            } else if (result === "") {
                alert("Cannot leave project without checking in remaining hardware");
            } else {
                alert("Left " + result);
                this.setState({ joinButton: 'Join' });
            }
        }
    }
}

export default HWSet