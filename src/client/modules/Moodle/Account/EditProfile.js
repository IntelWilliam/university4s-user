import React from 'react'
import accountStore from 'src/client/modules/Moodle/Account/AccountStore'
import Cropper from 'cropperjs'
import LocationStore from "../CreateAccount/LocationStore";

class EditProfile extends React.Component {
  constructor() {
    super()
    this.state = {
      userData: [],
      cropper: null,
      imageSelected: false,

      lCountries: [],
      lStates: [],
      lProvinces: [],
      lCities: [],

      selectCountry: '',
      selectState: '',
      selectProvince: '',
      selectCity: '',


      lCountriesUser: [],
      lStatesUser: [],
      lProvincesUser: [],
      lCitiesUser: [],

      selectCountryUser: '',
      selectStateUser: '',
      selectProvinceUser: '',
      selectCityUser: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    $("#formlogin").validate({

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
        titularId: {
          required: true,
          minlength: 5,
          number: true
        },
        titularName: {
          required: true,
          minlength: 2
        },
        titularLastName: {
          required: true,
          minlength: 2
        },
        direction: {
          required: true,
          minlength: 5
        },
        phone: {
          number: true
        },
        homePhone: {
          number: true
        },

        lCountries: {
          required: true,
        },
        lStates: {
          required: true,
        },
        lProvinces: {
          required: true,
        },
        lCities: {
          required: true,
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

        titularId: {
          required: "Ingrese el Documento de identidad del titular",
          minlength: "Ingrese al menos 5 caracteres",
          number: "Ingrese un numero valido"
        },
        titularName: {
          required: "Ingrese el Nombre del titular",
          minlength: "Ingrese al menos 5 caracteres"
        },
        titularLastName: {
          required: "Ingrese los apellidos del titular",
          minlength: "Ingrese al menos 5 caracteres"
        },
        direction: {
          required: "Ingrese la Dirección",
          minlength: "Ingrese al menos 5 caracteres"
        },
        phone: {
          number: "Ingrese un numero valido"
        },
        homePhone: {
          number: "Ingrese un numero valido"
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
    this.loadCountries()
    this.loadCountriesUser()
  }

  handleSubmit() {
    // se crea un arreglo de los datos a actualizar
    var toSave = this.state.userData;
    delete toSave['_id']
    delete toSave['email']
    delete toSave['learningLanguages']
    delete toSave['role']
    delete toSave['userIdDev']
    delete toSave['__v']

    toSave['titularCountry'] = this.state.selectCountry
    toSave['titularState'] = this.state.selectState
    toSave['titularProvince'] = this.state.selectProvince
    toSave['titularCity'] = this.state.selectCity

    toSave['userCountry'] = this.state.selectCountryUser
    toSave['userState'] = this.state.selectStateUser
    toSave['userProvince'] = this.state.selectProvinceUser
    toSave['userCity'] = this.state.selectCityUser

    // se llama la accion que actualiza un usuario
    accountStore.update(JSON.parse(localStorage.user)._id, toSave, (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        // se setea el mensaje a mostrar
        var json_object = JSON.parse(localStorage.user); // convert string to object
        json_object["profileImg"] = this.state.userData.profileImg; // add value
        json_object["name"] = this.state.userData.name; // add value
        json_object["lastname"] = this.state.userData.lastname; // add value
        localStorage.user = JSON.stringify(json_object); // store it again.

        swal({
          title: this.props.pageTexts[40],
          text: this.props.pageTexts[41],
          // title: "Actualizado.",
          // text: "Sus datos han sido actualizados con éxito!",
          confirmButtonColor: "#DD6B55",
          confirmButtonText: this.props.pageTexts[42],
          // confirmButtonText: "Continuar",
          type: "info",
        }).then(() => {
          this.context.router.push('/user-area/')
        })

      }
    })

  }

  componentWillMount() {
    this.loadData()
  }

  loadData() {
    accountStore.getOne(JSON.parse(localStorage.user)._id, (err, response) => {
      if (err)
        return console.log('err', err);
      // se cambia el estado allLessons con los nuevos usuarios

      if ('titularCountry' in response.data[0]) {
        this.setState({
          selectCountry: response.data[0].titularCountry
        })
        this.loadStates(response.data[0].titularCountry)
      }
      if ('titularState' in response.data[0]) {
        this.setState({
          selectState: response.data[0].titularState
        })
        this.loadProvinces(response.data[0].titularState)
      }
      if ('titularProvince' in response.data[0]) {
        this.setState({
          selectProvince: response.data[0].titularProvince
        })
        this.loadCities(response.data[0].titularProvince)
      }
      if ('titularCity' in response.data[0]) {
        this.setState({
          selectCity: response.data[0].titularCity
        })
      }

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
    })
  }

  handleForm(event) {
    let item = this.state.userData;
    item[event.target.name] = event.target.value;
    this.setState({userData: item})
  }

  loadFile(event) {
    this.setState({imageSelected: true})


    var output = document.getElementById('image');
    output.src = URL.createObjectURL(event.target.files[0]);
    var dataimg = {};
    dataimg.userPhoto = URL.createObjectURL(event.target.files[0])

    console.log('dataimg: ',dataimg);

    var image = document.querySelector('#image');
    this.state.cropper = new Cropper(image, {
      dragMode: 'move',
      viewMode: 1,
      aspectRatio: 1,
      autoCropArea: 0.5,
      cropBoxResizable: false,
      toggleDragModeOnDblclick: false,
      zoomable: true,
      ready: this.ready.bind(this),
    });

  }

  ready() {
    this.state.cropper.setData({width: 350, height: 350})
  }

  confirm() {
    var croppedCanvas;
    var finalImage;
    var result = document.getElementById('result');
    // Crop
    croppedCanvas = this.state.cropper.getCroppedCanvas({width: 350, height: 350});
    // Show
    finalImage = document.createElement('img');
    finalImage.src = croppedCanvas.toDataURL()

    this.state.cropper.getCroppedCanvas({width: 350, height: 350}).toBlob((blob) => {
      var formData = new FormData();
      formData.append('userPhoto', blob);

      accountStore.uploadImage(formData, (err, response) => {
        if (err) {
          console.log("err", err)
          return
        }

        let item = this.state.userData;
        item.profileImg = response.data;
        this.setState({userData: item})
      })

    }, "image/jpeg")

    result.innerHTML = '';
    result.appendChild(finalImage);
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

  loadCountries() {
    LocationStore.get_countries((err, res) => {
      if (err)
        console.log('LocationStore err: ', err);
      this.setState({
        lCountries: res
      })
    })
  }

  loadStates(id) {
    LocationStore.get_states({a01Codigo: id}, (err, res) => {
      if (err)
        console.log('LocationStore err: ', err);
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
      console.log('res', res);
      this.setState({
        lCities: res
      })
    })
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

  render() {
    return (
      <form className="login-form formValidate account-login-form" id="formlogin" method="POST"
            enctype="multipart/form-data">

        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12">
              <div className="info-title-section-container" style={{marginTop: "2em"}}>
                <div className="pdf-icon-container">
                  <img className="pdf-icon" src="/images/usuario-perfil-negra.png"/>
                </div>
                <div className="info-title-container">
                  <span className="info-title">{this.props.pageTexts[15]}</span>
                  {/* <span className="info-title">Datos de alumno</span> */}
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

        <div className="col-xs-12 learner-data-container">
          <div className="row">
            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-6 account-container">
                  <div className="row">
                    <div className="col-xs-6 account-input-text-container">
                  <span className="bold account-input-text">{this.props.pageTexts[16]}
                    {/* <span className="bold account-input-text">Correo Electrónico */}
                  </span>
                    </div>
                    <div className="col-xs-6 input-flex">
                      <input className="account-input" disabled value={this.state.userData.email || ''} id="email"
                             name="email"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-6 account-container">
                  <div className="row">
                    <div className="col-xs-6 account-input-text-container">
                  <span className="bold account-input-text">{this.props.pageTexts[17]}
                    {/* <span className="bold account-input-text">Documento de identidad */}
                    <span style={{
                      color: 'red'
                    }}>
                    &nbsp;*</span>
                  </span>
                    </div>
                    <div className="col-xs-6 input-flex">
                      <input placeholder={this.props.pageTexts[17]} value={this.state.userData.documentID || ''}
                             onChange={this.handleForm.bind(this)} id="documentID" name="documentID"
                             className="account-input" data-error=".errorTxt1" autoComplete="off"/>
                      {/* <input placeholder="Documento de identidad" value={this.state.userData.documentID || ''} onChange={this.handleForm.bind(this)} id="documentID" name="documentID" className="account-input" data-error=".errorTxt1" autocomplete="off"></input> */}
                    </div>
                    <div className="col-xs-6 col-xs-offset-6 errorTxt1"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-6 account-container">
                  <div className="row">
                    <div className="col-xs-6 account-input-text-container">
                  <span className="bold account-input-text">{this.props.pageTexts[18]}
                    {/* <span className="bold account-input-text">Nombre */}
                    <span style={{
                      color: 'red'
                    }}>
                    &nbsp;*</span>
                  </span>
                    </div>
                    <div className="col-xs-6 input-flex">
                      <input value={this.state.userData.name || ''} onChange={this.handleForm.bind(this)} id="name"
                             name="name" className="account-input" data-error=".errorTxt2" autoComplete="off"/>
                    </div>
                    <div className="col-xs-6 col-xs-offset-6 errorTxt2"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-6 account-container">
                  <div className="row">
                    <div className="col-xs-6 account-input-text-container">
                  <span className="bold account-input-text">{this.props.pageTexts[19]}
                    {/* <span className="bold account-input-text">Apellidos */}
                    <span style={{
                      color: 'red'
                    }}>
                    &nbsp;*</span>
                  </span>
                    </div>
                    <div className="col-xs-6 input-flex">
                      <input value={this.state.userData.lastname || ''} onChange={this.handleForm.bind(this)}
                             id="lastname" name="lastname" className="account-input" data-error=".errorTxt3"
                             autoComplete="off"/>
                    </div>
                    <div className="col-xs-6 col-xs-offset-6 errorTxt3"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-12">
              <div className="row">

                <div className="col-xs-6 col-sm-3 account-input-text-container account-container">
              <span className="bold account-input-text">{this.props.pageTexts[20]}
                {/* <span className="bold account-input-text">Imagen de perfil */}
              </span>
                </div>
                <div className="col-xs-6 col-sm-6 account-container">
                  <div className="row">
                    <div className="col-xs-12 col-sm-6 input-flex margin-min">
                      <input className="account-input" placeholder={this.props.pageTexts[21]} disabled="disabled"
                             value={this.state.userData.profileImg || ''}/>
                    </div>

                    <div className="col-xs-12 col-sm-6 mousePoint">
                      <div className="row height-100">
                        <div className="col-xs-12">
                          <div className="leyend-item-account read-color fileContainer height-100">
                            <input type="file" ref="img" id="profileImg" name="profileImg" accept="image/*"
                                   onChange={this.handleForm.bind(this),
                                     this.loadFile.bind(this)}/>
                            <img src="/images/usuario-perfil.png" className="leyend-img"/>
                            <span className="leyend-name">{this.props.pageTexts[22]}</span>
                            {/* <span className="leyend-name">Imagen de perfil</span> */}
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            { this.state.imageSelected ?  <div className="col-xs-12">
              <div className="row">
                <div className="test">
                  <img id="image" style={{
                    maxWidth: '100%'
                  }}/>

                  <div style={{
                    float: 'right'
                  }}>
                    {this.state.imageSelected ?
                      <button className="crop-button bold read-color" type="button"
                              onClick={this.confirm.bind(this)}>Aceptar</button>
                      : null
                    }
                  </div>
                </div>
                <div className="test" id="result"/>
              </div>
            </div> : null }

          </div>
        </div>


        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12">
              <div className="info-title-section-container" style={{
                marginTop: "2em"
              }}>
                <div className="pdf-icon-container">
                  <img className="pdf-icon" src="/images/location.png"/>
                </div>
                <div className="info-title-container">
                  <span className="info-title">{this.props.pageTexts[26] + ' del alumno'}</span>
                  {/* <span className="info-title">Localización</span> */}
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
            <div className="col-xs-12 col-sm-6 account-container">
              <div className="row">
                <div className="col-xs-6 account-input-text-container">
              <span className="bold account-input-text">País<span style={{color: 'red'}}>&nbsp;*</span>
              </span>
                </div>
                <div className="col-xs-6 input-flex">
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
                </div>
                <div className="col-xs-6 col-xs-offset-6 errorTxt126"/>
              </div>
            </div>
          </div>
        </div>

        {this.state.lStatesUser.length > 0 ? <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12 col-sm-6 account-container">
              <div className="row">
                <div className="col-xs-6 account-input-text-container">
        <span className="bold account-input-text">Departamento
          {/* <span className="bold account-input-text">Dirección */}
          <span style={{
            color: 'red'
          }}>
        &nbsp;*</span>
        </span>
                </div>
                <div className="col-xs-6 input-flex">
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
                </div>
                <div className="col-xs-6 col-xs-offset-6 errorTxt223"/>
              </div>
            </div>
          </div>
        </div> : null}

        {this.state.lProvincesUser.length > 0 ? <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12 col-sm-6 account-container">
              <div className="row">
                <div className="col-xs-6 account-input-text-container">
        <span className="bold account-input-text">Provincia
          {/* <span className="bold account-input-text">Dirección */}
          <span style={{
            color: 'red'
          }}>
        &nbsp;*</span>
        </span>
                </div>
                <div className="col-xs-6 input-flex">
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
                </div>
                <div className="col-xs-6 col-xs-offset-6 errorTxt224"/>
              </div>
            </div>
          </div>
        </div> : null}

        {this.state.lCitiesUser.length > 0 ? <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12 col-sm-6 account-container">
              <div className="row">
                <div className="col-xs-6 account-input-text-container">
        <span className="bold account-input-text">Distrito / Ciudad
        <span style={{
          color: 'red'
        }}>
        &nbsp;*</span>
        </span>
                </div>
                <div className="col-xs-6 input-flex">
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
                </div>
                <div className="col-xs-6 col-xs-offset-6 errorTxt225"/>
              </div>
            </div>
          </div>
        </div> : null}





        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12">
              <div className="info-title-section-container" style={{
                marginTop: "2em"
              }}>
                <div className="pdf-icon-container">
                  <img className="pdf-icon" src="/images/user-data.png"/>
                </div>
                <div className="info-title-container">
                  <span className="info-title">{this.props.pageTexts[23]}</span>
                  {/* <span className="info-title">Datos del titular</span> */}
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

        <div className="col-xs-12 learner-data-container">
          <div className="row">

            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-6 account-container">
                  <div className="row">
                    <div className="col-xs-6 account-input-text-container">
                <span className="bold account-input-text">{this.props.pageTexts[24]}
                  {/* <span className="bold account-input-text">Documento de identidad del titular */}
                  <span style={{
                    color: 'red'
                  }}>
                  &nbsp;*</span>
                </span>
                    </div>
                    <div className="col-xs-6 input-flex">
                      <input value={this.state.userData.titularId || ''} placeholder={this.props.pageTexts[24]}
                             onChange={this.handleForm.bind(this)} id="titularId" name="titularId"
                             className="account-input" data-error=".errorTxt4" autocomplete="off"/>
                      {/* <input value={this.state.userData.titularId || ''} placeholder="Documento de identidad" onChange={this.handleForm.bind(this)} id="titularId" name="titularId" className="account-input" data-error=".errorTxt4" autocomplete="off"></input> */}
                    </div>
                    <div className="col-xs-6 col-xs-offset-6 errorTxt4"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-6 account-container">
                  <div className="row">
                    <div className="col-xs-6 account-input-text-container">
                <span className="bold account-input-text">{this.props.pageTexts[25]}
                  {/* <span className="bold account-input-text">Nombre completo del titular */}
                  <span style={{
                    color: 'red'
                  }}>
                  &nbsp;*</span>
                </span>
                    </div>
                    <div className="col-xs-6 input-flex">
                      <input value={this.state.userData.titularName || ''} placeholder={this.props.pageTexts[25]}
                             onChange={this.handleForm.bind(this)} id="titularName" name="titularName"
                             className="account-input" data-error=".errorTxt5" autoComplete="off"/>
                      {/* <input value={this.state.userData.titularName || ''} placeholder="Nombre completo del titular" onChange={this.handleForm.bind(this)} id="titularName" name="titularName" className="account-input" data-error=".errorTxt5" autocomplete="off"></input> */}
                    </div>
                    <div className="col-xs-6 col-xs-offset-6 errorTxt5"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-6 account-container">
                  <div className="row">
                    <div className="col-xs-6 account-input-text-container">
                <span className="bold account-input-text">{'Apellidos del titular'}
                  <span style={{color: 'red'}}>&nbsp;*</span>
                </span>
                    </div>
                    <div className="col-xs-6 input-flex">
                      <input value={this.state.userData.titularLastName || ''} placeholder={this.props.pageTexts[25]}
                             onChange={this.handleForm.bind(this)} id="titularLastName" name="titularLastName"
                             className="account-input" data-error=".errorTxt75" autoComplete="off"/>
                    </div>
                    <div className="col-xs-6 col-xs-offset-6 errorTxt75"/>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="col-xs-12 learner-data-container">
          <div className="row">
            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-6 account-container">
                  <div className="row">
                    <div className="col-xs-6 account-input-text-container">
              <span className="bold account-input-text">País
                {/* <span className="bold account-input-text">Dirección */}
                <span style={{
                  color: 'red'
                }}>
                &nbsp;*</span>
              </span>
                    </div>
                    <div className="col-xs-6 input-flex">
                      <select
                        value={this.state.selectCountry}
                        onChange={this.handleCountry.bind(this)}
                        id="lCountries"
                        name={'lCountries'}
                        className="account-input"
                        style={{height: '3.7em', color: '#C7C7CD', fontFamily: "Tofino-Bold"}}
                        data-error=".errorTxt16"
                      >
                        <option value={''} disabled>Selecciona un País</option>

                        {this.state.lCountries.map((country, index) => {
                          return <option key={index + country.a01Nombre} style={{color: 'black'}}
                                         value={country.a01Codigo}>{country.a01Nombre}</option>
                        })}
                      </select>
                    </div>
                    <div className="col-xs-6 col-xs-offset-6 errorTxt16"/>
                  </div>
                </div>
              </div>
            </div>

            {this.state.lStates.length > 0 ? <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-6 account-container">
                  <div className="row">
                    <div className="col-xs-6 account-input-text-container">
              <span className="bold account-input-text">Departamento
                {/* <span className="bold account-input-text">Dirección */}
                <span style={{
                  color: 'red'
                }}>
                &nbsp;*</span>
              </span>
                    </div>
                    <div className="col-xs-6 input-flex">
                      <select
                        value={this.state.selectState}
                        onChange={this.handleState.bind(this)}
                        id="lStates"
                        name="lStates"
                        className="account-input"
                        style={{height: '3.7em', color: '#C7C7CD', fontFamily: "Tofino-Bold"}}
                        data-error=".errorTxt23">
                        <option value={''} disabled>Selecciona un Departamento</option>

                        {this.state.lStates.map((state, index) => {
                          return <option key={index + state.a02Nombre} style={{color: 'black'}}
                                         value={state.a02Codigo}>{state.a02Nombre}</option>
                        })}

                      </select>
                    </div>
                    <div className="col-xs-6 col-xs-offset-6 errorTxt23"/>
                  </div>
                </div>
              </div>
            </div> : null}

            {this.state.lProvinces.length > 0 ? <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-6 account-container">
                  <div className="row">
                    <div className="col-xs-6 account-input-text-container">
              <span className="bold account-input-text">Provincia
                {/* <span className="bold account-input-text">Dirección */}
                <span style={{
                  color: 'red'
                }}>
                &nbsp;*</span>
              </span>
                    </div>
                    <div className="col-xs-6 input-flex">
                      <select
                        value={this.state.selectProvince}
                        onChange={this.handleProvince.bind(this)}
                        id="lProvinces"
                        name="lProvinces"
                        className="account-input"
                        style={{height: '3.7em', color: '#C7C7CD', fontFamily: "Tofino-Bold"}}
                        data-error=".errorTxt24">
                        <option value={''} disabled>Selecciona un Provincia</option>

                        {this.state.lProvinces.map((province, index) => {
                          return <option key={index + province.a03Nombre} style={{color: 'black'}}
                                         value={province.a03Codigo}>{province.a03Nombre}</option>
                        })}

                      </select>
                    </div>
                    <div className="col-xs-6 col-xs-offset-6 errorTxt24"/>
                  </div>
                </div>
              </div>
            </div> : null}

            {this.state.lCities.length > 0 ? <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-6 account-container">
                  <div className="row">
                    <div className="col-xs-6 account-input-text-container">
              <span className="bold account-input-text">Distrito / Ciudad
                {/* <span className="bold account-input-text">Dirección */}
                <span style={{
                  color: 'red'
                }}>
                &nbsp;*</span>
              </span>
                    </div>
                    <div className="col-xs-6 input-flex">
                      <select
                        value={this.state.selectCity}
                        onChange={this.handleCity.bind(this)}
                        id="lCities"
                        name="lCities"
                        className="account-input"
                        style={{height: '3.7em', color: '#C7C7CD', fontFamily: "Tofino-Bold"}}
                        data-error=".errorTxt25">
                        <option value={''} disabled>Selecciona un Distrito / Ciudad</option>

                        {this.state.lCities.map((city, index) => {
                          return <option key={index + city.a04Nombre} style={{color: 'black'}}
                                         value={city.a04Codigo}>{city.a04Nombre}</option>
                        })}
                      </select>
                    </div>
                    <div className="col-xs-6 col-xs-offset-6 errorTxt25"/>
                  </div>
                </div>
              </div>
            </div> : null}


            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-6 account-container">
                  <div className="row">
                    <div className="col-xs-6 account-input-text-container">
              <span className="bold account-input-text">{this.props.pageTexts[27]}
                {/* <span className="bold account-input-text">Dirección */}
                <span style={{
                  color: 'red'
                }}>
                &nbsp;*</span>
              </span>
                    </div>
                    <div className="col-xs-6 input-flex">
                      <input value={this.state.userData.direction || ''} onChange={this.handleForm.bind(this)}
                             id="direction" name="direction" className="account-input" data-error=".errorTxt6"
                             autoComplete="off"/>
                    </div>
                    <div className="col-xs-6 col-xs-offset-6 errorTxt6"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-6 account-container">
                  <div className="row">
                    <div className="col-xs-6 account-input-text-container">
              <span className="bold account-input-text">{this.props.pageTexts[28]}
                {/* <span className="bold account-input-text">Movil */}
              </span>
                    </div>
                    <div className="col-xs-6 input-flex">
                      <input className="account-input" id="phone" name="phone" value={this.state.userData.phone || ''}
                             onChange={this.handleForm.bind(this)} data-error=".errorTxt7"/>
                    </div>
                    <div className="col-xs-6 col-xs-offset-6 errorTxt7"/>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 col-sm-6 account-container">
                  <div className="row">
                    <div className="col-xs-6 account-input-text-container">
              <span className="bold account-input-text">{this.props.pageTexts[29]}
                {/* <span className="bold account-input-text">Teléfono casa */}
              </span>
                    </div>
                    <div className="col-xs-6 input-flex">
                      <input className="account-input" id="homePhone" name="homePhone"
                             value={this.state.userData.homePhone || ''} onChange={this.handleForm.bind(this)}
                             data-error=".errorTxt8 "/>
                    </div>
                    <div className="col-xs-6 col-xs-offset-6 errorTxt8"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xs-12 section-name">
            <div className="col-xs-12">
              <div className="row">
                <div className="col-xs-12 action-container">
                  {/* <button className="account-button mousePoint">Actualizar</button> */}
                  <button className="account-button mousePoint" type="submit">{this.props.pageTexts[30]}</button>
                  {/* <button className="account-button mousePoint" type="submit">Actualizar</button> */}
                  <button onClick={this.loadData.bind(this)} type="button"
                          className="account-button red-button mousePoint">{this.props.pageTexts[31]}</button>
                  {/* <button onClick={this.loadData.bind(this)} type="button" className="account-button red-button mousePoint">Limpiar</button> */}
                </div>
              </div>
            </div>
          </div>

        </div>
      </form>

    )
  }
}

EditProfile.contextTypes = {
  router: React.PropTypes.object
}

export default EditProfile
