import React from 'react'
import CalendarMiniBlock from 'src/client/modules/Moodle/Calendar/CalendarMini/CalendarMiniBlock'
import {CurrentDate} from "../Calendar";
export default class CalendarMini extends React.Component {

  constructor() {
    super()
    this.state = {
      month: [],
      monthDate: null,
      monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Nombiembre", "Diciembre"]
    }

    this.mCurrentDate = new CurrentDate()
  }


  componentDidMount() {
    this.showMonth(new Date())
  }



  showMonth(dateToShow) {
    let month = dateToShow.getMonth()
    let year = dateToShow.getFullYear()
    let first = new Date(year, month, 1)
    let dayofweek = first.getDay() + 1
    let lastTemp = new Date(year, month + 1, 1)
    let last = new Date(lastTemp - 1)
    let lastDay = last.getDate()
    let monthArr = []
    let currDay = 1
    let currInteraction = 1
    for (let i = 1; i <= 5; i++) {
      let blockDays = []
      for (let k = 1; k <= 7; k++) {
        let day = { number: null, red: false }

        if(currDay == this.mCurrentDate.getCurrentDay() &&
          month == this.mCurrentDate.getCurrentMonth() &&
          year == this.mCurrentDate.getCurrentYear()
        ){
          day.isCurrentDay = true
        }

        if (i == 1) {
          if (k >= dayofweek) {
            day.number = currDay
            currDay++
          }
        } else {
          if (i == 5) {
            if (currInteraction < (lastDay + dayofweek)) {
              day.number = currDay
              currDay++
            }
          } else {
            day.number = currDay
            currDay++
          }
        }
        if (day.number && (k == 1 || k == 7)) {
          day.red = true
        }
        currInteraction++
        blockDays.push(day)
      }
      monthArr.push(blockDays)
    }
    this.setState({
      month: monthArr,
      monthDate: dateToShow
    })
  }

  getMonthName() {
    return this.state.monthDate ? this.state.monthNames[this.state.monthDate.getMonth()] + ' ' + this.state.monthDate.getFullYear() : ''
  }

  newMonth(sumNumber) {
    let month = this.state.monthDate.getMonth()
    let year = this.state.monthDate.getFullYear()
    let newMonth = new Date(year, month + sumNumber, 1)
    this.showMonth(newMonth)
  }

  render() {
    return (
      <div className="card-next-event col-xs-12">
            <div className="row">
                <div className="col-xs-12 header-card header-calendar">
                    <span className="card-next-event-title">Calendario</span>
                </div>
                <div className="col-xs-12 body-card">
                    <div className="col-xs-12 card-calendar-row">
                        <div className="arrow-left mousePoint" onClick={this.newMonth.bind(this, -1)}></div>
                        <span className="card-calendar-title">{this.getMonthName()}</span>
                        <div className="arrow-right mousePoint" onClick={this.newMonth.bind(this, 1)}></div>
                    </div>
                    <div className="col-xs-12 calendar-day-container calendar-day-title">
                        <span className="calendar-day">Do</span>
                        <span className="calendar-day">Lu</span>
                        <span className="calendar-day">Ma</span>
                        <span className="calendar-day">Mi</span>
                        <span className="calendar-day">Ju</span>
                        <span className="calendar-day">Vi</span>
                        <span className="calendar-day">Sa</span>
                    </div>
                    {this.state.month.map((daysBlock, index) => {
                        return <CalendarMiniBlock
                                    key={index}
                                    days={daysBlock}/>
                    })}
                </div>
            </div>
        </div>
    )
  }
}
