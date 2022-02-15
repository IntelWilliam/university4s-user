import React from 'react'
import ChatStore from 'src/client/modules/Chat/Chat/ChatStore.js'

export default class MessageSender extends React.Component {
  // funcion que maneja el evento cuando se escribe
  sendMessage(event) {
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

  uploadFile(e) {
    console.log('uploadFile');
    var file = e.target.files[0];
    // max upload size is 5MB
    if (file.size > 5242880) {
      console.log('max upload size is 5MB')
      swal({title: 'Error!', text: 'Tamaño maximo 5Mb.', timer: 3000}).then(() => {}, () => {})

    } else {

      var blobFile = e.target.files[0];
      var formData = new FormData();
      formData.append("file", blobFile);

      swal({title: 'Subiendo!', text: 'El archivo se esta subiendo.'}).then(() => {}, () => {})

      ChatStore.uploadFile(formData, (err, resp) => {

        swal.close()

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

      })

    }
  }

  componentDidMount() {
    this.props.emojiPicker.discover()

    let newInput = $('.emoji-wysiwyg-editor')
    newInput.keypress((e)=>{
      // console.log('keypress');
      this.sendMessage(e)
    } );
  }

  render() {
    // let disabled = !this.props.isEnabled;
    return (<div className="chat-sender">
      <div className="row">
        <div className="col-xs-9">
          <span className="input-chat-container ">
            <input
              id="input-message"
              data-emojiable="true"
              placeholder="Escribir mensaje"
              className="input-chat"
              type="text"
              // onKeyPress={this.sendMessage.bind(this)}
            />
            <div className="triangle-right">
              <div className="inner-triangle"></div>
            </div>
          </span>
        </div>

        <div className="col-xs-3" style={{ display: 'grid'}}>
          <button className="chat-button" onClick={this.addFile.bind(this)} title="Adjuntar archivo"><i className="material-icons">attach_file</i></button>

          <form encType="multipart/form-data">
          <input ref="addFile" onChange={this.uploadFile.bind(this)} className="chat-send-file" type="file" style={{
            display: 'none'
          }}></input>
        </form>

        <button className="chat-button" onClick={this.sendMessageButton.bind(this)} title="Enviar mensaje"><i className="material-icons">send</i></button>

      </div>

    </div>

  </div>

)
}
}
