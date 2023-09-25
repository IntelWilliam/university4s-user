import React from 'react'
import Footer from 'src/client/modules/layout/footer'
// import Names from 'src/client/Constants/PagesNames'
import Constants from 'src/client/Constants/Constants'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import UserStore from 'src/client/modules/Moodle/UserData/UserStore'
import LevelsStore from 'src/client/modules/Moodle/Levels/LevelsStore'
import ExamLevelItem from 'src/client/modules/Moodle/Exams/ExamLevelItem'
import loading from 'src/client/modules/Chat/Modals/loading'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class Exams extends React.Component {
  constructor() {
    super()
    this.state = {
      allLevels: [],
      userId: JSON.parse(localStorage.user).userIdDev,
      userData: [],
      pageTexts: [],
      isTeacher: false
    }
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("EXAMS", (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        // console.log('body.texts', body.texts);
        // se setea el mensaje a mostrar
        this.setState({pageTexts: body.texts})
        let loadingNew = loading.replace(/text-to-load/g, this.state.pageTexts[29]);
        // let loadingNew = loading.replace(/text-to-load/g, "Cargando");
        swal({
          html: loadingNew,
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: false
        })
      }

    })
  }

  componentWillMount() {
    this.loadPageTexts()
    this.loadDataUser()
    let curUser = JSON.parse(localStorage.user)
    this.setState({
      isTeacher: curUser.role == "teacher" ? true : false,
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

  loadDataUser(){
    UserStore.getOne(this.state.userId, (err, response) => {
      if (err) return
      console.log("notas", response);
      this.loadData()
      this.setState({
        userData: response,
      })
    })
  }

  loadData() {
    LevelsStore.getAll( (err, response) => {
      if (err) return
      this.setState({
        allLevels: response,
      })
      swal.close()
    })
  }

  render() {
    let navigationArray = [
      {
        'name': this.state.pageTexts[0],
        // 'name': 'Inicio',
        'url': Constants.ADMIN_PATH + `/user-area/`
      }, {
        'name': this.state.pageTexts[1],
        // 'name': 'Mis notas',
        'url': null
      }
    ]
    let headerInfo = {
      title: this.state.pageTexts[2],
      // title: Names.EXAMS.TITLE,
    }

    return (

      <div style={{
        background: "#F6F7F7"
      }}>
      <HeaderPage pageTexts={this.state.pageTexts} navigation={navigationArray} headerInfo={headerInfo} headerType="notas"/>
      <div className="container" style={{
        marginTop: "1em"
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
                      <span className="info-title">{this.state.pageTexts[4]}</span>
                      {/* <span className="info-title">Información</span> */}
                    </div>
                    <div className="col-xs-12">
                      <span className="info-description">{this.state.pageTexts[5]}</span>
                      {/* <span className="info-description">Cuando finalice satisfactoriamente todas las evaluaciones de un subnivel, automáticamente se irán desbloqueando las siguientes.</span> */}
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
            <div className="col-xs-12">
              <div className="image-drag-excercise">
                <div className="pdf-icon-container">
                  <img className="pdf-icon" src="/images/leyend.png"/>
                </div>
                <div className="info-title-container">
                  <div className="row">
                    <div className="col-xs-12">
                      <span className="info-title">{this.state.pageTexts[6]}</span>
                      {/* <span className="info-title">Leyenda</span> */}
                    </div>
                    <div className="col-xs-12 leyend-item-container">
                      <div className="row">
                        <div className="leyend-item">
                          <img src="/images/gramar.png" className="leyend-img"/>
                          <span className="leyend-name">{this.state.pageTexts[7]}</span>
                          {/* <span className="leyend-name">Gramática</span> */}
                        </div>
                        <div className="leyend-item read-color">
                          <img src="/images/read-exam.png" className="leyend-img"/>
                          <span className="leyend-name">{this.state.pageTexts[8]}</span>
                          {/* <span className="leyend-name">Compresión lectora</span> */}
                        </div>
                        <div className="leyend-item audio-color">
                          <img src="/images/audio-exam.png" className="leyend-img"/>
                          <span className="leyend-name">{this.state.pageTexts[9]}</span>
                          {/* <span className="leyend-name">Comprensión auditiva</span> */}
                        </div>
                        <div className="leyend-item oral-color">
                          <img src="/images/oral-exam.png" className="leyend-img"/>
                          <span className="leyend-name">{this.state.pageTexts[10]}</span>
                          {/* <span className="leyend-name">Examen oral</span> */}
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
      </div>

      {this.state.allLevels.map((level, index) => {
        return  <ExamLevelItem
          pageTexts={this.state.pageTexts}
          isTeacher={this.state.isTeacher}
          key={index}
          name={level.name}
          levelUserData={this.state.userData[level.alias]}
          id={level.code}
        />
      })}

      <div className="col-xs-12" style={{marginBottom: '4em'}}>
        <div className="row">

          <div className="col-md-5 col-xs-12">
            <div className="row">
              <div className="col-md-12 col-xs-12 card-next-event score-final">

                <div className="col-xs-12">
                  <div className="row">
                    <div className="col-xs-5">
                      <p className="card-next-event-title-body bold">{this.state.pageTexts[16]}</p>
                      {/* <p className="card-next-event-title-body bold">Promedio Final</p> */}
                    </div>
                    <div className="col-xs-7 exercise-border-dotted">
                      <span>&nbsp;</span>
                    </div>
                  </div>
                </div>

                <div className="col-xs-12 note">
                  <span className="card-next-event-title-body">
                    <span className="noteRed">{this.state.userData.final_note}</span>/100</span>
                  </div>

                  <div className="col-xs-12">
                    <div className="row">
                      <div className="col-xs-5">
                        <p className="card-next-event-title-body bold">{this.state.pageTexts[17]}</p>
                        {/* <p className="card-next-event-title-body bold">Promedio por nivel.</p> */}
                      </div>
                      <div className="col-xs-7 exercise-border-dotted">
                        <span>&nbsp;</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xs-12 description">
                    <span className="card-next-event-title-body">{this.state.pageTexts[18]}</span>
                    {/* <span className="card-next-event-title-body">1. Las notas tienen como puntaje máximo 100 puntos.</span> */}
                  </div>
                  <div className="col-xs-12 description">
                    <span className="card-next-event-title-body">{this.state.pageTexts[19]}</span>
                    {/* <span className="card-next-event-title-body">2. Se mostrarán tus notas por tipo de examen (Gramática, Comprensión de lectura, Comprensión auditiva y examen oral). Además podrás ver tus notas promedios por ciclo (Inicial, Fundamental, Operacional), y tu nota final.</span> */}
                  </div>
                  <div className="col-xs-12 description">
                    <span className="card-next-event-title-body">{this.state.pageTexts[20]}</span>
                    {/* <span className="card-next-event-title-body">3. La nota mínima aprobatoria es de 70 puntos.</span> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-7 col-xs-12">
              <div className="row">

                <div className="col-md-6 col-xs-12">
                  <div className="card-next-event col-xs-12">
                    <div className="row">
                      <div className="col-xs-12 header-score100">
                        <span className="card-next-event-title">
                          <div className="leyend-item-score">
                            <img src="/images/icon-checks.png" className="leyend-img-score"/>
                            <span className="leyend-name bold">{this.state.pageTexts[21]}</span>
                            {/* <span className="leyend-name bold">Puntajes sobre 100</span> */}
                          </div>
                        </span>
                      </div>

                      <div className="col-xs-12 body-score">

                        <div className="col-xs-12">
                          <div className="score-over">
                            <span>{this.state.pageTexts[23]}</span>
                            {/* <span>Sobresaliente</span> */}
                            <span className="note">
                              <strong>100</strong>
                            </span>
                          </div>
                        </div>

                        <div className="col-xs-12">
                          <div className="score-over">
                            <span>{this.state.pageTexts[24]}</span>
                            {/* <span>Excelente</span> */}
                            <span className="note">
                              <strong>91-99</strong>
                            </span>
                          </div>
                        </div>
                        <div className="col-xs-12">
                          <div className="score-over">
                            <span>{this.state.pageTexts[25]}</span>
                            {/* <span>Muy Bueno</span> */}
                            <span className="note">
                              <strong>86-90</strong>
                            </span>
                          </div>
                        </div>
                        <div className="col-xs-12">
                          <div className="score-over">
                            <span>{this.state.pageTexts[26]}</span>
                            {/* <span>Bueno</span> */}
                            <span className="note">
                              <strong>81-85</strong>
                            </span>
                          </div>
                        </div>
                        <div className="col-xs-12">
                          <div className="score-over">
                            <span>{this.state.pageTexts[27]}</span>
                            {/* <span>Aprobó</span> */}
                            <span className="note">
                              <strong>70-80</strong>
                            </span>
                          </div>
                        </div>
                        <div className="col-xs-12">
                          <div className="score-over">
                            <span>{this.state.pageTexts[28]}</span>
                            {/* <span>No Aprobó</span> */}
                            <span className="note">
                              <strong>0-69</strong>
                            </span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-xs-12">
                  <div className="card-next-event col-xs-12">
                    <div className="row">
                      <div className="col-xs-12 header-score20">
                        <span className="card-next-event-title">
                          <div className="leyend-item-score">
                            <img src="/images/icon-checks.png" className="leyend-img-score"/>
                            <span className="leyend-name bold">{this.state.pageTexts[22]}</span>
                            {/* <span className="leyend-name bold">Puntajes sobre 20</span> */}
                          </div>
                        </span>
                      </div>

                      <div className="col-xs-12 body-score">

                        <div className="col-xs-12">
                          <div className="score-over">
                            <span>{this.state.pageTexts[23]}</span>
                            {/* <span>Sobresaliente</span> */}
                            <span className="note">
                              <strong>20</strong>
                            </span>
                          </div>
                        </div>

                        <div className="col-xs-12">
                          <div className="score-over">
                            <span>{this.state.pageTexts[24]}</span>
                            {/* <span>Excelente</span> */}
                            <span className="note">
                              <strong>18.50-19.99</strong>
                            </span>
                          </div>
                        </div>
                        <div className="col-xs-12">
                          <div className="score-over">
                            <span>{this.state.pageTexts[25]}</span>
                            {/* <span>Muy Bueno</span> */}
                            <span className="note">
                              <strong>17.50-18.49</strong>
                            </span>
                          </div>
                        </div>
                        <div className="col-xs-12">
                          <div className="score-over">
                            <span>{this.state.pageTexts[26]}</span>
                            {/* <span>Bueno</span> */}
                            <span className="note">
                              <strong>16.50-17.49</strong>
                            </span>
                          </div>
                        </div>
                        <div className="col-xs-12">
                          <div className="score-over">
                            <span>{this.state.pageTexts[27]}</span>
                            {/* <span>Aprobó</span> */}
                            <span className="note">
                              <strong>14-16.49</strong>
                            </span>
                          </div>
                        </div>
                        <div className="col-xs-12">
                          <div className="score-over">
                            <span>{this.state.pageTexts[28]}</span>
                            {/* <span>No Aprobó</span> */}
                            <span className="note">
                              <strong>0-13.99</strong>
                            </span>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
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
