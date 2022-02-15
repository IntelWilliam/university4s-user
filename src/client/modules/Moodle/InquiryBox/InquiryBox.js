import React from 'react'
import Names from 'src/client/Constants/PagesNames'
import {Link} from 'react-router'
import Footer from 'src/client/modules/layout/footer'
import Constants from 'src/client/Constants/Constants'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import InquiryBoxStore from 'src/client/modules/Moodle/InquiryBox/InquiryBoxStore'
import loading from 'src/client/modules/Chat/Modals/loading'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'

class InquiryBox extends React.Component {
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

    $("#formlogin").validate({
      rules: {
        username: {
          required: true,
          minlength: 2
        },
        fullname: {
          required: true,
          minlength: 2
        },
        email: {
          required: true,
          email: true
        },
        type: {
          required: true
        },
        comment: {
          required: true,
          minlength: 10
        }
      },
      //For custom messages
      messages: {
        username: {
          required: "Ingrese el Usuario",
          minlength: "Ingrese al menos 2 caracteres"
        },
        fullname: {
          required: "Ingrese su Nombre completo",
          minlength: "Ingrese al menos 2 caracteres"
        },
        email: {
          required: "Ingrese sus Email",
          email: "Ingrese un email valido"
        },
        type: {
          required: "Seleccione uno"
        },
        comment: {
          required: "Ingrese la Consulta",
          minlength: "Ingrese al menos 10 caracteres"
        }
      },
      errorElement: 'div',
      errorPlacement: (error, element) => {
        var placement = $(element).data('error');
        if (placement) {
          $(placement).append(error)
        } else {
          error.insertAfter(element);
        }
      },
      submitHandler: this.confirm.bind(this)
      // submitHandler: this.handleSubmit.bind(this)
    })

  }

  componentWillMount() {
    this.loadPageTexts()
  }

  handleForm(event) {
    let item = this.state.userData;
    item[event.target.name] = event.target.value;
    this.setState({userData: item})
  }

  confirm() {
    let loadingNew = loading.replace(/text-to-load/g, this.state.pageTexts[31]);
    // let loadingNew = loading.replace(/text-to-load/g, "Cargando");

    swal({
      html: loadingNew,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false
    })

    let formdata = new FormData();

    formdata.append("username", this.state.userData.username)
    formdata.append("fullname", this.state.userData.fullname)
    formdata.append("email", this.state.userData.email)
    formdata.append("type", this.state.userData.type)
    formdata.append("comment", this.state.userData.comment)
    formdata.append('docFile', $('input[type=file]')[0].files[0]);

    InquiryBoxStore.SendForm(formdata, (err, body) => {
      if (err) {

        console.log(body);
        swal({
          title: this.state.pageTexts[32],
          text: this.state.pageTexts[33],
          // title: 'Error!',
          // text: "El documento no es compatible, intente nuevamente!",
          type: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#3085d6',
          confirmButtonText: this.state.pageTexts[34],
          cancelButtonText: this.state.pageTexts[35],
          // confirmButtonText: 'Cancelar!',
          // cancelButtonText: 'Intentar nuevamente!',
        }).then(() => {
          this.context.router.push('/user-area/')
        })

        return console.log(err);
      }

      swal({
        title: this.state.pageTexts[36],
        text: this.state.pageTexts[37],
        // title: "Enviado.",
        // text: "Su consulta fue enviada exitosamente!",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: this.state.pageTexts[38],
        // confirmButtonText: "Continuar",
        type: "info",
      }).then(() => {
        this.context.router.push('/user-area/')
      })

    })

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

          <div className="col-xs-12 col-sm-8">
            <form className="login-form formValidate account-login-form" id="formlogin" method="POST" encType="multipart/form-data">
            <div className="row">

              <div className="col-xs-12">
                <div className="row">
                  <div className="col-xs-12 col-sm-8 account-container">
                    <div className="row">
                      <div className="col-xs-6 account-input-text-container">
                        <span className="bold account-input-text">{this.state.pageTexts[10]}
                          {/* <span className="bold account-input-text">Usuario */}
                        </span>
                      </div>
                      <div className="col-xs-6 input-flex">
                        <input className="account-input" value={this.state.userData.username || ''} onChange={this.handleForm.bind(this)} data-error=".errorTxt1" id="username" name="username"></input>
                      </div>
                      <div className="col-xs-6 col-xs-offset-6 errorTxt1"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xs-12">
                <div className="row">
                  <div className="col-xs-12 col-sm-8 account-container">
                    <div className="row">
                      <div className="col-xs-6 account-input-text-container">
                        <span className="bold account-input-text">{this.state.pageTexts[11]}
                          {/* <span className="bold account-input-text">Nombre completo */}
                        </span>
                      </div>
                      <div className="col-xs-6 input-flex">
                        <input value={this.state.userData.fullname || ''} onChange={this.handleForm.bind(this)} id="fullname" name="fullname" className="account-input" data-error=".errorTxt2"></input>
                      </div>
                      <div className="col-xs-6 col-xs-offset-6 errorTxt2"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xs-12">
                <div className="row">
                  <div className="col-xs-12 col-sm-8 account-container">
                    <div className="row">
                      <div className="col-xs-6 account-input-text-container">
                        <span className="bold account-input-text">{this.state.pageTexts[12]}
                          {/* <span className="bold account-input-text">Correo Electrónico */}
                          <span style={{
                            color: 'red'
                          }}>
                          &nbsp;*</span>
                        </span>
                      </div>
                      <div className="col-xs-6 input-flex">
                        <input value={this.state.userData.email || ''} onChange={this.handleForm.bind(this)} id="email" name="email" className="account-input" data-error=".errorTxt3"></input>
                      </div>
                      <div className="col-xs-6 col-xs-offset-6 errorTxt3"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xs-12">
                <div className="row">
                  <div className="col-xs-12 col-sm-8 account-container">
                    <div className="row">
                      <div className="col-xs-6 account-input-text-container">
                        <span className="bold account-input-text">{this.state.pageTexts[13]}
                          {/* <span className="bold account-input-text">Tipo de Consulta */}
                          <span style={{
                            color: 'red'
                          }}>
                          &nbsp;*</span>
                        </span>
                      </div>
                      <div className="col-xs-6 input-flex">
                        <select defaultValue="0" onChange={this.handleForm.bind(this)} id="type" name="type" className="account-input" data-error=".errorTxt4">
                          <option className="account-input" value="0" disabled>{this.state.pageTexts[14]}</option>
                          <option className="account-input" value="Consulta Técnica">{this.state.pageTexts[15]}</option>
                          <option className="account-input" value="Consulta Aministrativa">{this.state.pageTexts[16]}</option>
                          <option className="account-input" value="Consulta de Contenidos">{this.state.pageTexts[17]}</option>
                          {/* <option className="account-input" value="0" disabled>Seleccione uno</option>
                          <option className="account-input" value="Consulta Técnica">Consulta Técnica</option>
                          <option className="account-input" value="Consulta Aministrativa">Consulta Aministrativa</option>
                          <option className="account-input" value="Consulta de Contenidos">Consulta de Contenidos</option> */}
                        </select>
                      </div>
                      <div className="col-xs-6 col-xs-offset-6 errorTxt4"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xs-12">
                <div className="row">
                  <div className="col-xs-12 account-container">
                    <div className="row">
                      <div className="col-xs-4 account-input-text-container" style={{
                        'alignItems': 'baseline',
                        'paddingTop': '0.5em'
                      }}>
                      <span className="bold account-input-text">{this.state.pageTexts[18]}
                        {/* <span className="bold account-input-text">Consulta */}
                      </span>
                    </div>
                    <div className="col-xs-8 input-flex">
                      <textarea rows="10" cols="10" placeholder={this.state.pageTexts[18] + "..."} value={this.state.userData.comment || ''} onChange={this.handleForm.bind(this)} id="comment" name="comment" className="account-input" data-error=".errorTxt5"></textarea>
                      {/* <textarea rows="10" cols="10" placeholder="Consulta..." value={this.state.userData.comment || ''} onChange={this.handleForm.bind(this)} id="comment" name="comment" className="account-input" data-error=".errorTxt5"></textarea> */}
                    </div>
                    <div className="col-xs-6 col-xs-offset-4 errorTxt5"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-12">
              <div className="row">

                <div className="col-xs-6 col-sm-4 account-input-text-container account-container">
                  <span className="bold account-input-text">{this.state.pageTexts[19]}
                    {/* <span className="bold account-input-text">Documento */}
                  </span>
                </div>

                <div className="col-xs-6 col-sm-8 account-container">
                  <div className="row">

                    <div className="col-xs-12 col-sm-6 input-flex margin-min">
                      <input className="account-input" disabled="disabled" value={this.state.userData.docFile || ''}></input>
                    </div>

                    <div className="col-xs-12 col-sm-6 mousePoint">
                      <div className="row height-100">
                        <div className="col-xs-12">

                          <div className="leyend-item-account document-button-back fileContainer height-100">
                            <input type="file" ref="docFile" id="docFile" name="docFile"/>
                            <img src="/images/usuario-perfil.png" className="leyend-img"/>
                            <span className="leyend-name">{this.state.pageTexts[19]}</span>
                            {/* <span className="leyend-name">Documento</span> */}
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-12 account-container">
              <div className="row">
                <div className="col-xs-12 account-container">
                  <div style={{
                    float: 'right'
                  }}>
                  <button className="crop-button bold inquiryButton" type="submit">{this.state.pageTexts[30]}</button>
                  {/* <button className="crop-button bold inquiryButton" type="submit">Aceptar</button> */}
                </div>
              </div>
            </div>
          </div>

        </div>
      </form>
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

InquiryBox.contextTypes = {
  router: React.PropTypes.object
}

export default InquiryBox
