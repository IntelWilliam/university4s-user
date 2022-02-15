import React from 'react'
import { Link } from 'react-router'

class SubExamLevelItem extends React.Component {

  userConfirm(section, can_do) {
    if (!can_do) {
      let toRoute = `/user-area/video-chat/`
      swal({
        title: this.props.pageTexts[30],
        text: this.props.pageTexts[31],
        // title: "Se ha quedado sin intentos",
        // text: "Para solicitar un intento contacte con un profesor",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: this.props.pageTexts[32],
        cancelButtonText: this.props.pageTexts[33]
        // confirmButtonText: "Si, contactar!",
        // cancelButtonText: "No, Regresar"
      }).then(() => {
        this.context.router.push(toRoute)
      })
    } else {


      ///user-area/declaration/:type
      let hrefGrammar = `/user-area/declaration/grammar/?levelName=${this.props.levelName}&levelId=${this.props.levelId}&subName=${this.props.subName}&subLevelId=${this.props.subLevelId}&section_id=${this.props.userdata.grammar.section_id}&exam_id=${this.props.userdata.grammar.exam_id}`
      let hrefReading = `/user-area/declaration/reading/?levelName=${this.props.levelName}&levelId=${this.props.levelId}&subName=${this.props.subName}&subLevelId=${this.props.subLevelId}&section_id=${this.props.userdata.reading.section_id}&exam_id=${this.props.userdata.reading.exam_id}`
      let hrefListening = `/user-area/declaration/listening/?levelName=${this.props.levelName}&levelId=${this.props.levelId}&subName=${this.props.subName}&subLevelId=${this.props.subLevelId}&section_id=${this.props.userdata.listening.section_id}&exam_id=${this.props.userdata.listening.exam_id}`
      let examTime = section == "grammar" ? 30 : 15
      let toRoute = section == "grammar" ? hrefGrammar : section == "reading" ? hrefReading : hrefListening
      swal({
        title: this.props.pageTexts[34],
        text: this.props.pageTexts[35] + ' ' + examTime + ' ' + this.props.pageTexts[36],
        // title: "Presentar el Examen.",
        // text: "Recuerde que cuenta con " + examTime + " minutos para resolver el examen. Una vez ingrese al examen no podrá salir sin haberlo corregido, en tal caso se le contará como un intento y su nota será CERO.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: this.props.pageTexts[37],
        cancelButtonText: this.props.pageTexts[38]
        // confirmButtonText: "¡Sí. Ir al examen!",
        // cancelButtonText: "¡No! Regresar"
      }).then(() => {
        this.context.router.push(toRoute)
      })
    }
  }

  render() {

    return (

      <div className="sub-level-note col-xs-12 col-md">

        {(() => {
          if (!this.props.userdata.passed && !this.props.isTeacher)
          return (
            <div className="bloqued-big-container">
              <img className="bloqued-big" src="/images/bloquedbig.png"/>
            </div>
          )
        })()}

        <div className="row">
          <div className="head-sub-level col-xs-12">{this.props.subName}</div>
          <div className="exam-types col-xs-12">
            <div className="leyend-item-exam mousePoint" onClick={this.userConfirm.bind(this, "grammar", this.props.userdata.grammar.can_do)}>
              <img src="/images/gramar.png" className="leyend-img"/>
            </div>

            <div className="leyend-item-exam read-color mousePoint" onClick={this.userConfirm.bind(this, "reading", this.props.userdata.reading.can_do)}>
              <img src="/images/read-exam.png" className="leyend-img"/>
            </div>

            <div className="leyend-item-exam audio-color mousePoint" onClick={this.userConfirm.bind(this, "listening", this.props.userdata.listening.can_do)}>
              <img src="/images/audio-exam.png" className="leyend-img"/>
            </div>

            {(() => {
              if (true)
              // if (this.props.sublevelIndex == 1 || this.props.sublevelIndex == 3)
              return (
                <Link to={'/user-area/video-chat/'} className="leyend-item-exam oral-color mousePoint">
                <img src="/images/oral-exam.png" className="leyend-img"/>
              </Link>
            )
          })()}

        </div>
        <div className="exam-notes col-xs-12">
          <div className="exam-note">{this.props.userdata.grammar.note}</div>
          <div className="exam-note">{this.props.userdata.reading.note}</div>
          <div className="exam-note">{this.props.userdata.listening.note}</div>
          {(() => {
            if (true)
            // if (this.props.sublevelIndex == 1 || this.props.sublevelIndex == 3)
            return (
              <div className="exam-note" style={{'borderRight': 0}}>{this.props.userdata.oral_exam}</div>
            )
          })()}
        </div>
        <div className="exam-notes col-xs-12">
          <div className="exam-try">{this.props.userdata.grammar.try}</div>
          <div className="exam-try">{this.props.userdata.reading.try}</div>
          <div className="exam-try">{this.props.userdata.listening.try}</div>
          {(() => {
            if (true)
            // if (this.props.sublevelIndex == 1 || this.props.sublevelIndex == 3)
            return (
              <div className="exam-try" style={{'borderRight': 0}}> ~ </div>
            )
          })()}
        </div>
        <div className="sub-level-evg col-xs-12">
          <div className="exam-note-avg"></div>
          <div className="exam-note-avg"></div>
          {(() => {
            if (true)
            // if (this.props.sublevelIndex == 1 || this.props.sublevelIndex == 3)
            return (
              <div className="exam-note-avg"></div>
            )
          })()}
          <div className="exam-note-avg">{this.props.userdata.total_note}</div>
        </div>
      </div>
    </div>

  )
}
}

SubExamLevelItem.contextTypes = {
  router: React.PropTypes.object
}

export default SubExamLevelItem
