import React from 'react'
export default class CalendarMiniDay extends React.Component {

  render() {
    let classDay = this.props.day.red ? 'calendar-day day-red' : 'calendar-day'
    return (
        <span className={classDay} style={ 'isCurrentDay' in this.props.day?
          {
            background: '#b7bfd6'
          } : {} }>
            {(() => {
                if (this.props.day.number) {
                    return this.props.day.number

                } else {
                    return ' '
                }
            })()}
        </span>
    )
  }
}
