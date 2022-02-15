/*
+ Esta clase permite controlar las funciones de una conexión peer to peer
*/
class WebRTCController {
  constructor() {
      this.pc_config = {
        'iceServers': [{
          'urls': 'stun:192.241.151.135:3478'
        }, {
          'urls': 'turn:192.241.151.135:3478',
          'credential': 'QAH2953h',
          'username': 'akronTurn'
        }]
      }
      this.pc = null
      this.testStream = null
    }
    // este metodo crea una descripcion para hacer una oferta de conexion peer to peer
  createPeerConnectionOffer(localStream) {
    // console.log("createPeerConnectionOffer - pc_config", this.pc_config);
    try {
      // se crea un objeto local pc de peer conection
      this.pc = new RTCPeerConnection(this.pc_config)
      // se especifica el metodo que se llama cuando genere mi candidato

      // se especifica el metodo que se llama cuando el peer remoto añade un streaming
      this.pc.ontrack = this.reciveRemoteStreamAdded.bind(this)

      // añado mi streaming local para que el peer remoto pueda obtenerlo
      if(localStream){
        // console.log("localStream", localStream);
        // console.log("this.pc", this.pc);
        this.pc.addStream(localStream)
      }

      // creo una oferta para mandarsela al prospecto peer remoto
      let arrayReceive = {
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1
      }
      this.pc.createOffer(arrayReceive).then(
        this.setLocalAndSendOffer.bind(this),
        this.onCreateSessionDescriptionError
      )

      this.pc.onicecandidate = this.reciveCandidate.bind(this)
      // console.log("Created RTCPeerConnnection with config:\n" + "  \"" +
        // JSON.stringify(this.pc_config) + "\".")
    } catch (e) {
      console.log("Failed to create PeerConnection, exception: " + e)
      return
    }

  }

  renegotiateCreatePeerConnectionOffer(localStream){
    // añado mi streaming local para que el peer remoto pueda obtenerlo
    if(localStream){
      this.pc.removeStream(localStream)
      this.pc.addStream(localStream)
      // localStream.getTracks().forEach(track => this.pc.addTrack(track, localStream));

    }
      // creo una oferta para mandarsela al prospecto peer remoto
    let arrayReceive = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }

    this.pc.createOffer(arrayReceive).then(
      this.setLocalAndSendOffer.bind(this),
      this.onCreateSessionDescriptionError
    )
  }

  getPc(){
    return this.pc
  }

  reSetPc(){
    this.pc = null
  }

  renegotiateCreatePeerConnectionAnswer( localStream, sessionDescription) {

    if(localStream){
      this.pc.removeStream(localStream)
      this.pc.addStream(localStream)
      // localStream.getTracks().forEach(track => this.pc.addTrack(track, localStream));
    }

    // añado mi streaming local para que el peer remoto pueda obtenerlo
    this.pc.setRemoteDescription(new RTCSessionDescription(sessionDescription)).then(
      this.onSetSessionDescriptionSuccess,
      this.onSetSessionDescriptionError
    )
    this.createAnswer()

  }

  addLocalStream(localStream){
    this.pc.addStream(localStream)
    // localStream.getTracks().forEach(track => this.pc.addTrack(track, localStream));
  }

  addNewStream(localStream) {
    // añado mi streaming local para que el peer remoto pueda obtenerlo
    this.pc.addStream(localStream)
    // localStream.getTracks().forEach(track => this.pc.addTrack(track, localStream));
  }

  // este metodo crea una descripcion para hacer una oferta de conexion peer to peer
  createPeerAdminConnectionOffer() {
    try {
      // se crea un objeto local pc de peer conection
      this.pc = new RTCPeerConnection(this.pc_config)
        // se especifica el metodo que se llama cuando genere mi candidato
      this.pc.onicecandidate = this.reciveCandidate.bind(this)
      // console.log("Created RTCPeerConnnection with config:\n" + "  \"" +
        // JSON.stringify(this.pc_config) + "\".")
    } catch (e) {
      console.log("Failed to create PeerConnection, exception: " + e)
      return
    }
    // se especifica el metodo que se llama cuando el peer remoto añade un streaming
    this.pc.ontrack = this.reciveRemoteStreamAdded.bind(this)
      // creo una oferta para mandarsela al prospecto peer remoto
    this.pc.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then(
      this.setLocalAndSendOffer.bind(this),
      this.onCreateSessionDescriptionError
    )

  }

  onCreateSessionDescriptionError(error) {
    console.log('Failed to create session description: ' + error.toString())
    stop()
  }

  // este metodo crea una descripcion para responder a una oferta de conexion peer to peer
  createPeerConnectionAnswer(localStream, sessionDescription) {

    try {
      // se crea un objeto local pc de peer conection
      this.pc = new RTCPeerConnection(this.pc_config)

      // se especifica el metodo que se llama cuando el peer remoto añade un streaming
      this.pc.ontrack = this.reciveRemoteStreamAdded.bind(this)

      if(localStream){
        this.pc.addStream(localStream)
      }

      // añado mi streaming local para que el peer remoto pueda obtenerlo
      this.pc.setRemoteDescription(new RTCSessionDescription(sessionDescription)).then(
        this.onSetSessionDescriptionSuccess,
        this.onSetSessionDescriptionError
      )

      this.createAnswer()

      // se especifica el metodo que se llama cuando genere mi candidato
      this.pc.onicecandidate = this.reciveCandidate.bind(this)
    } catch (e) {
      console.log("Failed to create PeerConnection, exception: " + e.message)
      return
    }

  }

  // agrego la descripción local del que me respondio para establecer finalmente la conexion
  createCallerRemoteDescription(sessionDescription) {
    this.pc.setRemoteDescription(new RTCSessionDescription(sessionDescription)).then(
      this.onSetSessionDescriptionSuccess,
      this.onSetSessionDescriptionError
    )
  }

  onSetSessionDescriptionSuccess() {
    console.log('Set session description success.')
  }

  onSetSessionDescriptionError() {
    console.log('Set session description error.')
  }


  // creo una respuesta al haber aceptado la llamada
  createAnswer() {
    // se crea la respuesta a oferta
    this.pc.createAnswer().then(
      this.setLocalAndSendAnswer.bind(this),
      this.onCreateSessionDescriptionError
    )
  }

  // recibo el evento candidato y lo retransmito
  reciveCandidate(event) {
    this.onIceCandidate(event)
  }

  // evento cuando agrego una descripción remota puedo enviarme como candidato
  onIceCandidate() {}


  // recibo el evento stream y lo retransmito
  reciveRemoteStreamAdded(event) {
    console.log("reciveRemoteStreamAdded", event);
    this.onRemoteStreamAdded(event)
  }

  // evento que me da el streaming del peer remoto
  onRemoteStreamAdded() {}

  // capturo la descripción de la orferta que creo
  setLocalAndSendOffer(sessionDescription) {
    // console.log("entra a setLocalAndSendOffer", sessionDescription.sdp)
    // guardo la descripción local de la nueva conexion peer
    this.pc.setLocalDescription(sessionDescription).then(
      this.onSetSessionDescriptionSuccess,
      this.onSetSessionDescriptionError
    );
    // disparo el evento para enviar mi oferta
    this.onSendOffer(sessionDescription)
  }

  // obtengo la descripcion a la respuesta
  setLocalAndSendAnswer(sessionDescription) {
    // console.log("envio la respuesta", sessionDescription.sdp)
      // agrego mi descripcion local
    this.pc.setLocalDescription(sessionDescription).then(
      this.onSetSessionDescriptionSuccess,
      this.onSetSessionDescriptionError
    );
      // emito mi descripción para enviar una respuesta
    this.onSendAnswer(sessionDescription)
  }



  // agrego un candidato
  addIceCandidate(candidate) {
    console.log("addIceCandidate", candidate);
    this.pc.addIceCandidate(
      new RTCIceCandidate(candidate)
    ).then(
      this.onAddIceCandidateSuccess,
      this.onAddIceCandidateError
    )
  }

  onAddIceCandidateSuccess() {
    console.log('AddIceCandidate success.')
  }

  onAddIceCandidateError(error) {
    console.log('Failed to add Ice Candidate: ' + error.toString())
  }

  endCall() {
    console.log("endCall()");
    if (this.pc) {
      this.pc.close()
      this.pc = null
    }
  }

  // evento para enviar una oferta a la persona en linea
  onSendOffer() {}

  // evento para enviar una oferta a la persona en linea
  onSendAnswer() {}

}
// se exporta la instancia
export default WebRTCController
