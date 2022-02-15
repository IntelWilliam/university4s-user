import React from 'react'
// import {Link} from 'react-router'
import LessonsStore from 'src/client/modules/Moodle/Lessons/LessonsStore'

export default class CalendarEvent extends React.Component {

  checkLastLesson() {
    console.log("this.props.event", this.props.event)
    var href = ""
    if(this.props.event.hasOwnProperty("examEvent")){
      href = '/user-area/exams/'
      return this.context.router.push(href)
    }

    let level;
    let subLevel;

    if (this.props.event.levelName == "Inicial") {
      level = "initial";
      subLevel = this.props.event.subLevelName[8]
    } else if (this.props.event.levelName == "Fundamental") {
      level = "fundamental";
      subLevel = this.props.event.subLevelName[12]
    } else {
      subLevel = this.props.event.subLevelName[12]
      level = "operational";
    }

    let levelUserData = this.props.userData[level]

    if (levelUserData[subLevel].passed) {
      LessonsStore.getOne(this.props.event.sublevelMoodleId, (err, response) => {
        if (err)
          return
          // se valida si es la ultima leccion de el subnivel
        let lastLesson = response[response.length - 1].code == this.props.event.lessonMoodleId
          ? true
          : false;

        var href = ""
        if(!this.props.event.hasOwnProperty("examEvent")){
          href = '/user-area/course/lessons/lesson/?levelName=' +
          this.props.event.levelName + '&subName=' +
          this.props.event.subLevelName + '&subId=' +
          this.props.event.sublevelMoodleId + '&lessonId=' +
          this.props.event.lessonMoodleId + '&lastLesson=' +
          lastLesson.toString() + '&lessonName=' +
          this.props.event.lessonName + '&lessonIndex=' +
          this.props.event.lessonIndex;
        }else{
          href = '/user-area/exams/'
        }

        // href = '/user-area/course/lessons/lesson/?levelName=' + this.props.event.levelName + '&subName=' + this.props.event.subLevelName + '&subId=' + this.props.event.sublevelMoodleId + '&lessonId=' + this.props.event.lessonMoodleId + '&lastLesson=' + lastLesson.toString() + '&lessonName=' + this.props.event.lessonName;

        // const href = '/user-area/course/lessons/lesson/?levelName=' + this.props.event.levelName + '&subName=' + this.props.event.subLevelName + '&subId=' + this.props.event.sublevelMoodleId + '&lessonId=' + this.props.event.lessonMoodleId + '&lastLesson=' + lastLesson.toString() + '&lessonName=' + this.props.event.lessonName;

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

    let eventColor = {
      background: '#459BA8'
    };

    if(this.props.event.hasOwnProperty("examEvent")){
      eventColor = {     background: '#FCAA85'   }
    }

    // switch (this.props.event.entryType) { case 0:   eventColor = {
    // background: '#FCAA85'   };   break; case 1:   eventColor = {     background:
    // '#78C5D7'   };   break; case 2:   eventColor = {     background: '#79C268'
    // };
    //
    //   break; case 3:   eventColor = {     background: '#459BA8'   };
    //
    //   break; case 4:   eventColor = {     background: '#C5D747'   };
    //
    //   break; case 5:   eventColor = {     background: '#8BC34A'   };
    //
    //   break; case 6:   eventColor = {     background: '#3F51B5'   };
    //
    //   break; case 7:   eventColor = {     background: '#BF63A6'   };
    //
    //   break; case 8:   eventColor = {     background: '#958DFC'   };
    //
    //   break; case 9:   eventColor = {     background: '#E868A1'   };
    //
    //   break; default:   eventColor = {     background: '#00000'   };
    //
    // }

    return (
      <div
        className="col-xs-12 event-calendar red-color"
        style={eventColor}
        onClick={this.checkLastLesson.bind(this)}>
        <span className="event-calendar-name">{this.props.event.lessonName && this.props.event.lessonTranslate ? this.props.event.lessonName + ' / ' + this.props.event.lessonTranslate : "Examen" }</span>
      </div>
    )

  }
}

CalendarEvent.contextTypes = {
  router: React.PropTypes.object
}
