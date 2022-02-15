import React from 'react'
import Footer from 'src/client/modules/layout/footer'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import Constants from 'src/client/Constants/Constants'
import ExerciseStore from 'src/client/modules/Moodle/Laboratories/Practices/Lessons/Exercises/ExerciseStore'
import ExerciseItem from 'src/client/modules/Moodle/Laboratories/Practices/Lessons/Exercises/ExerciseItem'
import PracticeStore from 'src/client/modules/Moodle/Laboratories/Practices/PracticeStore'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class Exercise extends React.Component {

  constructor() {
    super()
    this.state = {
      allExercise: [],
      pageTexts: []
    }
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("LAB_PRACTICE_LESSON_EXERSICE", (err, body) => {
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

  componentDidMount() {
    this.goTop()
  }

  goTop() {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  }

  saveLabAcces(){

    let exerType = 'Completar oracion'

    if(this.props.location.query.lessonType == 2){
      exerType = 'Marcar oracion'
    }else if(this.props.location.query.lessonType == 3){
      exerType = 'Ordenar oracion'
    }

    let levelName = this.props.location.query.levelName
    let sublevelIndex = this.props.location.query.subLevelName.split(" ")

    let data ={
      type: 2,
      videoName: exerType + ' - ' + this.props.location.query.subLevelName + ' - Lección ' + this.props.location.query.lessonIndex,
      userId : JSON.parse(localStorage.user)._id,

      category: this.props.location.query.lessonType,
      nivel: levelName == "Inicial" ? 1 : levelName == "Fundamental"? 2 : levelName == "Operacional"? 3 : undefined,
      sublevel: sublevelIndex[sublevelIndex.length - 1],
      lesson: this.props.location.query.lessonIndex,

      userName : JSON.parse(localStorage.user).name,
      userLastName : JSON.parse(localStorage.user).lastname,
      userEmail : JSON.parse(localStorage.user).email
    }

    PracticeStore.addAccess(data, (err, response) => {
      if (err){
        console.log('err', err);
        return
      }
      console.log('resp', response);
    })
  }


  componentWillMount() {
    // se cargan los datos
    this.loadPageTexts()
    this.loadData()
    this.saveLabAcces()
  }

  loadData() {
    ExerciseStore.getAll(this.props.location.query.lessonId, this.props.location.query.lessonType, (err, response) => {
      if (err)
      return
      this.setState({allExercise: response})
    })
  }

  goBack(){
    window.history.back();
  }

  render() {
    let lessonType = 'Completar oraciones'

    if (this.props.location.query.lessonType == 2) {
      lessonType = 'Marcar respuesta'
    } else if (this.props.location.query.lessonType == 3)
    lessonType = 'Ordenar oraciones'

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
        'name': lessonType,
        'url': null
      }
    ]
    let headerInfo = {
      title: this.props.location.query.lessonName,
      translation: lessonType,
    }
    return (
      <div style={{
        background: "#F6F7F7"
      }}>
      <HeaderPage  pageTexts={this.state.pageTexts} navigation={navigationArray} headerInfo={headerInfo} headerType="PracticeExercise" />
      <div className="container" style={{
        marginTop: "2em"
      }}>
      <div className="col-xs-12">
        <div className="row">
          <div className="col-xs-12">
            <div className="row">

              {this.state.allExercise.map((exercise, index) => {
                return <ExerciseItem
                  key={index}
                  practiceIndex={index + 1}
                  levelName={this.props.location.query.levelName}
                  subLevelName={this.props.location.query.subLevelName}
                  subLevelId={this.props.location.query.subLevelId}
                  lessonName={this.props.location.query.lessonName}
                  lessonId={this.props.location.query.lessonId}
                  lessonType={this.props.location.query.lessonType}
                  lessonIndex={this.props.location.query.lessonIndex}
                  exerciseName={exercise.name}
                  lengthOfExer={this.state.allExercise.length}
                  exerciseId={index + 1}/>
                })}

              </div>
            </div>
          </div>
        </div>
        <div className="col-xs-12 action-container">
          <button className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>Volver</button>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
}
