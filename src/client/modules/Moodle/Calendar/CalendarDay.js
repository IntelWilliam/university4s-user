import React from 'react'
import CalendarEvent from 'src/client/modules/Moodle/Calendar/CalendarEvent'

export default class CalendarDay extends React.Component {
    render() {
        let classDay = this.props.day.red
            ? 'calendar-day-page-number day-red'
            : 'calendar-day-page-number'

        {
            if (this.props.day.number) {
                return (
                    <div className="col-xs-12 col-md calendar-day-page-number-container" style={ 'isCurrentDay' in this.props.day?
                      {
                        background: '#b7bfd6'
                      } : {} }>
                        <div className="row">
                            <div className="col-xs-12 calendar-day-page-number-title">
                                <span className={classDay}>{this.props.day.number}</span>
                            </div>

                            <div className="col-xs-12 calendar-day-page-number-content">
                                <div className="row">

                                    {(() => {
                                        if(this.props.day.events) {
                                            return this.props.day.events.map((event, index) => {
                                              // console.log('event', event);
                                                return <CalendarEvent key={index} userData={this.props.userData} event={event}/>
                                            })
                                        }
                                    })()}

                                </div>
                            </div>

                        </div>
                    </div>
                )

            } else {
                return (
                    <div className="col-xs-12 col-md calendar-day-page-number-container empty small-out"></div>
                )

            }
        }

    }
}
