import React, { Component } from "react";
import FullCalendar from "fullcalendar-reactwrapper-with-scheduler";
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
      events: [
        {
          title: "All Day Event",
          start: "2018-11-07"
        },
        {
          title: "Long Event",
          start: "2018-11-07",
          end: "2018-11-10"
        }
      ]
    };
  }

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
            right: "month,basicWeek,basicDay"
          }}
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
