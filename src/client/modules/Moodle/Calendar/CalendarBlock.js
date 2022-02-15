import React from 'react'
import CalendarDay from 'src/client/modules/Moodle/Calendar/CalendarDay'
export default class CalendarMiniBlock extends React.Component {

    render() {

        return (

            <div className="col-xs-12">
                <div className="row">

                    {this.props.days.map((day, index) => {
                        return <CalendarDay key={index} userData={this.props.userData} day={day}/>
                    })}

                </div>
            </div>

        )
    }
}
