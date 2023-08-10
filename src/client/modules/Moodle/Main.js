import React from 'react'
import Footer from 'src/client/modules/layout/footer'
// import Names from 'src/client/Constants/PagesNames'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import LevelsStore from 'src/client/modules/Moodle/Levels/LevelsStore'
import UserStore from 'src/client/modules/Moodle/UserData/UserStore'
import CalendarMini from 'src/client/modules/Moodle/Calendar/CalendarMini/CalendarMini'
import NextEvents from 'src/client/modules/Moodle/NextEvents/NextEvents'
import LevelItem from 'src/client/modules/Moodle/Levels/LevelItem'
import loading from 'src/client/modules/Chat/Modals/loading'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class Lesson extends React.Component {
  constructor() {
    super()
    this.state = {
      allLevels: [],
      userId: JSON.parse(localStorage.user).userIdDev,
      userData: [],
      pageTexts: [],
      isTeacher: false,

      isMsgHide: false
    }

    this.handleMessage = this.handleMessage.bind(this)
  }


  loadPageTexts() {
    FrontTextsActions.getTexts("USER_AREA", (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        // console.log('body.texts', body.texts);
        // se setea el mensaje a mostrar
        this.setState({pageTexts: body.texts})
        // let loadingNew = loading.replace(/text-to-load/g, 'Cargando');
        let loadingNew = loading.replace(/text-to-load/g, body.texts[11]);
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
    $("html, body").animate({scrollTop: 0}, "slow");
  }

  loadDataUser() {
    UserStore.getOne(this.state.userId, (err, response) => {
      if (err) return

      // console.log('response Main.js', response);
      this.setState({
        userData: response,
      })
      this.loadData()
    })
  }

  loadData() {
    LevelsStore.getAll((err, response) => {
      if (err) return
      this.setState({
        allLevels: response,
      })
      swal.close()
    })
  }

  handleMessage() {
    this.setState({
      isMsgHide: !this.state.isMsgHide
    })

    $("#plat-msg").toggle(100);
  }

  render() {
    let navigationArray = [
      {
        'name': this.state.pageTexts[0],
        'url': null
      }, {
        'name': this.state.pageTexts[1],
        'url': null
      }
    ]
    let headerInfo = {
      title: this.state.pageTexts[2],
      translation: this.state.pageTexts[3],
      description: this.state.pageTexts[4]
    }

    return (

      <div style={{
        background: "#F6F7F7"
      }}>
        <HeaderPage navigation={navigationArray} headerInfo={headerInfo}/>


        <div className="container" style={{
          marginTop: "1em"
        }}>

          {/*<div className={"platform-msg"}>*/}
            {/*<p onClick={this.handleMessage} className={'hide-msg-text'}>*/}
              {/*{this.state.isMsgHide? "Mostrar" : "Ocultar"}*/}
              {/*</p>*/}

            {/*<div id={'plat-msg'}>*/}
              {/*<p>Bienvenido a tu portal web Akron English. Aquí encontrarás herramientas de última tecnología que te*/}
                {/*permitirán sacarle el mayor provecho al contenido de tu curso de inglés. Queremos pedirte un favor. Como*/}
                {/*sabrás, todo proceso de mejora conlleva encontrar y solucionar incidentes y es por eso que contamos con*/}
                {/*tu*/}
                {/*ayuda y comprensión para hacernos saber, a través de nuestro correo de contacto o de la sección de*/}
                {/*Consultas/Buzón de consultas, qué podemos mejorar para que tu experiencia sea aún más gratificante.</p>*/}
              {/*<p>De nuevo, bienvenido a tu experiencia actualizada y moderna de aprendizaje del idioma inglés.</p>*/}
              {/*<p>*/}
                {/*<span>Atentamente: Equipo Akron English.</span>*/}
              {/*</p>*/}

            {/*</div>*/}
          {/*</div>*/}


          <div className="col-xs-12 section-name">
            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12">
                  <div className="info-title-section-container">
                    <div className="pdf-icon-container">
                      <img className="pdf-icon" src="/images/studymanual.png"/>
                    </div>
                    <div className="info-title-container">
                      <span className="info-title">{this.state.pageTexts[5]}</span>
                      {/* <span className="info-title">Manual de estudio</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xs-12" style={{
              marginTop: "1em"
            }}>
              <div className="info-title-section-container" style={{
                marginLeft: "2em"
              }}>
                <div className="pdf-icon-container">
                  <img className="pdf-icon" src="/images/pdf.png"/>
                </div>
                <div className="info-title-container">
                  <a className="pdf-link" target={"_blank"}
                     href="https://s3.amazonaws.com/devbooks.ibceducacion.com/new_books_course/gui%CC%81a+de+estudio+(24-11-2017).pdf">
                    {/*<a className="pdf-link" download="Manual de estudio" href="https://image.re-cosmo.com/source/gui%CC%81a%20de%20estudio%20(24-11-2017).pdf">*/}
                    <span className="pdf-title">{this.state.pageTexts[6]}</span>
                    {/* <span className="pdf-title">Descargar manual de estudio</span> */}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12 section-name">
            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12">
                  <div className="info-title-section-container">
                    <div className="pdf-icon-container" style={{
                      height: "2.4em"
                    }}>
                      <img className="pdf-icon" src="/images/course.png"/>
                    </div>
                    <div className="info-title-container">
                      <span className="info-title">{this.state.pageTexts[7]}</span>
                      {/* <span className="info-title">Cursos disponibles</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12">
            <div className="row">
              <div className="col-md-3 col-xs-12">

                <NextEvents/>
                <CalendarMini/>

                <div className="card-next-event col-xs-12">
                  <div className="row">
                    <div className="col-xs-12 header-card header-calendar">
                      <span className="card-next-event-title">{this.state.pageTexts[9]}</span>
                      {/* <span className="card-next-event-title">Navegación</span> */}
                    </div>
                    <div className="col-xs-12 body-card">
                      <div className="col-xs-12">
                        <span className="card-next-event-title-body">{this.state.pageTexts[9]}</span>
                        {/* <span className="card-next-event-title-body">Página principal</span> */}
                      </div>
                      <div className="col-xs-12 navegation-container">
                        <div className="arrow-right-navegation"></div>
                        <span className="navegation-2">{this.state.pageTexts[10]}</span>
                        {/* <span className="navegation-2">Cursos</span> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-9 col-xs-12">

                {this.state.allLevels.map((level, index) => {
                  return <LevelItem
                    key={index}
                    isTeacher={this.state.isTeacher}
                    name={level.name}
                    levelUserData={this.state.userData[level.alias]}
                    id={level.code}
                  />
                })}
              </div>

            </div>
          </div>
        </div>
        <Footer/>
      </div>
    )
  }
}
