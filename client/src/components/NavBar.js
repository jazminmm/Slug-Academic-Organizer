import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import SignIn from "./Home";
import GERequirements from "./GERequirements";
import ClassLogging from "./ClassLogging";
import Calendar from "./Calendar";
import "../styles/NavBar.css";


class NavBar extends Component {
  render() {

    return (
      <HashRouter>
        <div>
          <h1>Slug Academic Organizer</h1>
          <ul className="header">
            <li><NavLink exact to="/">Sign In</NavLink></li>
            <li><NavLink to="/logging">Class Logging</NavLink></li>
            <li><NavLink to="/ge">GE Requirements</NavLink></li>
            <li><NavLink to="/calendar">Calendar</NavLink></li>
          </ul>
          <div className="content">
            <Route exact path="/" component={SignIn} />
            <Route path="/logging"component={ClassLogging} />
            <Route path="/ge" component={GERequirements} />
            <Route path="/calendar" component={Calendar} />


          </div>
        </div>
      </HashRouter>
    );
  }
}

export default NavBar;
