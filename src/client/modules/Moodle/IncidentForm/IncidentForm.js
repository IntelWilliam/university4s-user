import React from 'react'
import IncidentFormStore from 'src/client/modules/Moodle/IncidentForm/IncidentFormStore.js'
import { Line, Circle } from 'rc-progress';

export default class IncidentForm extends React.Component {
  constructor() {
    super()
    this.state = {
      incidentForm: false,
      percent: null,
      userData: [],
      loadFiles: [],
      roomId: null,
      nameAttach:null,
    }
    this.handleUpload = this.handleUpload.bind(this)
  }

  openIncidentForm() {
    this.setState({
      incidentForm: !this.state.incidentForm
    })
  }

  handleForm(event) {
    let item = this.state.userData;
    item[event.target.name] = event.target.value;
    this.setState({userData: item})
    // console.log('userdata: ',this.state.userData);
  }

  loadData() {
    IncidentFormStore.getOne(JSON.parse(localStorage.user)._id, (err, response) => {
      this.setState({userData: response.data[0]})
    })
  }

  addFile(event) {
    event.preventDefault();
    this.refs['addFile'].click()
  }

  handleUpload(fileName){
    const isUrl = true;
  }

  uploadFile(e, blob) {
    console.log('uploadFile', e, blob);
    const file = blob ? blob : e.target.files[0];
    console.log('file: ', file);
    // max upload size is 5MB
    if (file.size > 5242880) {
      console.log('max upload size is 5MB')
      swal({title: 'Error!', text: 'Tamaño maximo 5Mb.', timer: 3000}).then(() => {}, () => {})

    } else {

      let blobFile = file;
      let formData = new FormData();
      formData.append("file", blobFile);

      // swal({title: 'Subiendo!', text: 'El archivo se esta subiendo.'}).then(() => {}, () => {})

      let newLoadFiles = this.state.loadFiles

      newLoadFiles.push({
        fileName: file.name,
        percent: 0
      })

      this.setState({
        loadFiles: newLoadFiles
      })

      IncidentFormStore.uploadFile(formData, file.name, (err, resp, fileName) => {
        this.setState({
          loadFiles: this.state.loadFiles.filter((v) => {
            return v.fileName !== fileName
          })
        });

        let namePhoto;

        $('#input-message').val("")
        $('.emoji-wysiwyg-editor').empty();
        $('#input-message').focus()

        if (err) {
          swal({title: 'Error!', text: 'Error subiendo el archivo.', timer: 3000}).then(() => {}, () => {})
          console.log('err', err);
        } else {
          console.log('body', resp); // resp.result...
          //obteniendo la ruta de la imagen subida al servidor
          namePhoto = resp.result.data.fileRenamed;

          if ('result' in resp) {
            // if('fileRenamed' in resp){
            console.log('fileRenamed in resp');
            // this.props.handleUpload.call(null, resp.result.data.fileRenamed )
            this.handleUpload.call(null, resp.result.data.fileRenamed)
          } else {
            console.log('no esta');
          }
        }

        this.setState({
          nameAttach: namePhoto
        })

      }, (i, fileName) => {
        // console.log('i', i);

        let newLoadFiles = this.state.loadFiles
        newLoadFiles.forEach((element, index) => {
          if(element.fileName === fileName) {
            newLoadFiles[index].percent = i;
          }
        });

        this.setState({
          loadFiles: newLoadFiles
        })
      })


    }
  }


  componentDidMount() {

    $("#formlogin").validate({
      rules: {
        firstAnswer: {
          required: true,
          minlength: 5
        },
        secondAnswer: {
          required: true,
          minlength: 5
        },
        thirdAnswer: {
          required: false,
          minlength: 5
        }
      },
      //For custom messages
      messages: {
        firstAnswer: {
          required: "¿En qué nivel está el incidente?",
          minlength: "Ingrese al menos 5 caracteres"
        },
        secondAnswer: {
          required: "Explica brevemente el incidente",
          minlength: "Ingrese al menos 5 caracteres"
        },
        thirdAnswer: {
          minlength: "Ingrese al menos 5 caracteres"
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
    })

    // this.onload()
  }


  componentWillMount() {
    this.loadData()
  }

  confirm() {

    let formdata = new FormData();

    formdata.append("firstAnswer", this.state.userData.firstAnswer)
    formdata.append("secondAnswer", this.state.userData.secondAnswer)
    formdata.append("thirdAnswer", this.state.userData.thirdAnswer)
    formdata.append("email", this.state.userData.email)
    formdata.append("name", this.state.userData.name)
    formdata.append("lastName", this.state.userData.lastname)
    formdata.append("phone", this.state.userData.phone)
    formdata.append("homePhone", this.state.userData.homePhone)
    formdata.append("titularName", this.state.userData.titularName)
    formdata.append("titularLastName", this.state.userData.titularLastName)
    formdata.append("attach", this.state.nameAttach)

    IncidentFormStore.SendForm(formdata, (err, body) => {

      if (err) {
        swal({
          title: 'Error!',
          text: "La consulta no fue enviada, intente nuevamente!",
          type: 'warning',
          showCancelButton: true,
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Cancelar!',
          cancelButtonText: 'Intentar nuevamente!'
        }).then(() => {
          this.context.router.push('/user-area/')
        })

        return console.log(err);
      }

      swal({
        title: "Enviado",
        text: "¡Su consulta fue enviada exitosamente!",
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Continuar",
        type: "info"
      }).then(() => {
        this.goTop()
      })
    })
  }

  goTop() {
    $("html, body").animate({
      scrollTop: 0
    }, "slow");
    this.setState({
      userData: []
    })
  }


  render() {
    let openMenuClass = this.state.incidentForm ? 'col-xs-12 learner-list-container incident-questions-container-open' : 'col-xs-12 learner-list-container'

    return (
      <div className="col-xs-10 col-ms-12 help-us-to-improve">
        <div className="row">
          <div className="col-xs-12 front" onClick={this.openIncidentForm.bind(this)}>
            <div className="incident-form">
              <div className="img-incident">
                <img src='/images/incident-icon.png' className="incident-image"/>
              </div>
              <div className="incident-header-text-container">
                <span className="user-list-header-text">¡Ayúdanos a mejorar!</span>
              </div>
            </div>
          </div>
        </div>
        <div className={openMenuClass}>
          {(() => {
            return (
              <div className="col-xs-12">
                <div className="incident-list-question">
                  <div className="incident-list-questions-text-container">
                    <form
                      className="login-form formValidate account-login-form"
                      id="formlogin"
                      method="POST"
                      encType="multipart/form-data"
                    >
                      <div className="row">
                        <div className="col-xs-12 incident-container">
                          <div className="row">
                            <div className="title-questions">
                              <span>Reporta un problema</span>
                            </div>
                            <div className="col-xs-12 incident-question-content">
                              <div>
                                <img className="incident-numbering" src='/images/icon_pin.png'></img>
                              </div>
                              <div className="incident-question">
                                <span>¿En qué nivel (inicial, fundamental, operacional) y lección se encuentra?</span>
                              </div>
                            </div>
                            <div className="col-xs-12 input-flex">
                              <textarea
                                rows="1"
                                cols="100"
                                placeholder=''
                                value={this.state.userData.firstAnswer|| ''}
                                onChange={this.handleForm.bind(this)}
                                id="firstAnswer"
                                name="firstAnswer"
                                className="account-input"
                                data-error=".errorTxt1">
                              </textarea>
                            </div>
                            <div className="col-xs-12 errorTxt1"></div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xs-12 incident-container">
                          <div className="row">
                            <div className="col-xs-12 incident-question-content">
                              <div>
                                <img className="incident-numbering" src='/images/icon_pin.png'></img>
                              </div>
                              <div className="incident-question">
                                <span>Cuéntanos qué paso y adjunta una foto.</span>
                              </div>
                            </div>
                            <div className="col-xs-12 input-flex">
                              <textarea
                                rows="1"
                                cols="100"
                                placeholder=''
                                value={this.state.userData.secondAnswer|| ''}
                                onChange={this.handleForm.bind(this)}
                                id="secondAnswer"
                                name="secondAnswer"
                                className="account-input"
                                data-error=".errorTxt2">
                              </textarea>
                            </div>
                            <div className="col-xs-12 errorTxt2"></div>
                          </div>
                          <div className="attach-incident">
                            <button
                              className="chat-button incidentButton"
                              onClick={this.addFile.bind(this)}
                              title="Adjuntar archivo"
                            >
                              Adjuntar foto
                            </button>
                            <input
                              ref="addFile"
                              onChange={this.uploadFile.bind(this)}
                              className="chat-send-file"
                              type="file"
                              style={{display: 'none'}}>
                            </input>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xs-12 incident-container">
                          <div className="row">
                            <div className="title-questions">
                              <span>Envíanos tus recomendaciones</span>
                            </div>
                            <div className="col-xs-12 incident-question-content">
                              <div>
                                <img className="incident-numbering" src='/images/icon_pin.png'></img>
                              </div>
                              <div className="incident-question">
                                <span>
                                  ¿Tienes alguna sugerencia para mejorar tu experiencia con la plataforma?
                                </span>
                              </div>
                            </div>
                            <div className="col-xs-12 input-flex">
                              <textarea
                                rows="1"
                                cols="100"
                                placeholder=''
                                value={this.state.userData.thirdAnswer|| ''}
                                onChange={this.handleForm.bind(this)}
                                id="thirdAnswer"
                                name="thirdAnswer"
                                className="account-input"
                                data-error=".errorTxt3">
                              </textarea>
                            </div>
                            <div className="col-xs-12 errorTxt3"></div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xs-12 account-container">
                        <div className="row">
                        {this.state.loadFiles.map((element, index) => {
                          return (
                            <div key={'loadFiles' + index}>
                              <span>Cargando {element.fileName} ...</span>
                              <Line style={{
                                marginBottom: '0.2em'
                              }} percent={element.percent} strokeWidth="3" strokeColor={
                                element.percent <= 33 ? '#FE8C6A' :
                                  element.percent > 33 && element.percent < 66 ? '#3FC7FA' :
                                    '#85D262'
                              }/>
                            </div>
                          )
                        })}
                          <div className="col-xs-12 incident-buttons">
                            <button
                              className="chat-button incidentButton"
                              id="btnSave"
                              type="submit"
                              title="Enviar mensaje"
                            >
                              Enviar
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>

                  </div>
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    )
  }
}
