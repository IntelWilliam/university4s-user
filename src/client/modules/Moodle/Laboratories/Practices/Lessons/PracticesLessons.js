import React from 'react'
import Footer from 'src/client/modules/layout/footer'
// import Names from 'src/client/Constants/PagesNames'
import Constants from 'src/client/Constants/Constants'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import LessonsStore from 'src/client/modules/Moodle/Lessons/LessonsStore'
import LessonItem from 'src/client/modules/Moodle/Laboratories/Practices/Lessons/PracticeLessonsItem'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class PracticesLessons extends React.Component {
  constructor() {
    super()
    this.state = {
      allLessons: [],
      pageTexts: []
    }
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("LAB_PRACTICE_LESSONS", (err, body) => {
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

  componentWillMount() {
    this.loadPageTexts()
    this.loadData()
  }

  componentDidMount() {
    this.goTop()
  }

  goTop() {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  }

  loadData() {
    LessonsStore.getOne(this.props.location.query.subLevelId, (err, response) => {
      if (err)
      return
      // se cambia el estado allLessons con los nuevos usuarios
      this.setState({allLessons: response})
    })
  }

  goBack(){
    window.history.back();
  }

  render() {
    let navigationArray = [
      {
        'name': this.state.pageTexts[0],
        // 'name': 'Inicio',
        'url': Constants.ADMIN_PATH + `/user-area/`
      }, {
        'name': this.state.pageTexts[1],
        // 'name': 'Laboratorios',
        'url': null
      }, {
        'name': this.state.pageTexts[2],
        // 'name': 'Prácticas',
        'url': Constants.ADMIN_PATH + `/user-area/practices/`
      }, {
        'name': this.props.location.query.subLevelName,
        'url': null
      }
    ]
    let headerInfo = {
      title: this.state.pageTexts[3],
      translation: this.state.pageTexts[4],
      description: this.state.pageTexts[5]
      // title: Names.LABORATORIES.PRACTICES_LESSONS.TITLE,
      // translation: Names.LABORATORIES.PRACTICES_LESSONS.TRANSLATION,
    }
    let levelName = this.props.location.query.levelName
    let subLevelName = this.props.location.query.subLevelName
    return (
      <div style={{
        background: "#F6F7F7"
      }}>
      <HeaderPage navigation={navigationArray} headerInfo={headerInfo}/>
      <div className="container" style={{
        marginTop: "2em"
      }}>
      <div className="col-xs-12">
        <div className="row">
          <div className="col-xs-12">
            <div className="row">
              <div className="col-xs-12">
                <div className="row">
                  <div className="col-xs-12 text-left title-container title-container-practice">
                    <span className="title-inicial tittle-blue">{levelName}
                      | {subLevelName}</span>
                    </div>
                  </div>
                </div>

                {this.state.allLessons.map((lesson, index) => {
                  return <LessonItem key={index} lessonIndex={index + 1} levelName={levelName} lessonName={lesson.name} lessonId={lesson.code} subLevelName={this.props.location.query.subLevelName} subId={this.props.location.query.subLevelId}/>
                })}

              </div>
            </div>
          </div>
        </div>

        <div className="col-xs-12 action-container">
          <button className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>{this.state.pageTexts[6]}</button>
          {/* <button className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>Volver</button> */}
        </div>

      </div>
      <Footer/>
    </div>
  )
}
}
