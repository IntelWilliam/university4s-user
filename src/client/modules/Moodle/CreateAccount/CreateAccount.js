import React from 'react'
import CheckEmailStore from 'src/client/modules/Moodle/CreateAccount/CheckEmailStore'
import CreateAccountStore from 'src/client/modules/Moodle/CreateAccount/CreateAccountStore'
import LocationStore from 'src/client/modules/Moodle/CreateAccount/LocationStore'
// import FacebookLogin from 'react-facebook-login';
import loading from 'src/client/modules/Chat/Modals/loading'
import loginUser from 'src/client/modules/Login/'
import HeaderCreateAccount from 'src/client/modules/layout/HeaderCreateAccount'
import LoginFooter from 'src/client/modules/layout/login-footer'
import { Link } from 'react-router'
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions'
import EntitiesStore from 'src/client/modules/Moodle/CreateAccount/EntitiesStore'

const formRules = {

  name: {
    required: true,
    minlength: 2
  },
  lastname: {
    required: true,
    minlength: 2
  },
  email: {
    required: true,
    email: true
  },
  confirmEmail: {
    required: true,
    email: true,
    equalTo: "#email"
  },

  password: {
    required: true,
    minlength: 5
  },
  confirmPass: {
    required: true,
    minlength: 5,
    equalTo: "#password"
  },
  codeId: {
    required: true,
    minlength: 3
  },

  // documentID: {
  //   required: true,
  //   minlength: 5
  // },

  // datos del comprador
  titularName: {
    // required: true,
    minlength: 5
  },
  titularLastName: {
    // required: true,
    minlength: 5
  },
  titularId: {
    // required: true,
    minlength: 5,
    number: true
  },
  direction: {
    // required: true,
    minlength: 5
  },
  phone: {
    // required: true,
    minlength: 5,
    number: true
  },
  homePhone: {
    // required: true,
    minlength: 5,
    number: true
  },

  lCountries: {
    // required: true,
  },

  lStates: {
    // required: true,
  },
  lProvinces: {
    // required: true,
  },
  lCities: {
    // required: true,
  },


}
const formMenssages = {

  name: {
    required: "Ingrese su Nombre",
    minlength: "Ingrese al menos 2 caracteres"
  },
  lastname: {
    required: "Ingrese sus Apellidos",
    minlength: "Ingrese al menos 2 caracteres"
  },
  email: {
    required: "Ingrese el Email",
    email: "Ingrese un email valido",
  },
  confirmEmail: {
    required: "Confirme el Email",
    email: "Ingrese un email valido",
    equalTo: "Los correos deben coincidir"
  },

  password: {
    required: "Ingrese la contraseña",
    minlength: "Ingrese al menos 5 caracteres"
  },
  confirmPass: {
    required: "Confirme la contraseña",
    minlength: "Ingrese al menos 5 caracteres",
    equalTo: "Las contraseñas deben coincidir"
  },

  codeId: {
    required: "Ingrese el codigo de registro",
    minlength: "Ingrese al menos 3 caracteres"
  },

  documentID: {
    required: "Ingrese el número de documento",
    minlength: "Ingrese al menos 5 caracteres"
  },


  // datos del comprador
  titularName: {
    required: "Ingrese el nombre completo",
    minlength: "Ingrese al menos 5 caracteres"
  },
  titularLastName: {
    required: "Ingrese el apellido completo",
    minlength: "Ingrese al menos 5 caracteres"
  },
  titularId: {
    required: "Ingrese el número de documento",
    minlength: "Ingrese al menos 5 caracteres",
    number: "Ingrese un número valido",
  },
  direction: {
    required: "Ingrese la dirección",
    minlength: "Ingrese al menos 5 caracteres"
  },
  phone: {
    required: "Ingrese el celular",
    minlength: "Ingrese al menos 5 caracteres",
    number: "Ingrese un número valido",
  },
  homePhone: {
    required: "Ingrese el teléfono",
    minlength: "Ingrese al menos 5 caracteres",
    number: "Ingrese un número valido"
  },

  lCountries: {
    required: "Selecciona un País",
  },
  lStates: {
    required: "Selecciona un Departamento",
  },
  lProvinces: {
    required: "Selecciona un Provincia",
  },
  lCities: {
    required: "Selecciona un Distrito / Ciudad",
  }
}

export default class CreateAccount extends React.Component {
  constructor() {
    super()
    this.state = {
      userData: {
        direction: '',
        phone: '',
        homePhone: ''
      },
      pageTexts: [],
      isRegisterDisabled: false,
      entityIndex: '',
      allEntities: [],
      askBuyerInf: false,
      buyerInf: null,
      pagination: {
        total: 0, // cantidad de items
        page: 0, // página actual
        pages: 0 // cantidad de páginas
      },

      lCountries: [],
      lStates: [],
      lProvinces: [],
      lCities: [],

      selectCountry: '',
      selectState: '',
      selectProvince: '',
      selectCity: '',

    }
  }

  loadPageTexts() {
    FrontTextsActions.getTexts("SIGN_UP", (err, body) => {
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
    this.loadEntities()

    LocationStore.get_countries((err, res) => {
      if (err)
        console.log('LocationStore err: ', err);

      this.setState({
        lCountries: res
      })
    })
  }

  loadEntities() {

    let params = {}

    EntitiesStore.getAll(params, (err, response) => {
      if (err) return
      // se cambia el estado allEntities con los nuevos usuarios
      console.log('response', response);
      this.setState({
        allEntities: response.data,
        pagination: {
          total: response.total,
          page: response.page,
          pages: response.pages
        }
      })
    })
  }

  componentDidMount() {

    this.goTop()

    // $.validator.addMethod("valueNotEquals", function(value, element, arg){
    //   // I use element.value instead value here, value parameter was always null
    //   return arg != element.value;
    // }, "Value must not equal arg.");

    let validator = $("#formlogin").validate({
      rules: formRules,
      //For custom messages
      messages: formMenssages,
      errorElement: 'div',
      errorPlacement: (error, element) => {

        var placement = $(element).data('error');
        if (placement) {
          $(placement).append(error)
        } else {
          error.insertAfter(element);
        }
      },
      submitHandler: this.handleSubmit.bind(this)
    })


    this.setState({
      validator
    })

  }

  goTop() {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
  }

  handleSubmit() {

    console.log('handleSubmit');

    // se crea un arreglo de los datos a actualizar
    let toSave = this.state.userData;

    //direction requeria en dev
    // if (!toSave['direction'])
    //   toSave.direction = ''
    // //phone requeria en dev
    // if (!toSave['phone'])
    //   toSave.phone = ''
    // //homePhone requeria en dev
    // if (!toSave['homePhone'])
    //   toSave.homePhone = ''

    // se copia la informacion del comprador en la nueva cuenta a crear
    if (this.state.buyerInf) {
      for (let k in this.state.buyerInf) toSave[k] = this.state.buyerInf[k]
    }

    toSave['titularCountry'] = this.state.selectCountry
    toSave['titularState'] = this.state.selectState
    toSave['titularProvince'] = this.state.selectProvince
    toSave['titularCity'] = this.state.selectCity

    // console.log("toSave", toSave);

    // if (
    // !toSave['titularName'] ||
    // !toSave['titularLastName'] ||
    // !toSave['titularId'] ||
    //
    // !toSave['titularCountry'] ||
    // !toSave['titularState'] ||
    // !toSave['titularProvince'] ||
    // !toSave['titularCity'] ||

    // !toSave['direction'] ||
    // !toSave['homePhone'] ||
    // !toSave['phone'])
    // return console.log("faltan datos");

    if (this.state.entityIndex) {
      toSave.entityCode = this.state.allEntities[this.state.entityIndex]._id
      toSave.entityName = this.state.allEntities[this.state.entityIndex].name
    }


    let loadingNew = loading.replace(/text-to-load/g, this.state.pageTexts[18]);
    // let loadingNew = loading.replace(/text-to-load/g, "Creando");
    swal({html: loadingNew, showCloseButton: false, showCancelButton: false, showConfirmButton: false})

    // se llama la accion que actualiza un usuario
    console.log("toSave >>> ", toSave);

    CreateAccountStore.create(toSave, (err, res) => {
      // si llega un error
      if (err) {
        console.log("error", err)
        return err
      } else {
        // console.log("res", res);

        if (res == false) {
          swal({
            title: this.state.pageTexts[15],
            text: this.state.pageTexts[16],
            // swal({title: "Codigo Invalido.",
            // text: "El código introducido no es valido, intente nuevamente!",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: this.state.pageTexts[17],
            // confirmButtonText: "Continuar",
            type: "warning"
          }).then(() => {
            // this.context.router.push('/user-area/')
          })

        } else {

          const user = {
            username: toSave.email,
            password: toSave.password
          }

          const userWatsap = {
            email: toSave.email,
            pass: toSave.password,
            number: toSave.phone,
          }

          loginUser.login(user, (loggedIn) => {
            if (!loggedIn) {
              console.log("loggedIn", loggedIn);
            }

            swal.close()
            swal({
              title: this.state.pageTexts[19],
              // swal({title: "Éxito.",
              text: this.state.pageTexts[20],
              // text: "Su cuenta ha sido creda!",
              confirmButtonColor: "#DD6B55",
              confirmButtonText: this.state.pageTexts[21],
              // confirmButtonText: "Continuar",
              type: "info"
            }).then(() => {
              // solicitud post al endpoint de watsap 
              let uri = "https://ibceducacion.com"
              let local = "http://localhost:3017"
              fetch(`${uri}/api/watsap/`, {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userWatsap)
              })
                .then(res => res.json())
                .then(data => {
                  if(data.status === "success") {
                    console.log('Exitoo', data.mensaje)
                  } else {
                    console.log('Error', data.mensaje)
                  }
                })
                .finally(() => {
                  this.context.router.push('/user-area/')
                })
            })

          })

        }

      }
    })


  }

  handleForm(event) {
    let item = this.state.userData;
    item[event.target.name] = event.target.value;
    this.setState({userData: item})
  }

  checkBuyerDataExist(licence) {

    CreateAccountStore.checkBuyerDataExist(licence, (err, res) => {
      if (err) {
        console.log("checkBuyerDataExist error", err);
      }

      // console.log("checkBuyerDataExist resp", res);
      // console.log("userCouple", res.hasOwnProperty('userCouple'));

      if (res.hasOwnProperty('userCouple')) {

        var lastCoupleRegister = res.userCouple

        if (
          lastCoupleRegister.hasOwnProperty('titularId') &&
          lastCoupleRegister.hasOwnProperty('titularName') &&
          lastCoupleRegister.hasOwnProperty('titularLastName') &&

          lastCoupleRegister.hasOwnProperty('titularCountry') &&
          lastCoupleRegister.hasOwnProperty('titularState') &&
          lastCoupleRegister.hasOwnProperty('titularProvince') &&
          lastCoupleRegister.hasOwnProperty('titularCity') &&

          lastCoupleRegister.hasOwnProperty('direction') &&
          lastCoupleRegister.hasOwnProperty('phone') &&
          lastCoupleRegister.hasOwnProperty('homePhone')
        // lastCoupleRegister.hasOwnProperty('department')
        ) {

          // se copia la informacion del comprador al registro de esta nueva cuenta

          let buyerInf = {
            titularId: lastCoupleRegister.titularId,
            titularName: lastCoupleRegister.titularName,
            titularLastName: lastCoupleRegister.titularLastName,

            titularCountry: lastCoupleRegister.titularCountry,
            titularState: lastCoupleRegister.titularState,
            titularProvince: lastCoupleRegister.titularProvince,
            titularCity: lastCoupleRegister.titularCity,

            direction: lastCoupleRegister.direction,
            phone: lastCoupleRegister.phone,
            homePhone: lastCoupleRegister.homePhone,
            // department: lastCoupleRegister.department,
          }

          // si pertenece a una entidad
          if (lastCoupleRegister.hasOwnProperty('entityCode') &&
            lastCoupleRegister.hasOwnProperty('entityName')) {
            buyerInf.entityCode = lastCoupleRegister.entityCode
            buyerInf.entityName = lastCoupleRegister.entityName
          }
          this.setState({
            buyerInf: buyerInf,
            askBuyerInf: false
          })

        } else {

          this.setState({
            buyerInf: null,
            askBuyerInf: true
          })

          // se actualiza el validador con los nuevos input activados
          // setTimeout(function() {
          //   // $(".classToValidate").each( () => {
          //   //   $(this).rules('add', {
          //   //     required: true
          //   //   });
          //   // });
          //
          //   let validator = this.state.validator
          //   validator.destroy();
          //
          //   validator = $("#formlogin").validate({
          //     rules: formRules,
          //     //For custom messages
          //     messages: formMenssages,
          //     errorElement: 'div',
          //     errorPlacement: (error, element) => {
          //       var placement = $(element).data('error');
          //       if (placement) {
          //         $(placement).append(error)
          //       } else {
          //         error.insertAfter(element);
          //       }
          //     },
          //     submitHandler: this.handleSubmit.bind(this)
          //   })
          //
          //   this.setState({ validator})
          //
          // }.bind(this), 1000);

        }

      } else {
        // si no tiene "couple" se deben pedir los datos.
        this.setState({
          askBuyerInf: true
        })
      }


      this.setState({
        isRegisterDisabled: false
      })
    })

  }

  blurLicence() {
    if (this.state.userData.codeId != undefined && this.state.userData.codeId.length >= 3) {
      this.checkBuyerDataExist(this.state.userData.codeId.trim())
    }

    this.setState({
      isRegisterDisabled: true
    })
  }

  blurEmail(event) {
    if (event.target.value != '')
      this.checkmail(event.target.value)
  }

  checkmail(mail) {
    CheckEmailStore.checkOne(mail, (err, response) => {
      if (err)
        return
      if (!response) {
        swal({
          title: this.state.pageTexts[22],
          text: this.state.pageTexts[23],
          // swal({title: 'Error!',
          // text: "El Correo Electrónico indicado ya se encuentra registrado!",
          type: 'warning',
          showConfirmButton: false, timer: 3000
        }).then(() => {
        }, () => {
          let temp = this.state.userData;
          temp.email = ''
          this.setState({userData: temp})
        })
      }
    })
  }

  initFacebook() {
    let loadingNew = loading.replace(/text-to-load/g, "Enlazando");
    swal({html: loadingNew, showCloseButton: false, showCancelButton: false, showConfirmButton: false})
  }

  responseFacebook(response) {
    swal.close()

    if (response.status == "unknown") {
      swal({title: 'Error!', text: 'Error al enlazar intente nuevamente.', timer: 6000}).then(() => {
      }, () => {
      })
    }

    // console.log("responseFacebook", response);
    let temp = this.state.userData;

    if (response.email) {
      temp.email = response.email
      this.checkmail(response.email)
    }

    temp.facebookId = response.userID
    temp.name = response.name
    this.setState({userData: temp})
  }

  handleEntity(e) {
    this.setState({
      entityIndex: e.target.value,
    })
  }

  handleCountry(e) {
    this.setState({
      selectCountry: e.target.value,
    })
    this.loadStates(e.target.value)
  }

  handleState(e) {
    this.setState({
      selectState: e.target.value,
    })
    this.loadProvinces(e.target.value)
  }

  handleProvince(e) {
    this.setState({
      selectProvince: e.target.value,
    })
    this.loadCities(e.target.value)
  }

  handleCity(e) {
    this.setState({
      selectCity: e.target.value,
    })
    // this.loadStates(e.target.value)
  }

  loadStates(id) {
    // console.log('load states id:', id);
    LocationStore.get_states({a01Codigo: id}, (err, res) => {
      if (err)
        console.log('LocationStore err: ', err);

      console.log('res', res);
      this.setState({
        lStates: res
      })
    })
  }

  loadProvinces(id) {
    LocationStore.get_provinces({a02Codigo: id}, (err, res) => {
      if (err)
        console.log('LocationStore err: ', err);
      this.setState({
        lProvinces: res
      })
    })
  }

  loadCities(id) {
    LocationStore.get_cities({a03Codigo: id}, (err, res) => {
      if (err)
        console.log('LocationStore err: ', err);
      this.setState({
        lCities: res
      })
    })
  }

  render() {
    let hrefLogin = '/login'
    return (
      <div style={{
        background: "#F6F7F7"
      }}>
        <HeaderCreateAccount/>

        <div className="col-xs-12 min-heigh">
          <div className="row">

            <div className="col-xs-12 col-md-6 " style={{
              background: "rgb(6 7 66)"
            }}>
              <div className="row">
                {/* <img src="/images/new-account.jpg" className="width-100 min-heigh"></img> */}
              </div>
            </div>

            <div className="col-xs-12 col-md-6 new-account-container">
              <div className="col-xs-12 page-content">
            <span className="new-account-tittle">
              {this.state.pageTexts[0]}
              {/* Nueva */}
            </span>
              </div>

              <div className="col-xs-12">
            <span className="new-account-tittle bold">
              {this.state.pageTexts[1]}</span>
                {/* Cuenta</span> */}
              </div>

              <div className="col-xs-12 page-content">
                <span>{this.state.pageTexts[2]}</span>
                {/* <span>Cree su nueva cuenta con el número de licencia asignado.</span> */}
              </div>

              <form className="login-form formValidate account-login-form" id="formlogin" method="POST"
                    encType="multipart/form-data">

                {/* <div className="col-xs-12 page-content">
            <FacebookLogin appId="1675110502792645" version="2.8" scope="email" autoLoad={false} reAuthenticate={false} language="es_LA" textButton="Enlazar con Facebook" fields="name,email" icon="fa-facebook" callback={this.responseFacebook.bind(this)} onClick={this.initFacebook.bind(this)}/>
          </div> */}

                <div className="col-xs-12 learner-data-container">
                  <div className="row">

                    <div className="col-xs-12 col-sm-6 account-container">
                      <div className="row">
                        <div className="col-xs-10 input-flex">
                          <input placeholder={this.state.pageTexts[3]} value={this.state.userData.name || ''}
                                 onChange={this.handleForm.bind(this)} id="name" name="name" type="text"
                                 className="account-input" data-error=".errorTxt1" autoComplete="off"/>
                          {/* <input placeholder="Nombres" value={this.state.userData.name || ''} onChange={this.handleForm.bind(this)} id="name" name="name" type="text" className="account-input" data-error=".errorTxt2" autoComplete="off"></input> */}
                        </div>
                        <div className="col-xs-10 errorTxt1"/>
                      </div>
                    </div>

                    <div className="col-xs-12 col-sm-6 account-container">
                      <div className="row">
                        <div className="col-xs-10 input-flex">
                          <input placeholder={this.state.pageTexts[4]} value={this.state.userData.lastname || ''}
                                 onChange={this.handleForm.bind(this)} id="lastname" name="lastname" type="text"
                                 className="account-input" data-error=".errorTxt2" autoComplete="off"/>
                          {/* <input placeholder="Apellidos" value={this.state.userData.lastname || ''} onChange={this.handleForm.bind(this)} id="lastname" name="lastname" type="text" className="account-input" data-error=".errorTxt3" autoComplete="off"></input> */}
                        </div>
                        <div className="col-xs-10 errorTxt2"/>
                      </div>
                    </div>


                    <div className="col-xs-12 col-sm-6 account-container">
                      <div className="row">
                        <div className="col-xs-10 input-flex">
                          <input placeholder={this.state.pageTexts[5]} className="account-input"
                                 value={this.state.userData.email || ''} onBlur={this.blurEmail.bind(this)}
                                 onChange={this.handleForm.bind(this)} id="email" name="email" type="email" ref="email"
                                 data-error=".errorTxt3"/>
                          {/* <input placeholder="Correo electrónico" className="account-input" value={this.state.userData.email || ''} onBlur={this.blurEmail.bind(this)} onChange={this.handleForm.bind(this)} id="email" name="email" type="email" ref="email" data-error=".errorTxt1"></input> */}
                        </div>
                        <div className="col-xs-10 errorTxt3"/>
                      </div>
                    </div>
                    <div className="col-xs-12 col-sm-6 account-container">
                      <div className="row">
                        <div className="col-xs-10 input-flex">
                          <input placeholder="Confirmar correo electrónico" className="account-input" id="confirmEmail"
                                 name="confirmEmail" type="email" ref="confirmEmail" data-error=".errorTxt4"/>
                          {/* <input placeholder="Correo electrónico" className="account-input" value={this.state.userData.email || ''} onBlur={this.blurEmail.bind(this)} onChange={this.handleForm.bind(this)} id="email" name="email" type="email" ref="email" data-error=".errorTxt1"></input> */}
                        </div>
                        <div className="col-xs-10 errorTxt4"/>
                      </div>
                    </div>


                    <div className="col-xs-12 col-sm-6 account-container">
                      <div className="row">
                        <div className="col-xs-10 input-flex">
                          <input placeholder={this.state.pageTexts[6]} id="password" name="password"
                                 className="account-input" type="password" onChange={this.handleForm.bind(this)}
                                 data-error=".errorTxt5" autoComplete="off"/>
                          {/* <input placeholder="Contraseña" id="password" name="password" className="account-input" type="password" onChange={this.handleForm.bind(this)} data-error=".errorTxt4" autoComplete="off"></input> */}
                        </div>
                        <div className="col-xs-10 errorTxt5"/>
                      </div>
                    </div>

                    <div className="col-xs-12 col-sm-6 account-container">

                      <div className="row">
                        <div className="col-xs-10 input-flex">
                          <input placeholder={this.state.pageTexts[7]} id="confirmPass" name="confirmPass"
                                 className="account-input" type="password" data-error=".errorTxt6"
                                 autoComplete="off"/>
                          {/* <input placeholder="Confirmar contraseña" id="confirmPass" name="confirmPass" className="account-input" type="password" data-error=".errorTxt5" autoComplete="off"></input> */}
                        </div>
                        <div className="col-xs-10 errorTxt6"/>
                      </div>
                    </div>


                    <div className="col-xs-12 account-container">

                      {/*<div className="row">*/}
                      {/*<div className="col-xs-10 input-flex">*/}
                      {/*<p style={{textAlign: "justify"}}>*/}
                      {/*Si eres el titular de la cuenta (quien paga el curso) escribe el número de licencia que*/}
                      {/*termina en "T". Si eres beneficiario, escribe el número de licencia que termina en "B".*/}
                      {/*</p>*/}
                      {/*</div>*/}
                      {/*</div>*/}

                      <div className="row">
                        <div className="col-sm-5 col-xs-10 input-flex">
                          <input placeholder={this.state.pageTexts[8]} onBlur={this.blurLicence.bind(this)}
                                 value={this.state.userData.codeId || ''} onChange={this.handleForm.bind(this)}
                                 id="codeId" name="codeId" type="text" className="account-input"
                                 data-error=".errorTxt7" autoComplete="off"/>
                          {/* <input placeholder="Número de licencia" value={this.state.userData.codeId || ''} onChange={this.handleForm.bind(this)} id="codeId" name="codeId" type="text" className="account-input" data-error=".errorTxt7" autoComplete="off"></input> */}
                        </div>
                        <div className="col-xs-10 errorTxt7"></div>
                      </div>
                    </div>


                    {/*<div className="col-xs-12 col-sm-6 account-container">*/}
                    {/*<div className="row">*/}
                    {/*<div className="col-xs-10 input-flex">*/}
                    {/*<input placeholder={'Documento de identidad'} value={this.state.userData.documentID || ''}*/}
                    {/*onChange={this.handleForm.bind(this)} id="documentID" name="documentID" type="text"*/}
                    {/*className="account-input" data-error=".errorTxt8" autoComplete="off"/>*/}
                    {/*/!* <input placeholder="Nombres" value={this.state.userData.name || ''} onChange={this.handleForm.bind(this)} id="name" name="name" type="text" className="account-input" data-error=".errorTxt2" autoComplete="off"></input> *!/*/}
                    {/*</div>*/}
                    {/*<div className="col-xs-10 errorTxt8"></div>*/}
                    {/*</div>*/}
                    {/*</div>*/}


                    <div className="col-xs-12 col-sm-6 account-container">
                      <div className="row">
                        <div className="col-xs-10 input-flex">
                          <input placeholder={this.state.pageTexts[10]} className="account-input classToValidate"
                                 id="phone"
                                 name="phone" value={this.state.userData.phone || ''} type="tel"
                                 onChange={this.handleForm.bind(this)} data-error=".errorTxt18"/>
                          {/* <input placeholder="Celular" className="account-input" id="phone" name="phone" value={this.state.userData.phone || ''} type="tel" onChange={this.handleForm.bind(this)} data-error=".errorTxt8"></input> */}
                        </div>
                        <div className="col-xs-10 errorTxt18"/>
                      </div>
                    </div>

                    <div className="col-xs-12 col-sm-6 account-container">
                      <div className="row">
                        <div className="col-xs-10 input-flex">
                          <input placeholder={this.state.pageTexts[11]} className="account-input classToValidate"
                                 id="homePhone"
                                 name="homePhone" value={this.state.userData.homePhone || ''}
                                 onChange={this.handleForm.bind(this)} type="tel" data-error=".errorTxt19"/>
                          {/* <input placeholder="Teléfono" className="account-input" id="homePhone" name="homePhone" value={this.state.userData.homePhone || ''} onChange={this.handleForm.bind(this)} type="tel" data-error=".errorTxt9 "></input> */}
                        </div>
                        <div className="col-xs-10 errorTxt19"/>
                      </div>
                    </div>


                    {/*<div className="col-xs-12 col-sm-6 account-container">*/}
                      {/*<div className="row">*/}
                        {/*<div className="col-xs-10 input-flex">*/}
                          {/*<input placeholder={'Celular'} value={this.state.userData.phone || ''}*/}
                                 {/*onChange={this.handleForm.bind(this)} id="phone" name="phone" type="number"*/}
                                 {/*className="account-input" data-error=".errorTxt89" autoComplete="off"/>*/}
                          {/*/!* <input placeholder="Nombres" value={this.state.userData.name || ''} onChange={this.handleForm.bind(this)} id="name" name="name" type="text" className="account-input" data-error=".errorTxt2" autoComplete="off"></input> *!/*/}
                        {/*</div>*/}
                        {/*<div className="col-xs-10 errorTxt89"/>*/}
                      {/*</div>*/}
                    {/*</div>*/}


                    {/*<div className="col-xs-12 col-sm-6 account-container">*/}
                      {/*<div className="row">*/}
                        {/*<div className="col-xs-10 input-flex">*/}
                          {/*<input placeholder={'Teléfono casa'} value={this.state.userData.homePhone || ''}*/}
                                 {/*onChange={this.handleForm.bind(this)} id="homePhone" name="homePhone" type="text"*/}
                                 {/*className="account-input" data-error=".errorTxt82" autoComplete="off"/>*/}
                          {/*/!* <input placeholder="Nombres" value={this.state.userData.name || ''} onChange={this.handleForm.bind(this)} id="name" name="name" type="text" className="account-input" data-error=".errorTxt2" autoComplete="off"></input> *!/*/}
                        {/*</div>*/}
                        {/*<div className="col-xs-10 errorTxt82"/>*/}
                      {/*</div>*/}
                    {/*</div>*/}


                  </div>
                </div>

                {(() => {
                  if (this.state.askBuyerInf) {
                    return <div className="col-xs-12 learner-data-container">
                      <div className="row">

                        {/*<div className="col-xs-12 col-sm-12 account-container">*/}

                        {/*<div className="row">*/}
                        {/*<div className="col-xs-10 input-flex">*/}
                        {/*<p style={{textAlign: "justify"}}>*/}
                        {/*Ingresa la informacion de la persona que firmo el contrato.*/}
                        {/*</p>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*</div>*/}

                        <div className="col-xs-12 page-content">
                          <span>Ingresa la informacion de la persona que firmo el contrato (Titular).</span>
                        </div>
                        <div className="col-xs-12 col-sm-6 account-container">
                          <div className="row">
                            <div className="col-xs-10 input-flex">
                              <input placeholder={'Nombre completo del titular'}
                                     value={this.state.userData.titularName || ''}
                                     onChange={this.handleForm.bind(this)} id="titularName" name="titularName"
                                     type="text"
                                     className="account-input classToValidate" data-error=".errorTxt9"
                                     autoComplete="off"/>
                              {/* <input placeholder="Nombres" value={this.state.userData.name || ''} onChange={this.handleForm.bind(this)} id="name" name="name" type="text" className="account-input" data-error=".errorTxt2" autoComplete="off"></input> */}
                            </div>
                            <div className="col-xs-10 errorTxt9"/>
                          </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 account-container">
                          <div className="row">
                            <div className="col-xs-10 input-flex">
                              <input placeholder={'Apellidos del titular'}
                                     value={this.state.userData.titularLastName || ''}
                                     onChange={this.handleForm.bind(this)} id="titularLastName" name="titularLastName"
                                     type="text"
                                     className="account-input classToValidate" data-error=".errorTxt10"
                                     autoComplete="off"/>
                              {/* <input placeholder="Nombres" value={this.state.userData.name || ''} onChange={this.handleForm.bind(this)} id="name" name="name" type="text" className="account-input" data-error=".errorTxt2" autoComplete="off"></input> */}
                            </div>
                            <div className="col-xs-10 errorTxt10"/>
                          </div>
                        </div>
                        <div className="col-xs-12 col-sm-6 account-container">
                          <div className="row">
                            <div className="col-xs-10 input-flex">
                              <input placeholder={'Documento de identidad del titular'}
                                     value={this.state.userData.titularId || ''}
                                     onChange={this.handleForm.bind(this)} id="titularId" name="titularId" type="text"
                                     className="account-input classToValidate" data-error=".errorTxt11"
                                     autoComplete="off"/>
                              {/* <input placeholder="Apellidos" value={this.state.userData.lastname || ''} onChange={this.handleForm.bind(this)} id="lastname" name="lastname" type="text" className="account-input" data-error=".errorTxt3" autoComplete="off"></input> */}
                            </div>
                            <div className="col-xs-10 errorTxt11"/>
                          </div>
                        </div>


                        <div className="col-xs-12 col-sm-12 account-container">
                          <div className="row">
                            <div className="col-xs-5 input-flex">

                              <select
                                value={this.state.selectCountry}
                                onChange={this.handleCountry.bind(this)}
                                id="lCountries"
                                name={'lCountries'}
                                className="account-input"
                                style={{height: '3.7em', color: '#C7C7CD', fontFamily: "Tofino-Bold"}}
                                data-error=".errorTxt12"
                              >
                                <option value={'0'} disabled>Selecciona un País</option>

                                {this.state.lCountries.map((country, index) => {
                                  return <option key={index + country.a01Nombre} style={{color: 'black'}}
                                                 value={country.a01Codigo}>{country.a01Nombre}</option>
                                })}
                              </select>
                            </div>
                            <div className="col-xs-12 errorTxt12"/>
                          </div>
                        </div>


                        {this.state.lStates.length > 0 ? <div className="col-xs-12 col-sm-12 account-container">
                          <div className="row">
                            <div className="col-xs-5 input-flex">

                              <select
                                value={this.state.selectState}
                                onChange={this.handleState.bind(this)}
                                id="lStates"
                                name="lStates"
                                className="account-input"
                                style={{height: '3.7em', color: '#C7C7CD', fontFamily: "Tofino-Bold"}}
                                data-error=".errorTxt13">
                                <option value={'0'} disabled>Selecciona un Departamento</option>

                                {this.state.lStates.map((state, index) => {
                                  return <option key={index + state.a02Nombre} style={{color: 'black'}}
                                                 value={state.a02Codigo}>{state.a02Nombre}</option>
                                })}

                              </select>

                            </div>
                            <div className="col-xs-12 errorTxt13"/>
                          </div>
                        </div> : null}

                        {this.state.lProvinces.length > 0 ? <div className="col-xs-12 col-sm-12 account-container">
                          <div className="row">
                            <div className="col-xs-5 input-flex">

                              <select
                                value={this.state.selectProvince}
                                onChange={this.handleProvince.bind(this)}
                                id="lProvinces"
                                name="lProvinces"
                                className="account-input"
                                style={{height: '3.7em', color: '#C7C7CD', fontFamily: "Tofino-Bold"}}
                                data-error=".errorTxt14">
                                <option value={'0'} disabled>Selecciona un Provincia</option>

                                {this.state.lProvinces.map((province, index) => {
                                  return <option key={index + province.a03Nombre} style={{color: 'black'}}
                                                 value={province.a03Codigo}>{province.a03Nombre}</option>
                                })}

                              </select>

                            </div>
                            <div className="col-xs-12 errorTxt14"/>
                          </div>
                        </div> : null}

                        {this.state.lCities.length > 0 ? <div className="col-xs-12 col-sm-12 account-container">
                          <div className="row">
                            <div className="col-xs-5 input-flex">

                              <select
                                value={this.state.selectCity}
                                onChange={this.handleCity.bind(this)}
                                id="lCities"
                                name="lCities"
                                className="account-input"
                                style={{height: '3.7em', color: '#C7C7CD', fontFamily: "Tofino-Bold"}}
                                data-error=".errorTxt15">
                                <option value={'0'} disabled>Selecciona un Distrito / Ciudad</option>

                                {this.state.lCities.map((city, index) => {
                                  return <option key={index + city.a04Nombre} style={{color: 'black'}}
                                                 value={city.a04Codigo}>{city.a04Nombre}</option>
                                })}

                              </select>
                            </div>
                            <div className="col-xs-12 errorTxt15"/>
                          </div>
                        </div> : null}


                        <div className="col-xs-12 col-sm-6 account-container">
                          <div className="row">
                            <div className="col-xs-10 input-flex">
                              <input placeholder={this.state.pageTexts[9]} value={this.state.userData.direction || ''}
                                     onChange={this.handleForm.bind(this)} id="direction" name="direction" type="text"
                                     className="account-input classToValidate" data-error=".errorTxt16"
                                     autoComplete="off"/>
                              {/* <input placeholder="Dirección de residencia" value={this.state.userData.direction || ''} onChange={this.handleForm.bind(this)} id="direction" name="direction" type="text" className="account-input" data-error=".errorTxt6" autoComplete="off"></input> */}
                            </div>
                            <div className="col-xs-10 errorTxt16"/>
                          </div>
                        </div>

                        <div className="col-xs-12 col-sm-6 account-container">

                          <div className="row">
                            <div className="col-xs-10 input-flex">

                              <p style={{textAlign: "justify", marginTop: 0}}>
                                Indica la institución donde labora el titular del curso.
                              </p>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-xs-10 input-flex">

                              <select
                                value={this.state.entityIndex}
                                onChange={this.handleEntity.bind(this)}
                                id="entity"
                                name="entity"
                                className="account-input"
                                style={{height: '3.7em', color: '#C7C7CD', fontFamily: "Tofino-Bold"}}
                                data-error=".errorTxt17">
                                <option value="">Selecciona una entidad</option>

                                {this.state.allEntities.map((entity, index) => {
                                  return <option key={index + entity.name} style={{color: 'black'}}
                                                 value={index}>{entity.name}</option>
                                })}

                              </select>

                            </div>
                            <div className="col-xs-5 col-xs-offset-6 errorTxt17"/>
                          </div>
                        </div>


                        {/*<div className="col-xs-12 col-sm-6 account-container">*/}
                          {/*<div className="row">*/}
                            {/*<div className="col-xs-10 input-flex">*/}
                              {/*<input placeholder={this.state.pageTexts[10]} className="account-input classToValidate"*/}
                                     {/*id="phone"*/}
                                     {/*name="phone" value={this.state.userData.phone || ''} type="tel"*/}
                                     {/*onChange={this.handleForm.bind(this)} data-error=".errorTxt18"/>*/}
                              {/*/!* <input placeholder="Celular" className="account-input" id="phone" name="phone" value={this.state.userData.phone || ''} type="tel" onChange={this.handleForm.bind(this)} data-error=".errorTxt8"></input> *!/*/}
                            {/*</div>*/}
                            {/*<div className="col-xs-10 errorTxt18"/>*/}
                          {/*</div>*/}
                        {/*</div>*/}

                        {/*<div className="col-xs-12 col-sm-6 account-container">*/}
                          {/*<div className="row">*/}
                            {/*<div className="col-xs-10 input-flex">*/}
                              {/*<input placeholder={this.state.pageTexts[11]} className="account-input classToValidate"*/}
                                     {/*id="homePhone"*/}
                                     {/*name="homePhone" value={this.state.userData.homePhone || ''}*/}
                                     {/*onChange={this.handleForm.bind(this)} type="tel" data-error=".errorTxt19"/>*/}
                              {/*/!* <input placeholder="Teléfono" className="account-input" id="homePhone" name="homePhone" value={this.state.userData.homePhone || ''} onChange={this.handleForm.bind(this)} type="tel" data-error=".errorTxt9 "></input> *!/*/}
                            {/*</div>*/}
                            {/*<div className="col-xs-10 errorTxt19"/>*/}
                          {/*</div>*/}
                        {/*</div>*/}

                      </div>

                    </div>
                  }
                })()}

                <div className="col-xs-11 page-content">
                  <div className="col-xs-12">
                    <div className="row">
                      <div className="col-xs-12 action-container">
                        <button className="account-button mousePoint" type="submit"
                                disabled={this.state.isRegisterDisabled}>{this.state.pageTexts[12]}</button>
                        {/* <button className="account-button mousePoint" type="submit">Regístrate</button> */}
                      </div>
                      <div className="col-xs-12 action-container">
                        <p>
                          {this.state.pageTexts[13]}
                          {/* ¿Ya tienes una cuenta? */}

                          <Link to={hrefLogin} className="mousePoint"
                                style={{color: 'white'}}> &nbsp; {this.state.pageTexts[14]}.
                            {/* <Link to={hrefLogin} className="mousePoint" style={{color: 'white'}}> &nbsp; Inicia sesión. */}
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            </div>

          </div>

        </div>

        <LoginFooter/>
      </div>
    )
  }
}

CreateAccount.contextTypes = {
  router: React.PropTypes.object
}
