import React from 'react'
import Footer from 'src/client/modules/layout/footer'
// import Names from 'src/client/Constants/PagesNames'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import Constants from 'src/client/Constants/Constants'
import LessonsStore from 'src/client/modules/Moodle/Lessons/LessonsStore'
import LessonItem from 'src/client/modules/Moodle/Lessons/LessonsItem'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class MoodleLessons extends React.Component {
  constructor() {
    super()
    this.state = {
      allLessons: [],
      pageTexts: []
    }
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("CURSE_LESSONS", (err, body) => {
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
    let levelName = this.props.location.query.levelName
    let subLevelName = this.props.location.query.subLevelName
    let subId = this.props.location.query.subLevelId

    let navigationArray = [
      {
        'name': this.state.pageTexts[0],
        // 'name': 'Inicio',
        'url': null
      }, {
        'name': this.state.pageTexts[1],
        // 'name': 'Curso',
        'url': Constants.ADMIN_PATH + `/user-area/`
      }, {
        'name': subLevelName,
        'url': null
      }
    ]
    let headerInfo = {
      title: this.state.pageTexts[2],
      translation: this.state.pageTexts[3],
      description: this.state.pageTexts[4],
      // title: Names.MOODLE_LESSONS.TITLE,
      // translation: Names.MOODLE_LESSONS.TRANSLATION,
      // description: '',
    }
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
                    <span className="title-inicial tittle-blue">{levelName} | {subLevelName}</span>
                  </div>
                </div>
              </div>

              {this.state.allLessons.map((lesson, index) => {
                return <LessonItem
                  key={index}
                  levelName={levelName}
                  subId={subId}
                  lastLesson={this.state.allLessons.length}
                  lessonIndex={index + 1}
                  lessonName={lesson.name}
                  lessonId={lesson.code}
                  subLevelName={this.props.location.query.subLevelName}/>
              })}

            </div>
          </div>
        </div>
      </div>
      <div className="col-xs-12 action-container">
        <button className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>{this.state.pageTexts[5]}</button>
        {/* <button className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>Volver</button> */}
      </div>
    </div>

    <Footer/>
  </div>
)
}
}
