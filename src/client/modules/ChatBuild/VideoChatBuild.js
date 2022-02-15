import React from 'react'
import Constants from 'src/client/Constants/Constants'
import Footer from 'src/client/modules/layout/footer'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
// import Header from 'src/client/modules/layout/header'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class Help extends React.Component {
  constructor() {
    super()
    this.state = {
      pageTexts: []
    }
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("VIDEO_CHAT", (err, body) => {
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
  }

  componentDidMount() {
    this.goTop()
  }

  goTop() {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  }

  render() {
    let navigationArray = [
      {
        'name': this.state.pageTexts[0],
        // 'name': 'Inicio',
        'url': Constants.ADMIN_PATH + `/user-area/`
      }, {
        'name': this.state.pageTexts[1],
        // 'name': 'Video - Chat',
        'url': null
      }
    ]
    let headerInfo = {
      title: this.state.pageTexts[2],
      description: this.state.pageTexts[4],
      // title: "Video - Chat",
      // description: 'Sitio en construcción',
    }

    return (
      <div style={{
        background: "#F6F7F7"
      }}>
      {/*<Header />*/}

      <HeaderPage navigation={navigationArray} headerInfo={headerInfo} borderTittle="true"/>
      <div className="container" style={{
        marginTop: "1em"
      }}>

      <div className="col-xs-10 col-xs-offset-1 learner-data-container">
        <div className="row">

          <div className="col-xs-12">
            <div className="row">
              <div className="col-xs-12">
                <div className="info-title-section-container" style={{
                  marginTop: "2em"
                }}>
                <div className="pdf-icon-container">
                  <img className="pdf-icon" src="/images/icono_preguntas.png"/>
                </div>
                <div className="info-title-container">
                  <span className="info-title">{this.state.pageTexts[5]}</span>
                  {/* <span className="info-title">Welcome! - ¡Bienvenido!</span> */}
                </div>
              </div>
            </div>

            <div className="col-xs-12 marginHelp">
              <div className="row">
                <div className="col-xs-12">
                  <div className="exercise-border">
                    <span>&nbsp;</span>
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

                <div className="col-xs-11">
                  <div className="row">
                    <div className="title-container helpColor" style={{
                      'paddingLeft': 0
                    }}>
                    <p className="description-exercise">{this.state.pageTexts[6]}</p>
                    {/* <p className="description-exercise">Durante todo su proceso de aprendizaje, usted contará con el servicio de tutoría virtual disponible las 24 horas del día. Todos nuestros tutores están capacitados para resolver cualquier duda con respecto a su curso de inglés en el momento que usted desee. Recuerde que todos los exámenes orales se rinden a través de este medio.</p> */}

                    {/* <p className="description-exercise">La formación online o e-learning que <span className="bold">AKRON ENGLISH </span> presenta consta de un método innovador enfocado en desarrollar en el alumno las cuatro habilidades lingüísticas del idioma inglés: saber escuchar, saber hablar, saber leer y saber escribir.</p>
                    <p className="description-exercise">Nuestro programa es una llave de acceso a la superación profesional que tanto se anhela conseguir en un mundo globalizado como en el que vivimos. </p>
                    <p className="description-exercise">Por eso lo invitamos a dominar el idioma inglés con nosotros y la ayuda de nuestro tutor en línea que se encuentran vía Skype. El correo es: </p>

                    <p className="description-exercise"> <img className="icon-up" src="/images/skype-icon.png"></img> <span>tutor_akron1@hotmail.com</span></p>

                    <p className="description-exercise">¡Gracias por darse la oportunidad de crecer con nosotros! </p> */}

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
