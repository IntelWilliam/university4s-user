import React from 'react'
import Constants from 'src/client/Constants/Constants'
import Footer from 'src/client/modules/layout/footer'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import SimulationStore from 'src/client/modules/Moodle/Simulation/SimulationType/SimulationStore'
import ExamContainer from 'src/client/modules/Moodle/Exams/ExamType/ExamContainer'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class ExamListening extends React.Component {
  constructor() {
    super()
    this.state = {
      allExam: [],
      activeEdit: true,
      answersTrue: 0,
      examInfo: '',
      minutes: 15,
      seconds: 0,
      interval: null,
      isPlay: false,
      muted: true,
      pageTexts: [],
      disabledBtn: false
    }
  }

  loadPageTexts() {
    FrontTextsActions.getTexts("SIM_LISTEN", (err, body) => {
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


  loadData() {
    SimulationStore.getOne(this.props.location.query.sectionId, this.props.location.query.subLevelId, (err, response) => {
      if (err)
        return
      if (response) {
        this.setState({allExam: response.questions, examInfo: response})
      }
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  tick() {
    if (this.state.minutes <= 0 && this.state.seconds <= 0) {
      clearInterval(this.state.interval);
      swal({
        type: "warning",
        allowEscapeKey: false,
        title: this.state.pageTexts[11],
        text: this.state.pageTexts[12],
        // title: "Se termino el tiempo!",
        // text: "se a agotado el tiempo para terminar el examen.",
        timer: 5000,
        showConfirmButton: false
      });
      setTimeout(() => {
        this.checkExcercises()
      }, 5300)
    } else {
      if (this.state.seconds <= 0) {
        this.setState({
          seconds: 59,
          minutes: this.state.minutes - 1
        });
      } else {
        this.setState({
          seconds: this.state.seconds - 1
        });
      }
    }
  }

  componentWillMount() {
    this.loadPageTexts()
    this.loadData()
  }

  componentDidMount() {
    this.state.interval = setInterval(this.tick.bind(this), 1000);
    this.goTop(0)
  }

  goTop(move) {
    $("html, body").animate({
      scrollTop: move
    }, "slow");
  }

  examScore() {
    this.state.answersTrue++
  }

  checkExcercises() {

    this.setState({
      disabledBtn: true
    })

    for (let index in this.refs) {
      if (index != "audioPlayer")
        this.refs[index].checkAnswer()
    }

    let score = (100 / this.state.allExam.length) * this.state.answersTrue;

    swal({
      title: this.state.pageTexts[13],
      text: this.state.pageTexts[14] + ' ' + score + "/100",
      // title: "Simulación terminada.",
      // text: "Su calificacion es " + score + "/100",
      type: "warning",
      // confirmButtonColor: "#DD6B55",
      // confirmButtonText: this.state.pageTexts[15]
      // confirmButtonText: "Regresar"
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Aceptar'

    }).then(() => {
      // this.context.router.push('/user-area/simulation/?sectionId=3&sectionName=Comprensión Auditiva')
    })
  }

  playAudio() {
    var audio = this.refs.audioPlayer;
    if (this.state.isPlay) {
      audio.play();
      this.setState({isPlay: false});
    } else {
      audio.pause();
      this.setState({isPlay: true});
    }
  }

  muteAudio() {
    var audio = this.refs.audioPlayer;
    if (!this.state.muted) {
      audio.muted = false;
      this.setState({muted: true});
    } else {
      audio.muted = true;
      this.setState({muted: false});
    }
  }

  render() {
    let navigationArray = [
      {
        'name': this.state.pageTexts[0],
        // 'name': 'Inicio',
        'url': Constants.ADMIN_PATH + `/user-area/`
      }, {
        'name': this.state.pageTexts[1],
        // 'name': 'Simulador',
        'url': Constants.ADMIN_PATH + `/user-area/simulation/?sectionId=3&sectionName=Comprensión Auditiva`
      }, {
        'name': this.state.pageTexts[2],
        // 'name': 'comprensión auditiva',
        'url': null
      }, {
        'name': this.props.location.query.subName,
        'url': null
      }
    ]

    let headerInfo = {
      title: this.state.pageTexts[3],
      translation: this.state.pageTexts[4],
      description: this.state.pageTexts[5],
      // title: 'Simulador',
      // translation: 'comprensión auditiva',
      // description: '',
    }

    let urlAudio = Constants.ADMIN_PATH + `/api/simulationaudio/` + this.state.examInfo.a20Codigo + `.mp3`
    let playClass = !this.state.isPlay ? "play-images mousePoint" : "play-images mousePoint play-images-active"
    let muteClass = this.state.muted ? "play-images mousePoint" : "play-images mousePoint play-images-active"

    return (
      <div style={{
        background: "#F6F7F7"
      }}>
        <HeaderPage borderTittle='true' navigation={navigationArray} headerInfo={headerInfo}/>
        <div className="container" style={{
          marginTop: "2em"
        }}>
          <div className="col-xs-12 section-name">

            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-md">
                  <div className="image-drag-excercise">
                    <div className="pdf-icon-container">
                      <img className="pdf-icon" src="/images/clock.png"/>
                    </div>
                    <div className="info-title-container">
                      <div className="row">
                        <div className="col-xs-12">
                          <span className="info-title">{this.state.pageTexts[6]}</span>
                          {/* <span className="info-title">Tiempo e información</span> */}
                        </div>
                        <div className="col-xs-12">
                          <span className="info-description">{this.state.pageTexts[7]}</span>
                          {/* <span className="info-description">por cada pregunta hay x alternativas de las cuales podrá elegir solo una como respuesta. El tiempo de duración de la simulación es de 15 minutos, una vez concluido el tiempo se calificará automaticamente.</span> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 col-xs-12">
                  <div className="row">
                    <div className="col-xs-12">
                      <div className="row">
                        <div className="col-xs-6 center-flex">
                          <span className="crono-title">{this.state.pageTexts[8]}</span>
                          {/* <span className="crono-title">Minutes</span> */}
                        </div>
                        <div className="col-xs-6 center-flex">
                          <span className="crono-title">{this.state.pageTexts[9]}</span>
                          {/* <span className="crono-title">Second</span> */}
                        </div>
                      </div>
                    </div>
                    <div className="col-xs-12">
                      <div className="row">
                        <div className="col-xs-6">
                          <div className="row">
                            <div className="col-xs-6 center-flex">
                              <span className="crono-number-container">{parseInt(this.state.minutes / 10)}</span>
                            </div>
                            <div className="col-xs-6 center-flex">
                              <span className="crono-number-container">{this.state.minutes % 10}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-xs-6">
                          <div className="row">
                            <div className="col-xs-6 center-flex">
                              <span className="crono-number-container">{parseInt(this.state.seconds / 10)}</span>
                            </div>
                            <div className="col-xs-6 center-flex">
                              <span className="crono-number-container">{this.state.seconds % 10}</span>
                            </div>
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
                  <div className="exercise-border">
                    <span>&nbsp;</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-md">
                  <div className="image-drag-excercise">
                    <div className="pdf-icon-container">
                      <img className="pdf-icon" src="/images/exam-listening.png"/>
                    </div>
                    <div className="info-title-container">
                      <div className="row">
                        <div className="col-xs-12">
                          <span className="info-title">{this.state.examInfo.a20Enunciado}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 play-container">
                  <img className={playClass} src="/images/Comprensión-auditiva_0000_PLAY.png"
                       onClick={this.playAudio.bind(this)}/>
                  <img className={muteClass} src="/images/Comprensión-auditiva_0001_VOLUMEN.png"
                       onClick={this.muteAudio.bind(this)}/>
                  <audio ref="audioPlayer" id="customAudio" className="playExam" src={urlAudio} controls
                         autoPlay></audio>
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

          {this.state.allExam.map((item, index) => {
            return <ExamContainer ref={"excercise" + index} examScore={this.examScore.bind(this)}
                                  canEdit={this.state.activeEdit} item={item} index={index} key={index}/>
          })}

          <div className="col-xs-12 section-name">
            <div className="col-xs-12">
              <div className="row">

                <div className="col-xs-9 action-container">
                  <button
                    className={!this.state.disabledBtn ?
                      'solution-button back-button-disabled'
                      : 'solution-button back-button'}
                    // className="solution-button back-button"
                    onClick={() => {
                      this.context.router.replace('/user-area/simulation/?sectionId=3&sectionName=Comprensión Auditiva')
                    }}
                    disabled={!this.state.disabledBtn}
                    style={!this.state.disabledBtn ?
                      {cursor: 'no-drop'}
                      : {cursor: 'pointer'}}
                  >Volver
                  </button>
                </div>

                <div className="col-xs-3 action-container">
                  <button className="next-button"
                          disabled={this.state.disabledBtn}
                          style={this.state.disabledBtn?
                            { background: 'rgba(54, 224, 138, 0.3)', cursor: 'no-drop' }
                            : {cursor: 'pointer'} }
                          onClick={this.checkExcercises.bind(this)}>
                    {this.state.pageTexts[10]}
                  </button>
                  {/* <button className="next-button mousePoint" onClick={this.checkExcercises.bind(this)}>Terminar Simulación</button> */}
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
ExamListening.contextTypes = {
  router: React.PropTypes.object
}
