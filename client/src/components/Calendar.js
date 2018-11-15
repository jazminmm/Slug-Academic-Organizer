import React, { Component } from "react";
import FullCalendar from "fullcalendar-reactwrapper";
import "../styles/Calendar.css";
import "../dist/fullcalendar.css";

/* Events are what we'll have to automatically sync w/ user
 * Uses v3 of fullCalendar
 * Calendar component is basic, but I showed how to use our
 * own custom css with it for now in ../styles/Calendar.css
 *
 * Reference:
 * https://github.com/sanjeev07/fullcalendar-reactWrapper
 * https://github.com/fullcalendar/fullcalendar
 */

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }
    componentDidMount() {
    this.callApi()
      .then(res => this.setState({ events: res }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch("/api/getCalendar");
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);
    console.log(body);
    return body;
  };

  render() {
    return (
      <div id="calendar">
        <h1>Class Calendar</h1>
        <FullCalendar
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          id="your-custom-ID"
          header={{
            left: "prev,next today",
            center: "title",
            right: "month,agendaWeek,agendaDay",
          }}
			//credits @slicedtoad and the community at stackoverflow.com
			eventRender = {function(event) {
				if(event.ranges) {
					return (event.ranges.filter(function(range) { // test event against all the ranges
						return (event.start.isBefore(range.end) &&
						event.end.isAfter(range.start));
				}).length) > 0; //if it isn't in one of the ranges, don't render it (by returning false)
			} 
			else return true;
		}}
		  minTime={"08:00"}
		  maxTime={"23:00"}
          defaultDate={Date.now()}
          navLinks={true}
          editable={true}
          eventLimit={true}
          events={this.state.events}
        />
      </div>
    );
  }
}
