import React from 'react'

class CallButton extends React.Component {
  constructor() {
    super();
  }

  // funcion que maneja el evento click en el boton llamar
  handleCall(onlyvoice) {
    // llamo la funcion que llama al que está en linea
    if (this.props.onStreaming) {
      this.props.onEndCall.call(null)
    } else {
      if (onlyvoice) {
        this.setState({ video: false })
      }
      this.props.onCallPartner.call(null, onlyvoice)
    }
  }

  // funcion que quita o pone el udio y el video
  onChangeTracks(audio) {
    // se crea el tipo de track que se va a fectar
    let trackType = audio ? 1 : 2
    // se mira el tipo de accion que se va a realizar
    let actionType = audio ? (this.props.buttonAudio ? 1 : 2) : (this.props.buttonVideo ? 1 : 2)
    // se llama el metodo
    console.log('onChangeTracks CallButton', trackType, actionType);
    this.props.onChangeTracks.call(null, trackType, actionType)
  }

  onShareScreen(){
    if(this.props.buttonShare){
      this.props.onShareScreen.call(null)
    }else{
      this.props.onStopShareScreen.call(null)
    }
  }

  // funcion que quita o pone el udio y el video
  onShareBoard() {
    // se llama el metodo
    this.props.onShareBoard.call(null)
  }

  // Pausa la llamada con el usuario actual
  onPauseCall() {
    this.props.onPauseCall.call(null)
  }

  // se ejecuta cuando el componente ya esté montado
  componentDidMount() {
    // $('.tooltipped').tooltip({ delay: 50 })
  }

  // cuando el componente va a ser desmontado
  componentWillUnmount() {
    // $(".material-tooltip").remove()
  }

  callStopCam(){
    this.props.stopCamShare.call(null)
  }

  render() {
    let classColor = this.props.onStreaming ? "button-round red" : "button-round green"
    let iconAudio = this.props.buttonAudio ? 'mic' : 'mic_off'
    let iconVideo = this.props.buttonVideo ? 'videocam' : 'videocam_off'
    let iconScreen = this.props.buttonShare ? 'screen_share' : 'stop_screen_share'

    return (
      <div className="call-buttons">
        {(() => {
          if( this.props.onStreaming == null &&
              ((this.props.userRole == "learner") || (this.props.userRole != "learner" && this.props.selectedUser))
            ) {
            // if(this.props.userRole == "learner" && this.props.onStreaming == null) {
            return  <div className="call-buttons-container">
              <div onClick={this.handleCall.bind(this,true)}
                   className="button-round"
                   // style={{background: '#67B968'}}
                   title="Llamada sin video">
                <i className="material-icons">mic</i>
              </div>

              <div onClick={this.handleCall.bind(this,false)}
                   className={classColor}
                   // style={{background: '#67B968'}}
                   title="Llamada con voz y video">
                <i className="material-icons">videocam</i>
              </div>

            </div>
            // es estudiante y no esta en pausa
          } else if(this.props.onStreaming != null && !this.props.imStudentPaused){
            return  <div className="call-buttons-container">
              <a onClick={this.onChangeTracks.bind(this,true)} className="button-round" title="Compartir audio">
                <i className="material-icons">{iconAudio}</i>
              </a>
              <a onClick={this.onChangeTracks.bind(this,false)} className="button-round" title="Compartir video">
                <i className="material-icons">{iconVideo}</i>
              </a>

              <a onClick={this.onShareScreen.bind(this)} className="button-round" title="Compartir pantalla">
                <i className="material-icons">{iconScreen}</i>
              </a>

            </div>
          }
        })()}
        {(() => {
          if(this.props.onStreaming != null && this.props.userRole == "teacher") {
            return  <div onClick={this.onShareBoard.bind(this)} className="button-round" title="Mostrar pizarra">
              <i className="material-icons">subtitles</i>
            </div>
          }
        })()}

        {(() => {
          if(this.props.onStreaming != null && this.props.userRole == "teacher") {
            return  <div onClick={this.onPauseCall.bind(this)} className="button-round" title="Pausar llamada">
              <i className="material-icons">phone_paused</i>
            </div>
          }
        })()}

        {(() => {
          if(this.props.onStreaming == null && this.props.userRole == "teacher") {
            return  <div onClick={this.callStopCam.bind(this)} className="button-round" title="Liberar camara">
              <i className="material-icons">info</i>
            </div>
          }
        })()}
        {(() => {
          if(this.props.onStreaming != null) {
            return  <div onClick={this.handleCall.bind(this)} className="button-round red darken-3" title="Finalizar llamada">
              <i className="material-icons">call_end</i>
            </div>
          }
        })()}

      </div>
    )
  }
}

export default CallButton
