import React, { Component } from 'react';
import PNPProgress from "./PNPProgress";
import GPACalculator from "./GPACalculator";
import "../styles/Grades.css";

class Grades extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return(
            <div className="gradeContainer">
                <div className="gpaComponent">
                    <GPACalculator />
                </div>
                <div className="pnpComponent">
                    <PNPProgress />
                </div>
            </div>
        )
    }
}

export default Grades