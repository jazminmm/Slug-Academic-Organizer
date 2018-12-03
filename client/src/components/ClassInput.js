import React, { Component } from "react";
import "../styles/ClassInput.css";
import { Alert } from "reactstrap";

class ClassInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: "", // Server response
      class: "", // Class value from form
      quarter: 1, // 1: fall, 3: winter, 2: spring, 0: summer
      year: "",
      classError: "",
      yearError: "",
      grade: 0,
      units: 0
    };

    this.changeClass = this.changeClass.bind(this);
    this.changeQuarter = this.changeQuarter.bind(this);
    this.changeYear = this.changeYear.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeGrade = this.changeGrade.bind(this);
    this.changeUnits = this.changeUnits.bind(this);
  }

  // User enters class value
  changeClass(event) {
    this.setState({ class: event.target.value.trim() });
  }

  // User changes quarter form
  changeQuarter(event) {
    this.setState({ quarter: parseInt(event.target.value) });
  }

  // User enters a year
  changeYear(event) {
    this.setState({ year: parseInt(event.target.value) });
  }

  // User enters grade
  changeGrade(event) {
    this.setState({ grade: parseInt(event.target.value) });
  }

  //User enters Units
  changeUnits(event) {
    this.setState({ units: parseInt(event.target.value) });
  }


  // Form submission->post request to server
  handleSubmit(event) {
    const newClass = {
      class: this.state.class,
      quarter: this.state.quarter,
      year: this.state.year,
      grade: this.state.grade,
      units: this.state.units
    };
    if (this.validate(newClass)) {
      this.submitClass({
        class: this.state.class,
        userID: this.props.userID,
        quarter: this.state.quarter,
        year: this.state.year,
        grade: this.state.grade,
        units: this.state.units
      }) // Send all form data to server
        .then(res => {
          // Reset the state
          this.setState({
            response: res.express,
            class: "",
            quarter: 1,
            year: "",
            yearError: "",
            classError: "",
            grade: 0,
            units: 0
          });
          this.props.onSubmit(
            newClass.class,
            res._id,
            newClass.quarter,
            newClass.year,
            newClass.grade,
            newClass.units
          ); // Get classLogging to update
        })
        .catch(err => console.log(err));
    }
    event.preventDefault(); // Prevent default page reload
  }

  // Validate the form before posting
  validate = form => {
    var bool = true;
    if (form.class.length === 0) {
      bool = false;
      this.setState({ classError: "CourseID can't be empty" });
    }
    if (form.year.length === 0) {
      bool = false;
      this.setState({ yearError: "Year can't be empty" });
    }
    if (form.class.length !== 0) {
      this.setState({ classError: "" });
    }
    if (form.year.length !== 0) {
      this.setState({ yearError: "" });
    }
    return bool;
  };

  // Make post call to server to submit form data
  submitClass = async data => {
    const response = await fetch("/api/submitClass", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        class: data.class,
        userID: data.userID,
        quarter: data.quarter,
        year: data.year,
        grade: data.grade,
        units: data.units
      })
    });

    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="classInput">
        <header className="classInput-header">
          <div className="input">
            <form id="classform" onSubmit={this.handleSubmit}>
              <div className="classInfo">
                <div className="title">
                  <b>Class</b>
                </div>
                <div className="class">
                  <input
                    type="text"
                    value={this.state.class}
                    onChange={this.changeClass}
                    placeholder="Course ID"
                  />
                </div>
                <div className="quarter">
                  <select value={this.state.quarter} onChange={this.changeQuarter} className="quarter">
                    <option value="0">Fall</option>
                    <option value="3">Winter</option>
                    <option value="2">Spring</option>
                    <option value="1">Summer</option>
                  </select>
                  <div className="year">
                    <input
                      type="number"
                      value={this.state.year}
                      onChange={this.changeYear}
                      placeholder="Year"
                    />
                  </div>
                </div>
                <div className="grade">
                  <select
                    value={this.state.grade}
                    onChange={this.changeGrade}
                    className="grade"
                    >
                    <option value="0">A+</option>
                    <option value="1">A</option>
                    <option value="2">A-</option>
                    <option value="3">B+</option>
                    <option value="4">B</option>
                    <option value="5">B-</option>
                    <option value="6">C+</option>
                    <option value="7">C</option>
                    <option value="8">C-</option>
                    <option value="9">D+</option>
                    <option value="10">D</option>
                    <option value="11">D-</option>
                    <option value="12">F</option>
                    <option value="13">W</option>
                    <option value="14">Not Completed</option>
                    <option value="15">Pass</option>
                    <option value="16">No Pass</option>
                  </select>
                </div>

                <div className="units">
                  <select
                    value={this.state.units}
                    onChange={this.changeUnits}
                    className="units"
                    >
                    <option value="0">5 units</option>
                    <option value="1">2 units</option>
                    <option value="2">0 units</option>
                  </select>
                </div>
              </div>
              <div className="submit">
                <input type="submit" className="submit" value="Submit" />
              </div>
            </form>
            <div className="errors">
              {this.state.classError.length !== 0 && (
                <Alert color="warning">
                  <b>
                    {this.state.classError} <br />
                  </b>
                </Alert>
              )}
              {this.state.yearError.length !== 0 && (
                <Alert color="warning">
                  <b>{this.state.yearError}</b>
                </Alert>
              )}
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default ClassInput;
