import React from 'react'
import { Link } from 'react-router'
import LessonsStore from 'src/client/modules/Moodle/Lessons/LessonsStore'
import UserStore from 'src/client/modules/Moodle/UserData/UserStore'
import NextEvetsStore from 'src/client/modules/Moodle/NextEvents/NextEventsStore'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class NextEvents extends React.Component {
  constructor() {
    super()
    this.state = {
      nextEvents: [],
      pageTexts: [],
      userData: []
    }
  }

  componentWillMount() {
    this.loadEvets()
    this.loadDataUser()
    this.loadPageTexts()
  }

  loadPageTexts() {
    FrontTextsActions.getTexts("NEXT_EVENTS", (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        // console.log('body.texts', body.texts);
        // se setea el mensaje a mostrar
        this.setState({pageTexts: body.texts})
      }

    })
  }

  loadEvets() {
    NextEvetsStore.getEvents((err, response) => {
      if (err)
        return err
      // var arr = Object.keys(response).map((key) => {
      //     return response[key]
      // });

      // si no existen eventos, se crean
      if (response.length == 0) {
        NextEvetsStore.addEvents((err, response) => {
          if (err)
            return err
          // var arr = Object.keys(response).map((key) => {
          //     return response[key]
          // });
          this.loadEvets()
        })
      }
      this.setState({nextEvents: response})
    })
  }

  loadDataUser() {
    UserStore.getOne(JSON.parse(localStorage.user).userIdDev, (err, response) => {
      if (err) return
      this.setState({
        userData: response,
      })
    })
  }


  // checkLastLesson(event) {

  //   var href = ""
  //   if(!event.hasOwnProperty("examEvent")){
  //     LessonsStore.getOne(event.sublevelMoodleId, (err, response) => {
  //       if (err)
  //         return
  //           // se valida si es la ultima leccion de el subnivel
  //     //   console.log("response", response);
  //       let lastLesson = response[response.length - 1].code == event.lessonMoodleId
  //           ? true
  //           : false;
  //       href = '/user-area/course/lessons/lesson/?levelName=' + event.levelName + '&subName=' + event.subLevelName + '&subId=' + event.sublevelMoodleId + '&lessonId=' + event.lessonMoodleId + '&lastLesson=' + lastLesson.toString() + '&lessonName=' + event.lessonName;
  //       return this.context.router.push(href)
  //     })

  //   }else{
  //     href = '/user-area/exams/'
  //     return this.context.router.push(href)
  //   }
  // }

  checkLastLesson(event) {
    console.log("event", event)
    var href = ""
    if (event.hasOwnProperty("examEvent")) {
      href = '/user-area/exams/'
      return this.context.router.push(href)
    }

    let level;
    let subLevel;

    if (event.levelName == "Inicial") {
      level = "initial";
      subLevel = event.subLevelName[8]
    } else if (event.levelName == "Fundamental") {
      level = "fundamental";
      subLevel = event.subLevelName[12]
    } else {
      subLevel = event.subLevelName[12]
      level = "operational";
    }
    console.log("sirve")

    let levelUserData = this.state.userData[level]

    if (levelUserData[subLevel].passed) {
      LessonsStore.getOne(event.sublevelMoodleId, (err, response) => {
        if (err)
          return
        // se valida si es la ultima leccion de el subnivel
        let lastLesson = response[response.length - 1].code == event.lessonMoodleId
          ? true
          : false;

        var href = ""
        if (!event.hasOwnProperty("examEvent")) {
          href = '/user-area/course/lessons/lesson/?levelName=' +
            event.levelName + '&subName=' +
            event.subLevelName + '&subId=' +
            event.sublevelMoodleId + '&lessonId=' +
            event.lessonMoodleId + '&lastLesson=' +
            lastLesson.toString() + '&lessonName=' +
            event.lessonName + '&lessonIndex=' +
            event.lessonIndex;
        } else {
          href = '/user-area/exams/'
        }

        // href = '/user-area/course/lessons/lesson/?levelName=' + event.levelName + '&subName=' + event.subLevelName + '&subId=' + event.sublevelMoodleId + '&lessonId=' + event.lessonMoodleId + '&lastLesson=' + lastLesson.toString() + '&lessonName=' + event.lessonName;

        // const href = '/user-area/course/lessons/lesson/?levelName=' + event.levelName + '&subName=' + event.subLevelName + '&subId=' + event.sublevelMoodleId + '&lessonId=' + event.lessonMoodleId + '&lastLesson=' + lastLesson.toString() + '&lessonName=' + event.lessonName;

        this.context.router.push(href)
      })
    } else {

      swal({
        title: 'Bloqueado!',
        text: "Para desbloquear debe aprobar el subnivel!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ok, ir!'
      }).then(() => {
        this.context.router.push('/user-area/exams/')
      })

    }

  }

  render() {
    let image1 = "/images/exam-icon.png"
    let image2 = "/images/exam-icon.png"

    if (this.state.nextEvents.length >= 2) {
      switch (this.state.nextEvents[0].entryType) {
        case 0:
          image1 = "/images/practice.png"
          //Sentencias ejecutadas cuando el resultado de expresion coincide con valor1
          break;
        case 1:
        case 2:
        case 4:
        case 9:
          image1 = "/images/video-course.png"
          break;
        case 3:
          image1 = "/images/text-course.png"
          break;
        case 5:
          image1 = "/images/pdf-course.png"
          break;
        case 6:
          image1 = "/images/practice-web.png"
          break;
        case 7:
        case 8:
          image1 = "/images/exam-icon.png"
          break;
      }

      switch (this.state.nextEvents[1].entryType) {
        case 0:
          image2 = "/images/practice.png"
          //Sentencias ejecutadas cuando el resultado de expresion coincide con valor1
          break;
        case 1:
        case 2:
        case 4:
        case 9:
          image2 = "/images/video-course.png"
          break;
        case 3:
          image2 = "/images/text-course.png"
          break;
        case 5:
          image2 = "/images/pdf-course.png"
          break;
        case 6:
          image2 = "/images/practice-web.png"
          break;
        case 7:
        case 8:
          image2 = "/images/exam-icon.png"
          break;
      }

    }

    return (
      <div className="col-xs-12">
        <div className="row">
          <div className="col-xs-12 header-card">
            <span className="card-next-event-title">{this.state.pageTexts[0]}</span>
            {/* <span className="card-next-event-title">Eventos próximos</span> */}
          </div>
          <div className="col-xs-12 body-card">
            <div className="col-xs-12">
              <span className="card-next-event-title-body">{this.state.pageTexts[1]}</span>
              {/* <span className="card-next-event-title-body">Área personal</span> */}
            </div>

            {(() => {
              if (this.state.nextEvents.length > 0) {
                return this.state.nextEvents.map((nextEvent, index) => {
                  // console.log('nextEvent', nextEvent);

                  let eventDate = (new Date(nextEvent.date))
                  eventDate = eventDate.getDay() == (new Date()).getDay() ? 'hoy' : eventDate.getDate() + '/' + (eventDate.getMonth() + 1) + '/' + eventDate.getFullYear();
                  return (
                    <div key={index} className="col-xs-12">
                      <div className="event-next">
                        <div className="event-icon-container">
                          <img className="pdf-icon" src={image1}/>
                        </div>
                        <div className="event-next-info">
                          <div className="row" style={{
                            paddingLeft: "0.5em"
                          }}>
                            <span className="col-xs-12 event-next-name mousePoint"
                                  onClick={this.checkLastLesson.bind(this, nextEvent)}>{nextEvent.lessonName && nextEvent.lessonTranslate? nextEvent.lessonName + ' / ' + nextEvent.lessonTranslate : "Examen"}</span>
                            {/* <span className="col-xs-12 event-next-name mousePoint" onClick={this.checkLastLesson.bind(this, nextEvent)}>{nextEvent.entryName}</span> */}
                            <span className="col-xs-12 event-next-hour">{eventDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              } else {
                return (
                  <div className="col-xs-12">
                    <div className="event-next">
                      <div className="event-icon-container">
                        <img className="pdf-icon" src={image2}/>
                      </div>
                      <div className="event-next-info">
                        <div className="row" style={{
                          paddingLeft: "0.5em"
                        }}>
                          <span className="col-xs-12 event-next-name">{this.state.pageTexts[2]}</span>
                          {/* <span className="col-xs-12 event-next-name">Sin eventos</span> */}
                          <span className="col-xs-12 event-next-hour"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            })()}

            <div className="col-xs-12">
              <div className="card-link-container">
                <Link className="card-link" to="/user-area/calendar/">
                  {this.state.pageTexts[3]}
                  {/* Ir al calendario */}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

NextEvents.contextTypes = {
  router: React.PropTypes.object
}
