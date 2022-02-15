import React from 'react'
import CalendarMiniDay from 'src/client/modules/Moodle/Calendar/CalendarMini/CalendarMiniDay'
export default class CalendarMiniBlock extends React.Component {

  render() {


    return (
        <div className="col-xs-12 calendar-day-container">
            {this.props.days.map((day, index) => {
                return <CalendarMiniDay
                            key={index}
                            day={day}/>
            })}
        </div>
    )
  }
}
