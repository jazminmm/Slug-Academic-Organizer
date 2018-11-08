import React, { Component } from "react";
import "../styles/ClassLogging.css";
import ClassInput from "./ClassInput";
import { getFromStorage } from "./storage";
import { Button, Table, Container, Row, Col } from "reactstrap";

class ClassLogging extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: "", //server response
      classes: {},
      isLoading: false,
      userID: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.delete = this.delete.bind(this);
  }

  // Send request to server to delete the class
  delete(_id, idx, quarter, year) {
    this.deletePost(_id)
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
    //remove the class from the state
    var newClasses = this.state.classes;
    newClasses[year][quarter].splice(idx, 1);
    const size =
      newClasses[year][0].length +
      newClasses[year][1].length +
      newClasses[year][2].length +
      newClasses[year][3].length;
    if (size === 0) {
      delete newClasses[year];
    }
    this.setState({ classes: newClasses });
  }

  // Called by ClassInput component when there's a submit, basically adds the new class to the state
  handleSubmit(newClass, _id, quarter, year) {
    var newClasses = this.state.classes;
    if (year in newClasses) {
      newClasses[year][quarter].push({ courseID: newClass, _id: _id });
    } else {
      newClasses[year] = [[], [], [], []];
      newClasses[year][quarter].push({ courseID: newClass, _id: _id });
    }
    this.setState({ classes: newClasses });
    console.log(newClasses);
  }

  // Makes get request to server after the component mounts
  componentDidMount() {
    // Stolen from Michael's code: verifies the token and gets the userID
    const obj = getFromStorage("the_main_app");
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch("/api/account/verify?token=" + token)
        .then(res => res.json())
        .then(json => {
          // Store the userID in the state
          if (json.success) {
            this.setState({
              userID: json.userId,
              isLoading: false
            });
            // Get the user classes from the database
            this.makePost(json.userId)
              .then(res => this.setState({ classes: res }))
              .catch(err => console.log(err));
          } else {
            this.setState({
              isLoading: false
            });
          }
        });
    } else {
      this.setState({
        isLoading: false
      });
    }
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch("/");
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  // Post call to the database to get the user classes
  makePost = async userID => {
    const response = await fetch("/api/userClasses", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userID: userID })
    });

    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    console.log(body);

    return body;
  };

  // Post to delete the selected class from the server
  deletePost = async _id => {
    const response = await fetch("/api/deleteClass", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ _id: _id })
    });

    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    console.log(body);

    return body;
  };

  render() {
    if (!this.state.isLoading) {
      return (
        <div className="App">
          <Container>
            <Row>
              <Col>
                <ClassInput
                  onSubmit={this.handleSubmit}
                  userID={this.state.userID}
                />
              </Col>
              <Col>
                {Object.keys(this.state.classes)
                  .slice(0)
                  .reverse()
                  .map((year, idx) => {
                    return (
                      <>
                        <Table key={idx} className="classLog">
                          <thead key={idx}>
                            <tr>
                              <th>{year}</th>
                            </tr>
                          </thead>
                          {this.state.classes[year].map((i, quarter) => {
                            return (
                              <tbody key={quarter}>
                                <tr key={quarter}>
                                  {quarter === 0 &&
                                    this.state.classes[year][quarter].length !==
                                      0 && (
                                      <td>
                                        <b>Summer</b>
                                      </td>
                                    )}
                                  {quarter === 1 &&
                                    this.state.classes[year][quarter].length !==
                                      0 && (
                                      <td>
                                        <b>Fall</b>
                                      </td>
                                    )}
                                  {quarter === 2 &&
                                    this.state.classes[year][quarter].length !==
                                      0 && (
                                      <td>
                                        <b>Spring</b>
                                      </td>
                                    )}
                                  {quarter === 3 &&
                                    this.state.classes[year][quarter].length !==
                                      0 && (
                                      <td>
                                        <b>Winter</b>
                                      </td>
                                    )}
                                </tr>
                                <>
                                  {this.state.classes[year][quarter].map(
                                    (userClass, classIdx) => {
                                      return (
                                        <tr key={classIdx}>
                                          <td key={classIdx}>
                                            {userClass.courseID}
                                          </td>
                                          <td>
                                            <Button
                                              key={classIdx}
                                              onClick={() => {
                                                this.delete(
                                                  userClass._id,
                                                  classIdx,
                                                  quarter,
                                                  year
                                                );
                                              }}
                                            >
                                              Delete
                                            </Button>
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </>
                              </tbody>
                            );
                          })}
                        </Table>
                        <br />
                      </>
                    );
                  })}
              </Col>
            </Row>
          </Container>
        </div>
      );
    } else {
      return (
        <div className="Loading">
          <p> loading ... </p>
        </div>
      );
    }
  }
}
export default ClassLogging;
