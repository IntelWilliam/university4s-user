import React from 'react'
import Footer from 'src/client/modules/layout/footer'
import { Link } from 'react-router'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import CalendarBlock from 'src/client/modules/Moodle/Calendar/CalendarBlock'
import CalendarStore from 'src/client/modules/Moodle/Calendar/CalendarStore'
import UserStore from 'src/client/modules/Moodle/UserData/UserStore'
import NextEvents from 'src/client/modules/Moodle/NextEvents/NextEvents'

export class CurrentDate {
  constructor(){
    this.currendate = new Date()
  }
  getCurrentDay () {
    return this.currendate.getDate()
  }
  getCurrentMonth () {
    return this.currendate.getMonth()
  }
  getCurrentYear () {
    return this.currendate.getFullYear()
  }
  getDate(){
    return this.currendate
  }
}

export default class Calendar extends React.Component {
  constructor() {
    super()
    this.state = {
      month: [],
      monthDate: null,
      monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Nombiembre", "Diciembre"],
      userData: []
    }

    this.mCurrentDate = new CurrentDate()
  }

  componentWillMount() {
    this.loadDataUser()
    this.showMonth(new Date())
  }

  loadDataUser(){
    UserStore.getOne(JSON.parse(localStorage.user).userIdDev, (err, response) => {
      if (err) return
      this.setState({
        userData: response,
      })
    })
  }

  componentDidMount(){
    // this.loadData()
    this.goTop()
  }

  loadData(firstDate, secondDate, cb) {
      CalendarStore.getThisMonth( firstDate, secondDate, (err, response) => {
          if (err)
              return cb(err)
          if (response) {
              console.log('response', response);
              cb(null, response)
          }
      })
  }


  showMonth(dateToShow) {
    let month = dateToShow.getMonth()
    let year = dateToShow.getFullYear()
    let first = new Date(year, month, 1, 0)
    let lastTemp = new Date(year, month + 1, 1, 0)

    this.loadData(first.getTime(), lastTemp.getTime(), (err, events) =>{
      if (err){
        console.log('err', err);
        return
      }
      // console.log('events', events);

      let last = new Date(lastTemp - 1)
      let lastDay = last.getDate()
      let monthArr = []
      let currDay = 1
      let currInteraction = 1
      let monthEvent = {}
      for(let event in events){
        let evenDateNumber = new Date(events[event].date).getUTCDate()
        if(!(evenDateNumber in monthEvent)){
          monthEvent[evenDateNumber] = []
        }
        monthEvent[evenDateNumber].push(events[event])
      }

      for (let i = 1; i <= 5; i++) {
        let blockDays = []
        for (let k = 1; k <= 7; k++) {
          let day = { number: null, red: false, events: null }

          if(currDay == this.mCurrentDate.getCurrentDay() &&
            month == this.mCurrentDate.getCurrentMonth() &&
            year == this.mCurrentDate.getCurrentYear()
          ){
            day.isCurrentDay = true
          }

          if (i == 1) {
            if (k >= dayofweek) {
              day.number = currDay
              day.events = day.number in monthEvent ? monthEvent[day.number] : null
              currDay++
            }
          } else {
            if (i == 5) {
              if (currInteraction < (lastDay + dayofweek)) {
                day.number = currDay
                day.events = day.number in monthEvent ? monthEvent[day.number] : null
                currDay++
              }
            } else {
              day.number = currDay
              day.events = day.number in monthEvent ? monthEvent[day.number] : null
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
    })

    let dayofweek = first.getDay() + 1
  }

  getMonthName(option) {
    if(!this.state.monthDate)
    return ''

    let temp = option == false ? -1 : option == true ?  1 : 0 ;
    let newDate = new Date( this.state.monthDate.getFullYear(), this.state.monthDate.getMonth() + temp, 1)
    return this.state.monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear()
  }

  newMonth(sumNumber) {
    let month = this.state.monthDate.getMonth()
    let year = this.state.monthDate.getFullYear()
    let newMonth = new Date(year, month + sumNumber, 1)
    this.showMonth(newMonth)
  }

  goTop() {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  }

  render() {

    let navigationArray = [{
      'name': 'Inicio',
      'url': null
    }, {
      'name': 'Curso',
      'url': '/user-area/'
    }, {
      'name': 'Calendario',
      'url': null
    }]
    let headerInfo = {
      title: "Calendario",
      translation: "Calendar",
      description: '',
    }

    // console.log('this.state.month', this.state.month);

    return (
      <div style={{background: "#F6F7F7"}}>
                <HeaderPage navigation={navigationArray} headerInfo={headerInfo}/>
                <div className="container" style={{marginTop: "1em" }}>
                    <div className="col-xs-12 section-name">
                        <div className="col-xs-12">
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="info-title-section-container">
                                        <div className="pdf-icon-container" style={{height: "2.4em"}}>
                                            <img className="pdf-icon" src="/images/course.png"/>
                                        </div>
                                        <div className="info-title-container">
                                            <span className="info-title">Eventos</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-12">
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="exercise-border">
                                        <span>&nbsp;</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-md-3 col-xs-12">

                                <NextEvents/>

                                <div className="card-next-event col-xs-12">
                                    <div className="row">
                                        <div className="col-xs-12 header-card header-calendar">
                                            <span className="card-next-event-title">Navegación</span>
                                        </div>
                                        <div className="col-xs-12 body-card">
                                            <div className="col-xs-12">
                                                <span className="card-next-event-title-body">Página principal</span>
                                            </div>
                                            <div className="col-xs-12 navegation-container">
                                                <div className="arrow-right-navegation"></div>
                                                <span className="navegation-2">Calendario</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            <div className="col-md-9 col-xs-12">
                                    <div className="col-xs-12">
                                        <span className="calendar-title">{this.getMonthName()}</span>
                                    </div>
                                    <div className="col-xs-12 next-buttons">
                                        <div className="row">
                                            <div className="col-xs-6 next-prev-month-container prev-month-container" onClick={this.newMonth.bind(this, -1)}>
                                                <div className="prev-row"></div>
                                                <span className="next-prev-month prev-month">{this.getMonthName(false)}</span>
                                            </div>
                                            <div className="col-xs-6 next-prev-month-container next-month-container" onClick={this.newMonth.bind(this, 1)}>
                                                <span className="next-prev-month next-month">{this.getMonthName(true)}</span>
                                                <div className="next-row"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 small-out">
                                        <div className="row">
                                            <div className="col-xs-12 col-md calendar-day-page-container">
                                                <span className="calendar-day-page">Dom</span>
                                            </div>
                                            <div className="col-xs-12 col-md calendar-day-page-container">
                                                <span className="calendar-day-page">Lun</span>
                                            </div>
                                            <div className="col-xs-12 col-md calendar-day-page-container">
                                                <span className="calendar-day-page">Mar</span>
                                            </div>
                                            <div className="col-xs-12 col-md calendar-day-page-container">
                                                <span className="calendar-day-page">Mie</span>
                                            </div>
                                            <div className="col-xs-12 col-md calendar-day-page-container">
                                                <span className="calendar-day-page">Jue</span>
                                            </div>
                                            <div className="col-xs-12 col-md calendar-day-page-container">
                                                <span className="calendar-day-page">Vie</span>
                                            </div>
                                            <div className="col-xs-12 col-md calendar-day-page-container">
                                                <span className="calendar-day-page">Sab</span>
                                            </div>
                                        </div>
                                    </div>

                                    {this.state.month.map((daysBlock, index) => {
                                        return <CalendarBlock
                                                    key={index}
                                                    userData={this.state.userData}
                                                    days={daysBlock}/>
                                    })}

                                    <div className="col-xs-12 next-buttons">
                                        <div className="row">
                                            <div className="col-xs-6 next-prev-month-container prev-month-container" onClick={this.newMonth.bind(this, -1)}>
                                                <div className="prev-row"></div>
                                                <span className="next-prev-month prev-month">{this.getMonthName(false)}</span>
                                            </div>
                                            <div className="col-xs-6 next-prev-month-container next-month-container" onClick={this.newMonth.bind(this, 1)}>
                                                <span className="next-prev-month next-month">{this.getMonthName(true)}</span>
                                                <div className="next-row"></div>
                                            </div>
                                        </div>
                                    </div>

                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
    )
  }
}
