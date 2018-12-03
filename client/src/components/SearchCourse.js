import React, { Component } from 'react';
import {
    InstantSearch,
    Hits,
    SearchBox,
    Highlight,
    RefinementList,
    Pagination,
    CurrentRefinements,
    ClearRefinements,
    Configure,
    PoweredBy
} from 'react-instantsearch-dom';
import 'instantsearch.css/themes/reset.css';
import '../styles/SearchCourse.css';
import { Button, UncontrolledCollapse, TabContent, TabPane, Nav, NavItem, NavLink, } from 'reactstrap';
import * as Quarters from './quarterConstants';

/*
*Used to display course information (course Title, description, instructor, days, times, room)
*parts of the course will highlight when user is searching in searchbar
*/
class Course extends Component {
    constructor(props) {
        super(props);
        this.state = {
            response: ''
        };
        this.submit = this.submit.bind(this);
        this.quarterStringToNumber = this.quarterStringToNumber.bind(this);
        this.notEmpty = this.notEmpty.bind(this);
    }

    // Convert the quarter name to a number to store in the database
    quarterStringToNumber(quarter) {
        if (quarter === 'Fall') {
            quarter = Quarters.Fall;
        } else if (quarter === 'Summer') {
            quarter = Quarters.Summer;
        } else if (quarter === 'Spring') {
            quarter = Quarters.Spring
        } else if (quarter === 'Winter') {
            quarter = Quarters.Winter;
        }
        return quarter;
    }

    submit() {
        if(this.props.userID!==''){
            let quarterYear =  this.props.hit.quarter.split(" ");
            let quarter = this.quarterStringToNumber(quarterYear[0]), year = quarterYear[1];
            // Send all the class data to the server to store in the database
            this.submitClass({
                class: this.props.hit.courseID,
                userID: this.props.userID,
                quarter: quarter,
                year: year,
                room: this.props.hit.lecture.room,
                days: this.props.hit.lecture.days,
                times: this.props.hit.lecture.times,
                meetingDates: this.props.hit.lecture.meetingDates,
                ge: this.props.hit.meta.general_education,
                credits: this.props.hit.meta.credits,
                instructor: this.props.hit.lecture.instructor,
                courseTitle: this.props.hit.courseTitle
            }) 
                .then(res => {
                    this.props.onClick(this.props.hit.courseID, res._id, quarter, year, 14); // Get classLogging to add the new class to the page
                }).catch(err => console.log(err));
        }
    }

    // Make post call to server to submit class data
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
                room: data.room,
                days: data.days,
                times: data.times,
                meetingDates: data.meetingDates,
                ge: data.ge,
                credits: data.credits,
                instructor: data.instructor,
                courseTitle: data.courseTitle,
            })
        });

        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    // Parses the course title to be in the format CMPS 101 - 01
    parseCourseTitle() {
        let courseSplit = this.props.hit.courseTitle.split(" ");
        return courseSplit[0]+" "+courseSplit[1]+" "+courseSplit[2]+" "+courseSplit[3];
    }

    notEmpty(ge) {
        ge = ge.trim();
        //console.log(ge);
        if(ge === ""){
            return false;
        }
        return true;
    }

    render() {
        return (
            <div style={{ padding: '10px' }}>
                <span className="hits">
                    <div className="hitContainer">
                        <div>
                            <Button className="hitButton" id={'id' + this.props.hit.objectID}>
                                {this.parseCourseTitle()} {this.props.hit.quarter}
                            </Button>
                        </div>
                        {this.props.userID !== '' &&
                            <div>
                                <p align="right"><Button onClick={this.submit}>Add Class</Button></p>
                            </div>
                        }
                    </div>
                    <UncontrolledCollapse toggler={'#id' + this.props.hit.objectID}>
                        <div className="hitResult">
                            <p>{<Highlight attribute="courseTitle" hit={this.props.hit} tagName="mark" />}</p>
                            <p><Highlight attribute="description" hit={this.props.hit} tagName="mark" /></p>
                            {this.props.hit.prereqs !== "" && <p>{this.props.hit.prereqs}</p>}
                            <p>
                                {this.notEmpty(this.props.hit.meta.general_education) &&
                                    <><br />General Education: <Highlight attribute="meta.general_education" hit={this.props.hit} tagName="mark" /><br/></>}
                                Instructor: <Highlight attribute="lecture.instructor" hit={this.props.hit} tagName="mark" />
                                <br />Days and Times: <Highlight attribute="lecture.days" hit={this.props.hit} tagName="mark" /> <Highlight attribute="lecture.times" hit={this.props.hit} tagName="mark" />
                                <br />Room: <Highlight attribute="lecture.room" hit={this.props.hit} tagName="mark" />
                                <br />Meeting Dates: <Highlight attribute="lecture.meetingDates" hit={this.props.hit} tagName="mark" />
                            </p>
                        </div>
                    </UncontrolledCollapse>
                </span>
            </div>
        );
    }
}

/*
*Used to implement widgets
*Refinment List in collapsible menus, Current Refinements, Pagination
*Collapsile Menu: https://www.npmjs.com/package/react-collapsible-component
*/
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1'
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    render() {
        return (
            <div className="container">
                <SearchBox className="search"/>
                <h4>Filters</h4>
                <Nav tabs>
                    <NavItem>
                        <NavLink className="1" onClick={() => { this.toggle('1'); }}>
                            Career
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="2" onClick={() => { this.toggle('2'); }}>
                            Type
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="3" onClick={() => { this.toggle('3'); }}>
                            Credits
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="4" onClick={() => { this.toggle('4'); }}>
                            GE
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="5" onClick={() => { this.toggle('5'); }}>
                            Days
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="7" onClick={() => { this.toggle('7'); }}>
                            Times
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="6" onClick={() => { this.toggle('6'); }}>
                            Quarter
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent className="activeTab" activeTab={this.state.activeTab}>
                    <TabPane id="filterbox" tabId="1">
                        <RefinementList attribute="meta.career" />
                    </TabPane>
                    <TabPane id="filterbox" tabId="2">
                        <RefinementList attribute="meta.type" />
                    </TabPane>
                    <TabPane id="filterbox" tabId="3">
                        <RefinementList attribute="meta.credits" />
                    </TabPane>
                    <TabPane id="filterbox" tabId="4">
                        <RefinementList attribute="meta.general_education" />
                    </TabPane>
                    <TabPane id="filterbox" tabId="5">
                        <RefinementList attribute="lecture.days" />
                    </TabPane>
                    <TabPane id="filterbox" tabId="7">
                        <RefinementList attribute="lecture.times" />
                    </TabPane>
                    <TabPane id="filterbox" tabId="6">
                        <RefinementList attribute="quarter" />
                    </TabPane>
                </TabContent>
                <div className="Filters">
                    <CurrentRefinements />
                </div>
                <ClearRefinements />
                <Hits hitComponent={({ hit }) => (<Course hit={hit} onClick={this.props.onClick} userID={this.props.userID} />)} />
                <Configure hitsPerPage={10} />
                <div className="pages">
                    <Pagination showLast={true} />
                </div> 
                <div className="poweredBy">
                    <PoweredBy />
                </div>
            </div>
        );
    }

}

//Used for the search
//Apparently Algolia does not like it when you try to search from a combination of two indices at the same time
//https://stackoverflow.com/questions/32615483/compare-ranking-of-algolia-query-across-multiple-indices
//https://github.com/algolia/instantsearch.js/issues/2129
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <InstantSearch
                apiKey="e0f4e3542265d408d5be8de22d00a12e"
                appId="Z4ZULV1BRS"
                indexName="combined"
            >
                <Search onClick={this.props.onClick} userID={this.props.userID} />
            </InstantSearch>
        );
    }
}

//renders the search
class SearchCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <App onClick={this.props.onSubmit} userID={this.props.userID} />
        );
    }
}

export default SearchCourse