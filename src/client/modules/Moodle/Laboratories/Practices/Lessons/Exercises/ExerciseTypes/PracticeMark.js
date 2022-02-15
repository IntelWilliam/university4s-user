import React from 'react'
import {Link} from 'react-router'
import Footer from 'src/client/modules/layout/footer'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import Constants from 'src/client/Constants/Constants'
import PracticeDetailStore from 'src/client/modules/Moodle/Laboratories/Practices/Lessons/Exercises/ExerciseTypes/PracticeDetailStore'
import MarkContainer from 'src/client/modules/Moodle/Laboratories/Practices/Lessons/Exercises/ExerciseTypes/PracticeMark/MarkContainer'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class PracticeMark extends React.Component {
  constructor() {
    super()
    this.state = {
      allExercise: [],
      answersTrue: 0,
      showError: '',
      showCongratulate: '',
      currentCongratulate: "very-good",
      congratulateWords: ["very-good", "well-done", "excellent-job", "congratulations", "you-could-do-it"],
      pageTexts: []
    }
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("LAB_PRACTICE_EXERSICE_MARK", (err, body) => {
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


  componentDidUpdate(prevProps) {
    // respond to parameter change in scenario 3
    let oldId = prevProps.location.query.exerciseId
    let newId = this.props.location.query.exerciseId
    if (newId !== oldId) {
      this.goTop(0)
      this.setState({allExercise: []})
      this.loadData()
    }
  }

  componentDidMount() {
    this.goTop(0)
  }

  toCongratulate() {
    let currentCongratulate = this.state.congratulateWords[Math.floor(Math.random() * this.state.congratulateWords.length)];
    this.setState({currentCongratulate: currentCongratulate, showCongratulate: "show-congratulate", showError: ""})
    setTimeout(this.hideCongratulate.bind(this, null), 3000);
  }

  hideCongratulate() {
    this.setState({showCongratulate: ""})
  }

  toError() {
    this.setState({showError: "show-congratulate", showCongratulate: ""})
    setTimeout(this.hideError.bind(this, null), 3000);
  }

  hideError() {
    this.setState({showError: ""})
  }

  goTop(move) {
    $("html, body").animate({
      scrollTop: move
    }, "slow");
  }

  componentWillMount() {
    this.loadPageTexts()
    // se cargan los datos
    this.loadData()
  }

  loadData() {

    //se debe hacer este cambio debido a que en dev 2 es para mark y 3 para ordenar
    // let parseType = this.props.location.query.lessonType == 2
    // ? 3
    // : this.props.location.query.lessonType == 3
    // ? 2
    // : this.props.location.query.lessonType

    let parseType = this.props.location.query.lessonType

    PracticeDetailStore.getOne(this.props.location.query.lessonId, parseType, this.props.location.query.exerciseId, (err, response) => {
      if (err)
      return
      if (response) {
        //   console.log("response", response);
        response.questions.map((exercise) => {
          exercise.userAnswer = null
          exercise.correct = null
        })
        this.setState({allExercise: response.questions})
      }
    })
  }

  practiceScore() {
    // this.setState({ answersTrue: this.state.answersTrue + 1 })
    this.state.answersTrue++
  }

  checkExcercises() {
    this.goTop(window.innerHeight)
    let practiceLength = 0;
    this.state.answersTrue = 0;
    for (let index in this.refs) {
      this.refs[index].checkAnswer()
      practiceLength++
    }

    let tempScore = (100 / practiceLength) * this.state.answersTrue
    if (tempScore >= 60)
    this.toCongratulate()
    else
    this.toError()

  }

  goBack() {
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
        'url': Constants.ADMIN_PATH + `/user-area/practices/lessons/?levelName=${this.props.location.query.levelName}&subLevelName=${this.props.location.query.subLevelName}&subLevelId=${this.props.location.query.subLevelId}`
      }, {
        'name': this.props.location.query.lessonName,
        'url': Constants.ADMIN_PATH + `/user-area/practices/lessons/Lesson/?levelName=${this.props.location.query.levelName}&subLevelName=${this.props.location.query.subLevelName}&subLevelId=${this.props.location.query.subLevelId}&lessonName=${this.props.location.query.lessonName}&lessonId=${this.props.location.query.lessonId}&lessonIndex=${this.props.location.query.lessonIndex}`
      }, {
        'name': 'Excercises',
        'url': Constants.ADMIN_PATH + `/user-area/practices/lessons/exercise/?levelName=${this.props.location.query.levelName}&subLevelName=${this.props.location.query.subLevelName}&subLevelId=${this.props.location.query.subLevelId}&lessonName=${this.props.location.query.lessonName}&lessonId=${this.props.location.query.lessonId}&lessonType=${this.props.location.query.lessonType}&lessonIndex=${this.props.location.query.lessonIndex}`
      }
    ]
    let headerInfo = {
      title: this.state.pageTexts[3],
      // title: 'Marcar la respuesta',
      translation: this.props.location.query.lessonName + ' - ' + this.state.pageTexts[4] + this.props.location.query.exerciseId,
      description: this.state.pageTexts[5]
      // description: 'Marca la respuesta correcta.'
    }
    let nextExerId = this.props.location.query.exerciseId;
    nextExerId = parseInt(nextExerId) + 1;

    let next = null
    if (this.props.location.query.exerciseId < this.props.location.query.lengthOfExer) {
      next = Constants.ADMIN_PATH + `/user-area/practices/lessons/practice-mark/?levelName=${this.props.location.query.levelName}&subLevelName=${this.props.location.query.subLevelName}&subLevelId=${this.props.location.query.subLevelId}&lessonName=${this.props.location.query.lessonName}&lessonId=${this.props.location.query.lessonId}&lessonType=${this.props.location.query.lessonType}&lessonIndex=${this.props.location.query.lessonIndex}&exerciseId=${nextExerId}&lengthOfExer=${this.props.location.query.lengthOfExer}`
    }

    return (
      <div style={{
        background: "#F6F7F7"
      }}>
      <HeaderPage nextButton={next} pageTexts={this.state.pageTexts}  navigation={navigationArray} headerInfo={headerInfo} borderTittle='true'/>
      <div className="container" style={{
        marginTop: "2em"
      }}>
      <div className="col-xs-12 section-name">
        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12">
              <div className="image-drag-excercise">
                <div className="pdf-icon-container">
                  <img className="pdf-icon" src="/images/objetive.png"/>
                </div>
                <div className="info-title-container">
                  <div className="row">
                    <div className="col-xs-12">
                      <span className="info-title">{this.state.pageTexts[7]} {this.props.location.query.lessonName}</span>
                      {/* <span className="info-title">Objetivo - {this.props.location.query.lessonName}</span> */}
                    </div>
                    <div className="col-xs-12">
                      <span className="info-description">{this.state.pageTexts[8]}</span>
                      {/* <span className="info-description">To check spelling and comprehension of unknown words using the alphabet.</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12">
              <div className="exercise-border-dotted">
                <span>&nbsp;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xs-12">
        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12">
                  <span className="info-title-complete">{this.props.location.query.levelName}
                    / {this.props.location.query.subLevelName}
                    / Lección {this.props.location.query.lessonIndex}
                    / Marcar la respuesta | Ejercicio {this.props.location.query.exerciseId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.state.allExercise.map((exercise, index) => {
          return <MarkContainer ref={"excercise" + index} practiceScore={this.practiceScore.bind(this)} exercise={exercise} index={index} key={index}/>
        })}

        <div className="col-xs-12 section-name">
          <div className="col-xs-12">
            <div className="row">

              <div className="col-xs-6">
                <button style={{
                  background: '#ff4d4d'
                }} onClick={this.goBack.bind(this)} type="button" className="solution-button mousePoint">{this.state.pageTexts[9]}</button>
                {/* }} onClick={this.goBack.bind(this)} type="button" className="solution-button mousePoint">Volver</button> */}
              </div>

              {(() => {
                if (next) {
                  return (
                    <Link to={next} className="col-xs-3">
                      <button className="solution-button mousePoint" style={{
                        background: '#008BFF'
                      }} type="submit">{this.state.pageTexts[10]}</button>
                      {/* }} type="submit">Siguiente ejercicio</button> */}
                    </Link>
                  )
                } else {
                  let back = Constants.ADMIN_PATH + `/user-area/practices/lessons/exercise/?levelName=${this.props.location.query.levelName}&subLevelName=${this.props.location.query.subLevelName}&subLevelId=${this.props.location.query.subLevelId}&lessonName=${this.props.location.query.lessonName}&lessonId=${this.props.location.query.lessonId}&lessonType=${this.props.location.query.lessonType}&lessonIndex=${this.props.location.query.lessonIndex}`
                  return (
                    <Link to={back} className="col-xs-3">
                      <button className="solution-button mousePoint" style={{
                        background: '#008BFF'
                      }} type="submit">{this.props.location.query.lessonName}
                      - Exercises
                    </button>
                  </Link>
                )
              }
            })()}

            <div className="col-xs-3 action-container">
              <button className="solution-button mousePoint" onClick={this.checkExcercises.bind(this)}>{this.state.pageTexts[11]}</button>
              {/* <button className="solution-button mousePoint" onClick={this.checkExcercises.bind(this)}>Solución</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    <div className={"to-congratulate " + this.state.showCongratulate}>
      <div className="col-xs-12 congrat-image">
        <img className="to-congratulate-img" src={"/images/" + this.state.currentCongratulate + ".png"}/>
      </div>
    </div>
    <div className={"to-congratulate " + this.state.showError}>
      <div className="col-xs-12 congrat-image">
        <img className="to-congratulate-img" src={"/images/identifica-la-palabra.png"}/>
      </div>
    </div>

  </div>
)
}
}
