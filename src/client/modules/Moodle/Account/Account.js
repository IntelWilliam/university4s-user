import React from 'react'
// import Names from 'src/client/Constants/PagesNames'
import Footer from 'src/client/modules/layout/footer'
import Constants from 'src/client/Constants/Constants'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import EditProfile from 'src/client/modules/Moodle/Account/EditProfile'
import EditPassword from 'src/client/modules/Moodle/Account/EditPassword'
import loginUser from 'src/client/modules/Login/'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

export default class Account extends React.Component {
  constructor() {
    super()
    this.state = {
      editMode: true,
      pageTexts: []
      // editMode: true "profile" - "false" password
    }
  }

  loadPageTexts(){
    FrontTextsActions.getTexts("PROFILE", (err, body) => {
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

  changeMode(mode) {
    this.setState({ editMode: mode })
  }

  componentDidMount() {
    this.goTop()
  }

  goTop() {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  }

  logOut() {

    swal({
      title: this.state.pageTexts[36],
      text: this.state.pageTexts[37],
      // title: "Confirmar.",
      // text: "¿Desea cerrar sesión?",
      confirmButtonColor: "#DD6B55",
      confirmButtonText: this.state.pageTexts[38],
      cancelButtonText: this.state.pageTexts[39],
      // confirmButtonText: "Continuar",
      // cancelButtonText: "Cancelar",
      showCancelButton: true,
      type: "warning",
    }).then(() => {
      loginUser.logout((err, resp) => {
        this.context.router.push('/');
        console.log(resp);
      })
    }).catch(e => {
      console.log(e);
    });

  }

  render() {
    let navigationArray = [
      {
        'name': this.state.pageTexts[0],
        // 'name': 'Inicio',
        'url': Constants.ADMIN_PATH + `/user-area/`
      }, {
        'name': this.state.pageTexts[1],
        // 'name': 'Mi perfil',
        'url': null
      }
    ]
    let headerInfo = {
      title: this.state.pageTexts[2],
      // title: Names.ACOUNT.TITLE,
    }

    return (
      <div style={{
        background: "#F6F7F7"
      }}>
      <HeaderPage navigation={navigationArray} headerInfo={headerInfo} headerType="account" pageTexts={this.state.pageTexts}/>
      <div className="container" style={{
        marginTop: "1em"
      }}>
      <div className="col-xs-12 section-name">

        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12">
              <div className="image-drag-excercise">
                <div className="pdf-icon-container">
                  <img className="pdf-icon" src="/images/leyend.png" />
                </div>
                <div className="info-title-container">
                  <div className="row">
                    <div className="col-xs-12">
                      <span className="info-title">{this.state.pageTexts[11]}</span>
                      {/* <span className="info-title">Opciones</span> */}
                    </div>
                    <div className="col-xs-12 leyend-item-container">
                      <div className="row">

                        <div style={{
                          marginRight: "2em"
                        }}>
                        <div className="leyend-item-type mousePoint" onClick={this.changeMode.bind(this, true)}>
                          <img src="/images/usuario-perfil.png" className="leyend-img" />
                          <span className="leyend-name">{this.state.pageTexts[12]}</span>
                          {/* <span className="leyend-name">Mis datos</span> */}
                        </div>

                        {(() => {
                          if (this.state.editMode == true)
                          return <div className="button-selected"></div>
                        })()}

                      </div>

                      <div style={{
                        marginRight: "2em"
                      }}>
                      <div className="leyend-item-type read-color mousePoint" onClick={this.changeMode.bind(this, false)}>
                        <img src="/images/candadoblanco.png" className="leyend-img" />
                        <span className="leyend-name">{this.state.pageTexts[13]}</span>
                        {/* <span className="leyend-name">Cambiar contraseña</span> */}
                      </div>
                      {(() => {
                        if (this.state.editMode == false)
                        return <div className="button-selected read-color"></div>
                      })()}

                    </div>

                    <div>
                      <div className="leyend-item-type mousePoint logOut-color" onClick={this.logOut.bind(this)}>
                        <img src="/images/candadoblanco.png" className="leyend-img" />
                        <span className="leyend-name">{this.state.pageTexts[14]}</span>
                        {/* <span className="leyend-name">Cerrar sesión</span> */}
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
    {(() => {
      if (this.state.editMode == true) {
        return <EditProfile pageTexts={this.state.pageTexts}/>
      } else {
        return <EditPassword pageTexts={this.state.pageTexts}/>

      }
    })()}

  </div>
</div>

<Footer />
</div>
)
}
}

Account.contextTypes = {
  router: React.PropTypes.object
}
