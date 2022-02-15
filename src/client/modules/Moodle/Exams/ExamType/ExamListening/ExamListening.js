import React from 'react'
import Constants from 'src/client/Constants/Constants'
import Footer from 'src/client/modules/layout/footer'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import ExamStore from 'src/client/modules/Moodle/Exams/ExamType/ExamStore'
import ExamContainer from 'src/client/modules/Moodle/Exams/ExamType/ExamContainer'
import loading from 'src/client/modules/Chat/Modals/loading'
import accountStore from 'src/client/modules/Moodle/Account/AccountStore'
import UserStore from 'src/client/modules/Moodle/UserData/UserStore'
import ExamNotes from 'src/client/modules/Moodle/Exams/ExamNotes'

export default class ExamListening extends React.Component {
  constructor() {
    super()
    this.state = {
      allExam: [],
      userId: JSON.parse(localStorage.user).userIdDev,
      try: null,
      activeEdit: true,
      answersTrue: 0,
      examInfo: '',
      minutes: 15,
      seconds: 0,
      interval: null,
      isPlay: false,
      muted: true,
      disabledBtn: false
    }
  }

  loadData(){
    let loadingNew = loading.replace(/text-to-load/g, "Verificando")

    swal({
      html: loadingNew,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false
    })

    ExamStore.getOne(this.state.userId, this.props.location.query.section_id, this.props.location.query.subLevelId, this.props.location.query.exam_id, (err, response) => {


      if (err)
      return
      if (response) {
        this.state.interval = setInterval(this.tick.bind(this), 1000);
        swal.close()
        this.setState({ allExam: response.questions, try: response.try, examInfo: response.exam })
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
        title: "Se termino el tiempo!",
        text: "se a agotado el tiempo para terminar el examen.",
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
    this.loadData()
  }

  componentDidMount() {
    this.goTop(0)
  }

  goTop(move) {
    $("html, body").animate({
      scrollTop: move
    }, "slow");
  }

  examScore() {
    this.state.answersTrue++
    // this.setState({
    //     answersTrue: this.state.answersTrue + 1
    // })
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

    console.log('this.state.allExam.length', this.state.allExam.length);
    console.log('this.state.answersTrue', this.state.answersTrue);
    console.log('userId: ', this.state.userId)
    console.log('sectionId: ', this.props.location.query.section_id)
    console.log('subLevelId: ', this.props.location.query.subLevelId)
    console.log('examId: ', this.props.location.query.exam_id)
    console.log('escore: ', score)

    ExamStore.updateExam(this.state.userId, this.props.location.query.exam_id, this.state.try, score, (err, response) => {
      if (err) {
        // console.log("err", err)
        return
      }
      if (response) {
        console.log("response updateExam", response)
      }
    })

    swal({
      title: "Verificando respuestas.",
      type: "warning",
      showConfirmButton: false
    })

    UserStore.getOne(this.state.userId, (err, response) => {
      if (err) return
      // console.log("notas", response);

      var presentExams = 0
      var tries = 0
      var missingOral = false
      var missingOralSubLevel = ''

      for (var property in response) {
        for (var prop in response[property]) {
          let element = response[property][prop]

          if(element.grammar || element.listening || element.reading){
            // si el intento es diferente a 0 ha presentado el examen por lo menos una vez
            if(element.grammar.try != 0 ){
              presentExams  = parseInt(element.grammar.note) >= 70 ? presentExams + 1: presentExams

              // presentExams++
              tries += parseInt(element.grammar.try)
            }
            if(element.listening.try != 0 ){
              presentExams  = parseInt(element.listening.note) >= 70 ? presentExams + 1: presentExams

              // presentExams++
              tries += parseInt(element.listening.try)
            }
            if(element.reading.try != 0 ){
              presentExams  = parseInt(element.reading.note) >= 70 ? presentExams + 1: presentExams

              // presentExams++
              tries += parseInt(element.reading.try)
            }

            // se verifica si solo falta la nota de oral para aprobar el subnivel
            // unicamente en niveles 1 y 3
            if(parseInt(prop) == 1 || parseInt(prop) == 3)  {
              if (element.grammar.try > 0 &&
                element.listening.try > 0 &&
                element.reading.try > 0 &&
                element.oral_exam == 0 &&
                element.total_note < 70 ){
                  missingOral = true;
                  missingOralSubLevel = this.props.location.query.subName
                }
              }

            }

          }

        }

        let approveDifficult = (presentExams / tries) * 100;
        let toSave = {
          approveDifficult,
          missingOral,
          missingOralSubLevel
        }

        accountStore.update(JSON.parse(localStorage.user)._id, toSave, (err, body) => {
          // si llega un error
          if (err) {
            console.log("error", err)
          } else {

            swal({
              title: "Examen terminado.",
              text: "Su calificacion es"+ ' ' + score + "/100",
              type: "warning",
              // confirmButtonColor: "#DD6B55",
              // confirmButtonText: "Regresar"
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonText: 'Aceptar'

            }).then(() => {
              // this.context.router.replace('/user-area/exams/')
            })

            console.log('body', body);
          }
        })

      })

      // Se guardan los datos corresponientes a las notas en la bd en mongo
      // para identificar posibles diferencias con los datos de la bd en mysql
      ExamNotes.getOne(
        this.state.userId,
        this.props.location.query.section_id,
        this.props.location.query.subLevelId,
        this.props.location.query.exam_id,
        this.state.allExam.length,
        this.state.answersTrue,
        score, (err, response) => {
          if (err) {
            // console.log("err",err)
            return
          }
          if (response) {
            console.log("response updateExam",response)
          }
        }
      )

    }

    playAudio() {
      var audio = this.refs.audioPlayer;
      if (this.state.isPlay) {
        audio.play();
        this.setState({ isPlay: false });
      } else {
        audio.pause();
        this.setState({ isPlay: true });
      }
    }

    muteAudio() {
      var audio = this.refs.audioPlayer;
      if (!this.state.muted) {
        audio.muted = false;
        this.setState({ muted: true });
      } else {
        audio.muted = true;
        this.setState({ muted: false });
      }
    }

    render() {
      let navigationArray = [{
        'name': 'Inicio',
        'url': Constants.ADMIN_PATH + `/user-area/`
      }, {
        'name': 'Exámenes',
        'url': Constants.ADMIN_PATH + `/user-area/exams/`
      }, {
        'name': 'comprensión auditiva',
        'url': null
      }, {
        'name': this.props.location.query.subName,
        'url': null
      }]

      let headerInfo = {
        title: 'Comprensión auditiva',
        translation: 'Exámenes',
        description: '',
      }

      let urlAudio = Constants.ADMIN_PATH + `/api/examaudio/` + this.props.location.query.exam_id + `.mp3`
      let playClass = !this.state.isPlay ? "play-images mousePoint" : "play-images mousePoint play-images-active"
      let muteClass = this.state.muted ? "play-images mousePoint" : "play-images mousePoint play-images-active"

      return ( < div style = {
        {
          background: "#F6F7F7"
        }
      } >
      <HeaderPage borderTittle='true' navigation={navigationArray} headerInfo={headerInfo}/> < div className = "container"
      style = {
        {
          marginTop: "2em"
        }
      } >
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
                      <span className="info-title">Tiempo e información</span>
                    </div>
                    <div className="col-xs-12">
                      <p className="info-description">por cada pregunta hay <span className="info-description bold">x </span> alternativas de las cuales podrá elegir solo una como respuesta. </p>
                      <p className="info-description">El tiempo de duración del examen es de <span className="info-description bold">15 minutos </span>, una vez concluido el tiempo se calificará automaticamente.</p>
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
                      <span className="crono-title">Minutes</span>
                    </div>
                    <div className="col-xs-6 center-flex">
                      <span className="crono-title">Second</span>
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
              <div className="exercise-border-dotted">
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
                      <span className="info-title">{this.state.examInfo.a21Nombre}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 play-container">
              <img className={playClass} src="/images/Comprensión-auditiva_0000_PLAY.png" onClick={this.playAudio.bind(this)}/>
              <img className={muteClass} src="/images/Comprensión-auditiva_0001_VOLUMEN.png" onClick={this.muteAudio.bind(this)}/>
              <audio ref="audioPlayer" id="customAudio" className="playExam" src={urlAudio} controls autoPlay></audio>
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

      {
        this.state.allExam.map((item, index) => {
          return <ExamContainer ref={"excercise" + index} examScore={this.examScore.bind(this)} canEdit={this.state.activeEdit} item={item} index={index} key={index}/>
        })
      }

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
                  this.context.router.replace('/user-area/exams/')
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
                Corregir exámen
              </button>
            </div>
          </div>
        </div>
      </div> < /div> < Footer / >
      < /div>
    )
  }
}
ExamListening.contextTypes = {
  router: React.PropTypes.object
}
