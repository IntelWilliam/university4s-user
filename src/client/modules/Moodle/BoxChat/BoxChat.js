import React from 'react'
import Names from 'src/client/Constants/PagesNames'
import {Link} from 'react-router'
import Footer from 'src/client/modules/layout/footer'
import Constants from 'src/client/Constants/Constants'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
// import BoxChatStore from 'src/client/modules/Moodle/BoxChat/BoxChatStore'
// import loading from 'src/client/modules/Chat/Modals/loading'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'
import Chat from 'src/client/modules/Moodle/BoxChat/Chat/Chat'

class BoxChat extends React.Component {
  constructor() {
    super()
    this.state = {
      userData: [],
      pageTexts: []
    }
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("INQUIRY_BOX", (err, body) => {
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

  componentWillMount() {
    this.loadPageTexts()
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
        // 'name': 'Buzón de consultas',
        'url': null
      }
    ]
    let headerInfo = {
      title: Names.INQUIRYBOX.TITLE,
    }

    const hrefChat = '/user-area/video-chat/'

    return (
      <div style={{
        background: "#F6F7F7"
      }}>
      <HeaderPage pageTexts={this.state.pageTexts} navigation={navigationArray} headerInfo={headerInfo} headerType="consultas" borderTittle="true"/>

      <div className="col-xs-12 learner-data-container">
        <div className="row">

          <div className="col-xs-12 col-sm-7 col-sm-offset-1">
            <div className="row">

              <div className="col-xs-12 account-container">

                <Chat/>

                </div>
              </div>
            </div>

            <div className="col-xs-12 col-sm-3">
              <div className="row">

                <div className="col-xs-12 col-sm-10 col-sm-offset-2">
                  <div className="row">

                    <div className="card-next-event account-container col-xs-12">
                      <div className="row">
                        <div className="col-xs-12 header-card inquiryCard">
                          <span className="card-next-event-title">{this.state.pageTexts[20]}</span>
                          {/* <span className="card-next-event-title">Información</span> */}
                        </div>
                        <div className="col-xs-12 inquiryCard-body">
                          <div className="col-xs-12">
                            <p >{this.state.pageTexts[21]}
                            </p>
                            <p >{this.state.pageTexts[22]}
                            </p>
                            <p >{this.state.pageTexts[23]}
                            </p>
                            {/* <p >La respuesta llegará a su correo electrónico en un plazo de 24 a 48 horas.
                            </p>
                            <p >Aquí puedes reservar una cita para tu examen oral por nivel.
                          </p>
                          <p >También podrás solicitar tus certificados y hacer otras consultas con respecto al programa.
                        </p> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-next-event account-container col-xs-12">
                  <div className="row">
                    <div className="col-xs-12 header-card blue-back">
                      <span className="card-next-event-title">{this.state.pageTexts[24]}</span>
                      {/* <span className="card-next-event-title">Chat en Línea</span> */}
                    </div>

                    <div className="col-xs-12 inquiryCard-body">
                      <div className="col-xs-12">
                        <p >{this.state.pageTexts[25]}&nbsp;
                          {/* <p >Para contactarse con el&nbsp; */}
                          <Link to={hrefChat} style={{
                            'color': '#363cd8',
                            'fontFamily': 'Tofino-Regular'
                          }}>{this.state.pageTexts[26]}
                          {/* }}>Profesor en Línea */}
                        </Link>
                        {this.state.pageTexts[27]}
                        {/* , haga click en el siguiente icono: */}
                      </p>

                      <div className="col-xs-12" style={{
                        'textAlign': 'center'
                      }}>
                      <Link to={hrefChat}>
                        <img src="/images/consultasMini.png"/>
                      </Link>
                    </div>

                    <p >{this.state.pageTexts[28]} &nbsp;
                      {/* <p >Tienes algún problema con la comunicación. &nbsp; */}
                      <Link to={hrefChat} style={{
                        'color': '#363cd8',
                        'fontFamily': 'Tofino-Regular'
                      }}>{this.state.pageTexts[29]}
                      {/* }}>Informanos. */}
                    </Link>
                  </p>
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

BoxChat.contextTypes = {
  router: React.PropTypes.object
}

export default BoxChat
