import React from 'react'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'
import LocationStore from "../CreateAccount/LocationStore";
import accountStore from 'src/client/modules/Moodle/Account/AccountStore'
import SubExamLevelItem from "../Exams/SubExamLevelItem";

class SwornDeclaration extends React.Component {
  constructor() {
    super()
    this.state = {
      isAccept: false,

      userData: [],

      lCountriesUser: [],
      lStatesUser: [],
      lProvincesUser: [],
      lCitiesUser: [],

      selectCountryUser: '',
      selectStateUser: '',
      selectProvinceUser: '',
      selectCityUser: '',

      isFormValid: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    let toRoute = this.props.location.pathname + this.props.location.search
    toRoute = toRoute.replace("declaration", "exams");

    console.log('toRoute', toRoute);

    this.context.router.push(toRoute)

  }

  componentDidMount() {
    $('#formDeclaration').on('blur keyup change', 'input', (event) => {
      var valid = $('#formDeclaration').validate().checkForm();

      if (valid != this.state.isFormValid)
        this.setState({
          isFormValid: valid
        })
    });

    $("#formDeclaration").validate({
      rules: {
        documentID: {
          required: true,
          minlength: 5,
          number: true
        },
        name: {
          required: true,
          minlength: 2
        },
        lastname: {
          required: true,
          minlength: 2
        },
        direction: {
          required: true,
          minlength: 5
        },
        lCountriesUser: {
          required: true,
        },
        lStatesUser: {
          required: true,
        },
        lProvincesUser: {
          required: true,
        },
        lCitiesUser: {
          required: true,
        },
        agree: {
          required: true
        }
      },
      //custom messages
      messages: {
        documentID: {
          required: "Ingrese su Documento de identidad",
          minlength: "Ingrese al menos 5 caracteres",
          number: "Ingrese un numero valido"
        },
        name: {
          required: "Ingrese su Nombre",
          minlength: "Ingrese al menos 2 caracteres"
        },
        lastname: {
          required: "Ingrese sus Apellidos",
          minlength: "Ingrese al menos 2 caracteres"
        },
        direction: {
          required: "Ingrese la Dirección",
          minlength: "Ingrese al menos 5 caracteres"
        },

        lCountriesUser: {
          required: "Selecciona un País",
        },
        lStatesUser: {
          required: "Selecciona un Departamento",
        },
        lProvincesUser: {
          required: "Selecciona un Provincia",
        },
        lCitiesUser: {
          required: "Selecciona un Distrito / Ciudad",
        },
        agree: {
          required: 'Declare estar de acuerdo'
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
      submitHandler: this.handleSubmit.bind(this)
    })
    this.loadCountriesUser()
  }

  componentWillMount() {
    this.loadData()
  }

  loadData() {
    accountStore.getOne(JSON.parse(localStorage.user)._id, (err, response) => {
      if (err)
        return console.log('err', err);

      console.log('response', response);


      // localizacion Usuario
      if ('titularCountry' in response.data[0]) {
        this.setState({
          selectCountryUser: response.data[0].userCountry
        })
        this.loadStatesUser(response.data[0].userCountry)
      }
      if ('titularState' in response.data[0]) {
        this.setState({
          selectStateUser: response.data[0].userState
        })
        this.loadProvincesUser(response.data[0].userState)
      }
      if ('titularProvince' in response.data[0]) {
        this.setState({
          selectProvinceUser: response.data[0].userProvince
        })
        this.loadCitiesUser(response.data[0].userProvince)
      }
      if ('titularCity' in response.data[0]) {
        this.setState({
          selectCityUser: response.data[0].userCity
        })
      }

      this.setState({userData: response.data[0]})
      console.log('response.data[0]', response.data[0]);
    })
  }

  handleForm(event) {
    let item = this.state.userData;
    item[event.target.name] = event.target.value;
    this.setState({userData: item})
  }

  // User
  handleCountryUser(e) {
    this.setState({
      selectCountryUser: e.target.value,
    })
    this.loadStatesUser(e.target.value)
  }

  handleStateUser(e) {
    this.setState({
      selectStateUser: e.target.value,
    })
    this.loadProvincesUser(e.target.value)
  }

  handleProvinceUser(e) {
    this.setState({
      selectProvinceUser: e.target.value,
    })
    this.loadCitiesUser(e.target.value)
  }

  handleCityUser(e) {
    this.setState({
      selectCityUser: e.target.value,
    })
    // this.loadStatesUser(e.target.value)
  }

  loadCountriesUser() {
    LocationStore.get_countries((err, res) => {
      if (err)
        console.log('LocationStore err: ', err);
      this.setState({
        lCountriesUser: res
      })
    })
  }

  loadStatesUser(id) {
    LocationStore.get_states({a01Codigo: id}, (err, res) => {
      if (err)
        console.log('LocationStore err: ', err);
      this.setState({
        lStatesUser: res
      })
    })
  }

  loadProvincesUser(id) {
    LocationStore.get_provinces({a02Codigo: id}, (err, res) => {
      if (err)
        console.log('LocationStore err: ', err);
      this.setState({
        lProvincesUser: res
      })
    })
  }

  loadCitiesUser(id) {
    LocationStore.get_cities({a03Codigo: id}, (err, res) => {
      if (err)
        console.log('LocationStore err: ', err);
      this.setState({
        lCitiesUser: res
      })
    })
  }

  goBack() {
    window.history.back();
  }

  render() {
    let navigationArray = []
    let headerInfo = {
      title: "Declaración jurada ética y moral",
    }


    return (
      <div style={{
        background: "#F6F7F7"
      }}>
        <HeaderPage navigation={navigationArray} headerInfo={headerInfo} tutorial={true} borderTittle="true"/>

        <div className="container gray-font" style={{marginTop: '2em', 'marginBottom': '3em'}}>
          <div className="col-xs-12 ">

            <form className="login-form formValidate account-login-form" id="formDeclaration"
                  encType="multipart/form-data">

              <p className={'bold m-y-0'}>EXAMEN DE EVALUACIÓN</p>
              <p className={'bold m-y-0'}>AKRON ENGLISH</p>
              <p className={'bold m-t-0 m-b-20'}>Antes de dar el examen deberá llenar este formulario</p>
              <p className={'bold m-y-30'}>DECLARACIÓN JURADA ÉTICA Y MORAL DE PARTICIPACIÓN HONESTA EN LA
                EVALUACIÓN POR
                INTERNET</p>

              <div className="row">
                <div className="col-xs-12 col-sm-6">
                  <p className='bold'>Yo<span style={{color: 'red'}}>&nbsp;*</span>:</p>
                  <input
                    id="name"
                    name="name"

                    value={this.state.userData.name || ''}
                    onChange={this.handleForm.bind(this)}

                    className="account-input"
                    type="text"
                    autoComplete="name"
                    data-error=".errorTxt223"
                    placeholder={'Nombre'}/>
                  <div className="col-xs-12 col-sm-6 error-msg errorTxt223"/>

                </div>
                <div className="col-xs-12 col-sm-6">
                  <p>&nbsp;</p>
                  <input
                    id="lastname"
                    name="lastname"

                    value={this.state.userData.lastname || ''}
                    onChange={this.handleForm.bind(this)}

                    className="account-input"
                    type="text"
                    autoComplete="lastname"
                    data-error=".errorTxt224"
                    placeholder={'Apellido'}/>
                  <div className="col-xs-12 col-sm-6 error-msg errorTxt224"/>
                </div>

                <div className="col-xs-12 col-sm-6">
                  <p className='bold'>Identificado con D.N.I. Nº<span style={{color: 'red'}}>&nbsp;*</span>:</p>
                  <input
                    value={this.state.userData.documentID || ''}
                    onChange={this.handleForm.bind(this)}
                    autoComplete="off"
                    id="documentID"
                    name="documentID"
                    className="account-input"
                    data-error=".errorTxt2321"
                    type="text"/>
                  <div className="col-xs-12 col-sm-6 error-msg errorTxt2321"/>
                </div>

                <div className="col-xs-12">
                </div>

                <div className="col-xs-12 col-sm-6">
                  <p className='bold'>Domiciliado en<span style={{color: 'red'}}>&nbsp;*</span>:</p>
                  <input
                    id="direction"
                    name="direction"

                    value={this.state.userData.direction || ''}
                    onChange={this.handleForm.bind(this)}

                    autoComplete={'address'}
                    className="account-input"
                    data-error=".errorTxt323"
                    type="text"/>
                  <div className="col-xs-12 col-sm-6 error-msg errorTxt323"/>
                </div>

                <div className="col-xs-12">
                </div>

                <div className="col-xs-12 col-sm-6">
                  <p className="bold ">País<span style={{color: 'red'}}>&nbsp;*</span>
                  </p>
                  <select value={this.state.selectCountryUser}
                          onChange={this.handleCountryUser.bind(this)}
                          id="lCountriesUser"
                          name={'lCountriesUser'}
                          className="account-input"
                          style={{height: '3.7em', color: '#C7C7CD', fontFamily: "Tofino-Bold"}}
                          data-error=".errorTxt126">
                    <option value={''} disabled>Selecciona un País</option>

                    {this.state.lCountriesUser.map((country, index) => {
                      return <option key={index + country.a01Nombre} style={{color: 'black'}}
                                     value={country.a01Codigo}>{country.a01Nombre}</option>
                    })}
                  </select>
                  <div className="col-xs-6 error-msg errorTxt126"/>
                </div>

                {this.state.lStatesUser.length > 0 ?
                  <div className="col-xs-12 col-sm-6">
                    <p className="bold ">Departamento
                      <span style={{color: 'red'}}>&nbsp;*</span>
                    </p>
                    <select
                      value={this.state.selectStateUser}
                      onChange={this.handleStateUser.bind(this)}
                      id="lStatesUser"
                      name="lStatesUser"
                      className="account-input"
                      style={{height: '3.7em', color: '#C7C7CD', fontFamily: "Tofino-Bold"}}
                      data-error=".errorTxt223">
                      <option value={''} disabled>Selecciona un Departamento</option>

                      {this.state.lStatesUser.map((state, index) => {
                        return <option key={index + state.a02Nombre} style={{color: 'black'}}
                                       value={state.a02Codigo}>{state.a02Nombre}</option>
                      })}

                    </select>
                    <div className="col-xs-6 error-msg errorTxt223"/>
                  </div> : null}

                {this.state.lProvincesUser.length > 0 ?
                  <div className="col-xs-12 col-sm-6">
                    <p className="bold">Provincia<span
                      style={{color: 'red'}}>&nbsp;*</span></p>
                    <select
                      value={this.state.selectProvinceUser}
                      onChange={this.handleProvinceUser.bind(this)}
                      id="lProvincesUser"
                      name="lProvincesUser"
                      className="account-input"
                      style={{height: '3.7em', color: '#C7C7CD', fontFamily: "Tofino-Bold"}}
                      data-error=".errorTxt224">
                      <option value={''} disabled>Selecciona un Provincia</option>

                      {this.state.lProvincesUser.map((province, index) => {
                        return <option key={index + province.a03Nombre} style={{color: 'black'}}
                                       value={province.a03Codigo}>{province.a03Nombre}</option>
                      })}

                    </select>
                    <div className="col-xs-6 error-msg errorTxt224"/>
                  </div> : null}

                {this.state.lCitiesUser.length > 0 ?
                  <div className="col-xs-12 col-sm-6">
                    <p className="bold ">Distrito / Ciudad<span
                      style={{color: 'red'}}>&nbsp;*</span></p>
                    <select
                      value={this.state.selectCityUser}
                      onChange={this.handleCityUser.bind(this)}
                      id="lCitiesUser"
                      name="lCitiesUser"
                      className="account-input"
                      style={{height: '3.7em', color: '#C7C7CD', fontFamily: "Tofino-Bold"}}
                      data-error=".errorTxt225">
                      <option value={''} disabled>Selecciona un Distrito / Ciudad</option>

                      {this.state.lCitiesUser.map((city, index) => {
                        return <option key={index + city.a04Nombre} style={{color: 'black'}}
                                       value={city.a04Codigo}>{city.a04Nombre}</option>
                      })}
                    </select>
                    <div className="col-xs-6 error-msg errorTxt225"/>
                  </div> : null}


              </div>

              <p className={'bold m-t-30'}>DECLARO BAJO JURAMENTO LO SIGUIENTE:</p>
              <ol>
                <li>No uso ni usaré ningún tipo de copia, libro, plagio, etc. que me ayude a efectuar el examen de
                  inglés.
                </li>
                <li>No pido ni pediré ayuda para dar mi examen ni por teléfono, ni vía internet, ni otro medio físico o
                  virtual.
                </li>
                <li>No tengo ni tendré ninguna persona a mi lado que me ayude a rendir mi examen.
                </li>
                <li>No tengo problemas mentales y de salud.
                </li>
                <li>Que soy mayor de edad, en caso contrario mi padre o apoderado llenará esta declaración.
                </li>
                <li>No voy a difundir bajo ningún medio escrito, virtual, oral, el examen que estoy dando, afín de
                  mantener la confidencialidad del mismo.
                </li>
                <li>Soy totalmente responsable de los conocimientos vertidos en el examen por tanto en caso de salir
                  aprobado, asumo la responsabilidad educativa y pedagógica con respecto al certificado que emita AKRON
                  ENGLISH.
                </li>
                <li>No falsificaré mi nombre ni apellidos.
                </li>
                <li>No reemplazaré a ninguna persona.
                </li>
                <li>Soy totalmente responsable de mi clave de acceso para dar exámenes por tanto asumo la
                  responsabilidad
                  del llenado del mismo, bajo mi nombre y código.
                </li>
                <li>En caso de participar en un Concurso Público, presentaré la DECLARACIÓN JURADA ÉTICA Y MORAL DE
                  PARTICIPACIÓN HONESTA EN LA EVALUACIÓN POR INTERNET junto con todos los certificados emitidos por
                  AKRON
                  ENGLISH y la Universidad Privada San Pedro de Chimbote.
                </li>
              </ol>

              <p className={'m-y-30'}>La presente declaración lo realizo en honor a la verdad, en caso de falta a la fe
                pública me someto a las
                sanciones de ley;
              </p>

              <label htmlFor="agree" className={'m-y-30 bold'}>He llenado el formulario correctamente y declaro estar
                totalmente de acuerdo</label>
              <input
                type="checkbox"
                id="agree"
                data-error=".errorTxt32"

                name="agree"/>
              <div className="col-xs-6 error-msg errorTxt32"/>


              <div className="col-xs-12 action-container">
                <button type={'submit'}
                        className={
                          this.state.isFormValid ?
                            'solution-button mousePoint m-y-2em m-r-20' :
                            'solution-button mousePoint m-y-2em m-r-20 opacity-5'
                        }>Acepto
                </button>
                <button type={'button'} onClick={this.goBack.bind(this)}
                        className="solution-button mousePoint back-button">No acepto
                </button>
              </div>

            </form>

          </div>
        </div>
      </div>
    )
  }

}
SwornDeclaration.contextTypes = {
  router: React.PropTypes.object
}

export default SwornDeclaration
