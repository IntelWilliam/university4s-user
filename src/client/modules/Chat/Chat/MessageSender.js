import React from 'react'
import ChatStore from 'src/client/modules/Chat/Chat/ChatStore.js'
import { Line, Circle } from 'rc-progress';

export default class MessageSender extends React.Component {
  constructor() {
    super();

    this.state = {
      percent: null,
      loadFiles: []
    }
  }

  // funcion que maneja el evento cuando se escribe
  sendMessage(event) {
    // console.log('event', event);
    // llamo la funcion que detecta la letra presionada
    this.props.onlyLetters.call(null, event);
  }

  // funcion que maneja el evento click en el boton enviar
  sendMessageButton() {
    // llamo la funcion que envía el mensaje
    this.props.handleClick.call(null);
  }

  addFile() {
    this.refs['addFile'].click()
  }

  uploadFile(e, blob) {
    console.log('uploadFile', e, blob);
    const file = blob ? blob : e.target.files[0];
    // max upload size is 5MB
    if (file.size > 20971520) {
      console.log('max upload size is 5MB')
      swal({title: 'Error!', text: 'Tamaño maximo 5Mb.', timer: 3000}).then(() => {
      }, () => {
      })

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

      ChatStore.uploadFile(formData, file.name, (err, resp, fileName) => {
        this.setState({
          loadFiles: this.state.loadFiles.filter((v) => {
            return v.fileName !== fileName
          })
        });

        $('#input-message').val("")
        $('.emoji-wysiwyg-editor').empty();
        $('#input-message').focus()

        if (err) {
          swal({title: 'Error!', text: 'Error subiendo el archivo.', timer: 3000}).then(() => {}, () => {})
          console.log('err', err);
        } else {
          console.log('body', resp);

          if ('result' in resp) {
            // if('fileRenamed' in resp){
            console.log('fileRenamed in resp');
            // this.props.handleUpload.call(null, resp.result.data.fileRenamed )
            this.props.handleUpload.call(null, resp.result.data.fileRenamed)
          } else {
            console.log('no esta');
          }
        }

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
    this.props.emojiPicker.discover()

    let newInput = $('.emoji-wysiwyg-editor')
    newInput.keypress((e) => {
      // console.log('keypress');
      this.sendMessage(e)
    });

    $('body').bind('paste', (e) => {
      if ($(".emoji-wysiwyg-editor").is(':focus')) {
        e.preventDefault();
        e.stopPropagation();

        var items = (e.clipboardData || e.originalEvent.clipboardData).items;
        console.log("items", items); // will give you the mime types

        if (items) {
          //access data directly
          for (var i = 0; i < items.length; i++) {
            console.log("items[i]", items[i]);
            if (items[i].type.includes("image")) {

              //image
              var blob = items[i].getAsFile();
              console.debug(blob);

              if (blob)
                this.uploadFile(this, blob)

            }
          }
        }
        else {
          //wait for DOMSubtreeModified event
          //https://bugzilla.mozilla.org/show_bug.cgi?id=891247
        }
      }
    });


  }

  render() {
    let disabled = !this.props.isEnabled;

    return (
      <div className="chat-sender">


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

        <div className="row">
          <div className="col-xs-9">
            <span className="input-chat-container ">
              <input
                id="input-message"
                data-emojiable="true"
                placeholder="Escribir consulta"
                className="input-chat"
                type="text"
                disabled={disabled}
                // onKeyPress={this.sendMessage.bind(this)}
              />
              <div className="triangle-right">
                <div className="inner-triangle"></div>
              </div>
            </span>
          </div>

          <div className="col-xs-3" style={{display: 'grid'}}>
            <button className="chat-button" onClick={this.addFile.bind(this)} title="Adjuntar archivo"><i
              className="material-icons">attach_file</i></button>
            {/* <button className="chat-button" onClick={this.addFile.bind(this)} style={{
              marginRight: '0.5em'
            }}>Adjuntar</button> */}

            <form encType="multipart/form-data">
              <input ref="addFile" onChange={this.uploadFile.bind(this)} className="chat-send-file" type="file" style={{
                display: 'none'
              }}></input>
            </form>

            {/* </div>

            <div className="col-xs-2"> */}
            <button className="chat-button" onClick={this.sendMessageButton.bind(this)} title="Enviar mensaje"><i
              className="material-icons">send</i></button>
            {/* <button className="chat-button" onClick={this.sendMessageButton.bind(this)}>Enviar</button> */}

          </div>


        </div>


      </div>

    )
  }
}
