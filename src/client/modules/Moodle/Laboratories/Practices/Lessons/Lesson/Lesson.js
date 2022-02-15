import React from 'react'
import {Link} from 'react-router'
import Footer from 'src/client/modules/layout/footer'
import Constants from 'src/client/Constants/Constants'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import LessonStore from 'src/client/modules/Moodle/Lessons/Lesson/LessonStore'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class PracticesLessons extends React.Component {
  constructor() {
    super()
    this.state = {
      images: [],
      pageTexts: []
    }
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("LAB_PRACTICE_LESSON", (err, body) => {
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

  componentWillMount() {
    this.loadPageTexts()
    this.loadImageData()
  }

  loadImageData() {
    LessonStore.getImage(this.props.location.query.lessonId, (err, response) => {
      if (err)
      return err
      // se cambia el estado allLessons con los nuevos usuarios
      this.setState({images: response})
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
        'url': Constants.ADMIN_PATH + `/user-area/practices/lessons/?levelName=${this.props.location.query.levelName}&subLevelName=${this.props.location.query.subLevelName}&subLevelId=${this.props.location.query.subLevelId}`

      }, {
        'name': this.props.location.query.lessonName,
        'url': null
      }
    ]
    let headerInfo = {
      title: this.props.location.query.lessonName,
    }

    let hrefComplet = Constants.ADMIN_PATH + `/user-area/practices/lessons/exercise/?levelName=${this.props.location.query.levelName}&subLevelName=${this.props.location.query.subLevelName}&subLevelId=${this.props.location.query.subLevelId}&lessonName=${this.props.location.query.lessonName}&lessonId=${this.props.location.query.lessonId}&lessonType=1&lessonIndex=${this.props.location.query.lessonIndex}`
    let hrefOrd = Constants.ADMIN_PATH + `/user-area/practices/lessons/exercise/?levelName=${this.props.location.query.levelName}&subLevelName=${this.props.location.query.subLevelName}&subLevelId=${this.props.location.query.subLevelId}&lessonName=${this.props.location.query.lessonName}&lessonId=${this.props.location.query.lessonId}&lessonType=3&lessonIndex=${this.props.location.query.lessonIndex}`
    let hrefMark = Constants.ADMIN_PATH + `/user-area/practices/lessons/exercise/?levelName=${this.props.location.query.levelName}&subLevelName=${this.props.location.query.subLevelName}&subLevelId=${this.props.location.query.subLevelId}&lessonName=${this.props.location.query.lessonName}&lessonId=${this.props.location.query.lessonId}&lessonType=2&lessonIndex=${this.props.location.query.lessonIndex}`

    return (
      <div style={{
        background: "#F6F7F7"
      }}>
      <HeaderPage pageTexts={this.state.pageTexts} borderTittle='true' navigation={navigationArray} headerInfo={headerInfo} headerType={'PracticeLesson'}/>
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
                      <span className="info-title">{this.state.pageTexts[11]} {this.props.location.query.lessonName}</span>
                      {/* <span className="info-title">Objetivo - {this.props.location.query.lessonName}</span> */}
                    </div>
                    <div className="col-xs-12">
                      <span className="info-description">{this.state.pageTexts[12]}</span>
                      {/* <span className="info-description">To check spelling and comprehension of unknown words using the alphabet.</span> */}
                    </div>
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
            <div className="row">
              <div className="col-xs-12 col-md-4 col-sm-6 card-container practices-types">
                <Link to={hrefComplet}>
                  <div className="card">
                    <div className="image-container">
                      <img src="/images/completar.png"/>
                    </div>
                    <div className="card-text-container practices-title-card">
                      <div className="row">
                        <div className="col-xs-12">
                          <div className="header-navigation">
                            <span className="navgation-item practices-navigation practices-navigation-item">
                              {this.props.location.query.subLevelName}
                            </span>
                            <span className="row-navigation navgation-item practices-navigation practices-navigation-item">
                              Lección {this.props.location.query.lessonIndex}
                            </span>
                          </div>
                        </div>
                        <div className="col-xs-12">
                          <span className="card-text-title practices-navigation">
                            {this.state.pageTexts[13]}
                            {/* Completar oraciones */}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-xs-12 col-md-4 col-sm-6 card-container practices-types">
                <Link to={hrefOrd}>
                  <div className="card">
                    <div className="image-container">
                      <img src="/images/ordenar.png"/>
                    </div>
                    <div className="card-text-container practices-title-card">
                      <div className="row">
                        <div className="col-xs-12">
                          <div className="header-navigation">
                            <span className="navgation-item practices-navigation practices-navigation-item">
                              {this.props.location.query.subLevelName}
                            </span>
                            <span className="row-navigation navgation-item practices-navigation practices-navigation-item">
                              Lección {this.props.location.query.lessonIndex}
                            </span>
                          </div>
                        </div>
                        <div className="col-xs-12">
                          <span className="card-text-title practices-navigation">
                            {this.state.pageTexts[14]}
                            {/* Ordenar oraciones */}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-xs-12 col-md-4 col-sm-6 card-container practices-types">
                <Link to={hrefMark}>
                  <div className="card">
                    <div className="image-container">
                      <img src="/images/marcar.png"/>
                    </div>
                    <div className="card-text-container practices-title-card">
                      <div className="row">
                        <div className="col-xs-12">
                          <div className="header-navigation">
                            <span className="navgation-item practices-navigation practices-navigation-item">
                              {this.props.location.query.subLevelName}
                            </span>
                            <span className="row-navigation navgation-item practices-navigation practices-navigation-item">
                              Lección {this.props.location.query.lessonIndex}
                            </span>
                          </div>
                        </div>
                        <div className="col-xs-12">
                          <span className="card-text-title practices-navigation">
                            {this.state.pageTexts[15]}
                            {/* Marcar respuesta */}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{paddingRight: '2em'}} className="col-xs-12 action-container">
        <button  className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>{this.state.pageTexts[16]}</button>
        {/* <button  className="solution-button mousePoint back-button" onClick={this.goBack.bind(this)}>Volver</button> */}
      </div>


    </div>
    <Footer/>
  </div>
)
}
}
