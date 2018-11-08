import React, { Component } from "react";
import "../styles/GERequirements.css";

class GERequirements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ge: [] //server response
    };
  }

  //makes get request to server after the component mounts
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ ge: res }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch("/api/GERequirements");
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    console.log(body);
    return body;
  };

  render() {
    return (
      <div>
        <h3 className="pageTitle">GE Requirements</h3>
        <table>
          {this.state.ge.map(function(current, index) {
            return (
              <div className="GETable">
                <tbody>
                  <tr>
                    <td className="category">
                      <b>GE ID:</b>
                    </td>
                    <td className="GE">{current.geID}</td>
                  </tr>
                  <tr>
                    <td className="category">
                      <b>Description:</b>
                    </td>
                    <td className="GE">{current.desc}</td>
                  </tr>
                  <tr>
                    <td className="category">
                      <b>Credits:</b>
                    </td>
                    <td className="GE">{current.credits}</td>
                  </tr>
                </tbody>
              </div>
            );
          })}
        </table>
      </div>
    );
  }
}

export default GERequirements;
