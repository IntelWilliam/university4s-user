import React from 'react'
import Chat from 'src/client/modules/Chat/Chat/Chat'
import loginUser from 'src/client/modules/Login/'
import StudentStore from 'src/client/modules/Chat/Student/StudentStore'
import RoomsStore from 'src/client/modules/Chat/Rooms/RoomsStore'
import BoardStore from 'src/client/modules/Chat/Board/BoardStore'
import Main from 'src/client/modules/Chat/Main/Main'
import WebRTCController from 'src/client/modules/Chat/WebRTCController'
import io from 'socket.io-client'
import TeachersStore from 'src/client/modules/Chat/Teachers/TeachersStore'
import Header from 'src/client/modules/layout/header'
import loading from 'src/client/modules/Chat/Modals/loading'
import incoming from 'src/client/modules/Chat/Modals/incoming'
import studentFeedback from 'src/client/modules/Chat/Modals/studentFeedback'
import teacherFeedback from 'src/client/modules/Chat/Modals/teacherFeedback'
import checkModal from 'src/client/modules/Chat/Modals/checkModal'
import Constants from 'src/client/Constants/Constants'

import AnswerCapacityStore from 'src/client/modules/Chat/AnswerCapacityStore'

class VideoChat extends React.Component {
  constructor() {
    super();
    // se envia el this a la funcion updateAuth para acceder a los atributos de la clase desde esta funcion
    this.updateAuth = this.updateAuth.bind(this)
    this.state = {
      canLoadMore: true,
      waitingAnswerStudents: [],
      swalCalling: false,
      imStudentPaused: false,
      usersOffLine: [],
      onTimeConnect : false,
      browserType: 'other',
      vid1: null,
      vid2: null,
      aud1: '',
      audiotracks: null,
      videotracks: null,
      myStream: null,
      myStreamScreen: null,
      onStreaming: null,
      userRole: JSON.parse(localStorage.user).role,
      allTeachers: [],
      allStudents: [],
      pauseCallStudents: [],
      offLineUser: null,
      allRooms: [],
      studentOrder: [],
      allMessages: {},
      isBoardShared: false,
      boardContent: '',
      myTeacher: null,
      user: JSON.parse(localStorage.user),
      roomId: '',
      inCallStudent: null,
      selectedUser: null,
      callStartTime: null,
      remoteAudio: true,
      remoteVideo: true,
      remoteVideoTemp: null,
      buttonAudio: true,
      buttonVideo: true,
      buttonShare: true,
      studentToltip: '',
      toltipAction: '',
      showToltip: '',
      isStream: true,
      isCalling: false,
      newCallData: null
    }
    this.count = 0
    this.remoteStream = null
    this.remoteStreamScreen = null
    this.showPostSessionData = this.showPostSessionData.bind(this)
    this.onConnect = this.onConnect.bind(this)
    this.onTeacherLeave = this.onTeacherLeave.bind(this)
    this.answerCallType = this.answerCallType.bind(this)
    this.hideToltip = this.hideToltip.bind(this)
    this.installExt = this.installExt.bind(this)
      // si es administrador
    if (this.state.userRole == "admin") {
      // conexión con el profesor
      this.teacherConection = new WebRTCController()
        // conxión con el estudiante
      this.studentConection = new WebRTCController()

    } else {
      // conexión con el profesor o estudiante
      this.peerConection = new WebRTCController()

      // conexión para compartir pantalla
      this.peerConectionScreen = new WebRTCController()

        // conexión con el administrador
      this.adminConection = new WebRTCController()
    }
  }

  logout() {
    let socket = this.socket;
    swal({
      title: "Seguro deseas cerrar sesión?",
      text: "No olvides diligenciar la información despúes de cada charla alumno/profesor",
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Si, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then(function() {
      loginUser.logout(() => {
        socket.disconnect();
      })
    })
  }

  componentWillUnmount() {
    // si esta realizando una llamada sin contestar y se sale de la pantalla...
    if(this.state.isCalling){
      this.setState({inCallStudent: null})
      let toRoom = this.state.userRole == 'teacher' ? this.state.allStudents[this.state.inCallStudent?this.state.inCallStudent: this.state.selectedUser].roomId : this.state.roomId
      this.socket.emit('userCancelCall', this.state.user, toRoom );
    }else if(this.state.imStudentPaused){
      let toRoom = this.state.userRole == 'teacher' ? this.state.allStudents[this.state.inCallStudent].roomId : this.state.roomId
      this.socket.emit('endCall', { roomId: toRoom, user: this.state.user })
    }

    this.socket.disconnect();
    this.stopCamShare()
    swal.close()
  }

  saveBoardData(studentId, teacherId, content) {
    BoardStore.createBoard(studentId, teacherId, content, (err, board) => {
      if (err) {
        console.log(err)
      } else {
        // console.log(board)
      }
    })
  }

  // metodo encargado de mandar el estado de la pizarra (si esta compartida o no)
  onBoardShare() {
    this.socket.emit('boardShareState', !this.state.isBoardShared, this.state.allStudents[this.state.inCallStudent].roomId);
    this.setState({ isBoardShared: !this.state.isBoardShared })
  }

  onPauseCall() {
    console.log("onPauseCall");
    console.log('this.state.allStudents', this.state.allStudents);

    // agrega el usuario a la lista de estudiantes en pausa
    let temp  = this.state.pauseCallStudents
    let student = this.state.allStudents[this.state.inCallStudent]
    student.remoteAudio = this.state.remoteAudio
    student.remoteVideo = this.state.remoteVideo

    console.log('student', student);

    temp.push(student)
    this.setState({pauseCallStudents: temp})

    // emite el evento
    let toRoom = this.state.userRole == 'teacher' ? this.state.allStudents[this.state.inCallStudent].roomId : this.state.roomId
    this.socket.emit('pauseCall', { roomId: toRoom })

    this.pauseAll()
  }

  pauseAll() {
    this.peerConection.endCall()
    this.setState({
      onStreaming: null,
      vid1: null,
      remoteAudio: true,
      remoteVideo: true,
      isBoardShared: false,
      buttonAudio: true,
      buttonVideo: true,
      inCallStudent: null
    })

    // se vuelve a la normalidad los videos
    this.refs.mainComponent.playAudio(2)
    this.refs.mainComponent.playVideo(2)

    this.onStopShareScreen(true)
  }

  onResumeCall(student){

    console.log('onResumeCall(student', student);

    // pausa el audio
    if(!student.remoteVideo) {
      this.setState({ remoteVideo: student.remoteVideo })
      this.refs.mainComponent.playVideo(1)
      this.setState({ buttonVideo: false })
    }
    // pausa el video
    if(!student.remoteAudio) {
      this.setState({ remoteAudio: student.remoteAudio })
      this.refs.mainComponent.playAudio(1)
      this.setState({ buttonAudio: false })
    }

    // se borra el estudiante de la lista de estudiantes en pausa
    let temp  = this.state.pauseCallStudents
    var index = temp.indexOf(student);
    if (index > -1) {
      temp.splice(index, 1);
    }
    this.setState({pauseCallStudents: temp})


    if (this.state.myStream) {

      let toRoom = this.state.allStudents[student._id].roomId
      this.setState({inCallStudent: student._id})
      if(!this.state.isStream){
        // reactiva la camara para recibir la llamada
        this.stopCamShare()
      }

      // tambien emite el mismo evento cuando el profesor llama al estudiante
      this.socket.emit('resumeCall', this.state.user, toRoom);

      let loadingNew = loading.replace(/text-to-load/g, "Reconectando");
      swal({
        title: '',
        html: loadingNew,
        showConfirmButton: false
      })
    } else {
      swal("Debes activar tu camara")
    }
    // Si es un administrador llama a el profesor que el haya elegido por tanto llega socketId como parametro
  }

  endCall() {
    if (this.state.userRole == "admin") {
      this.socket.emit('endAdminCall')
      this.restartAllAdmin()
    } else {

      var toRoom
      if(this.state.studentRoomReceived && !this.state.inCallStudent){
        toRoom = this.state.studentRoomReceived
      }else{
        toRoom = this.state.userRole == 'teacher' ? this.state.allStudents[this.state.inCallStudent?this.state.inCallStudent: this.state.selectedUser].roomId : this.state.roomId
      }

      this.socket.emit('endCall', { roomId: toRoom, user: this.state.user })

      this.setState({
        imStudentPaused: false
      })
      this.restartAll()
    }

  }

  loadRooms() {
    // se piden todos los usuarios nuevamente
    RoomsStore.getTeacherCalls((err, response) => {
      console.log('err', err)
      if (err) return
        // se cambia el estado allRooms con las rooms activas
      this.setState({
        allRooms: response,
      })
    })
  }


  showPostSessionData(disconnect) {
    let currentTime = new Date().getTime();
    let timePassed = Math.round(((currentTime - this.state.callStartTime) / 1000) / 60);
    if (timePassed >= 1 && this.state.callStartTime) {
      let state = this.state;
      // verifica que por lo menos ya se conecto una vez con un profesor (this.state.onTimeConnect)
      if (state.userRole == 'learner' && this.state.onTimeConnect) {
        // console.log('showStudentModal 1');
        this.showStudentModal(timePassed, state, (err, succes) => {
          let checkNew = checkModal.replace(/title-to-load/g, "Esperamos verte pronto nuevamente");
          swal({
              title: '',
              html: checkNew
            })
            // busco un nuevo profesor
          if (disconnect) {
            this.setState({ boardContent: '' })
            this.socket.emit('findTeacher', this.state.user)
          }
        });
      } else if (state.userRole == 'teacher') {
        if (this.state.boardContent != '') {
          this.saveBoardData(this.state.user.userIdDev, this.state.allStudents[this.state.inCallStudent].id, this.state.boardContent, (err, board) => {
            console.log(err);
            // console.log(board)
          });
        }

        this.showTeacherModal(state, (err, success) => {
          let checkNew = checkModal.replace(/title-to-load/g, "La información se ha guardado exitosamente");
          swal({
            title: '',
            html: checkNew
          })
          if (success) {
            this.setState({ inCallStudent: null, boardContent: '', callStartTime: null })
          }
        });
      }
    } else {
      if (this.state.userRole == 'learner') {
        if (disconnect) {
          this.socket.emit('findTeacher', this.state.user)
          this.setState({ boardContent: '', callStartTime: null })
        }
      } else if (this.state.userRole == 'teacher') {
        this.setState({ inCallStudent: null, boardContent: '', callStartTime: null })
      }

      if(this.state.imStudentPaused){
        this.setState({
          imStudentPaused: false
        })
      }
      swal("Sesión finalizada");

      // swal({
      //   title: 'Buscando profesor',
      //   text: 'por favor espera mientras te asignamos un profesor.',
      //   showConfirmButton: false
      // })

    }
  }

  showStudentModal(timePassed, state, cb) {

    swal({
      title: "Para poder brindarte un mejor servicio, es importante conocer tu opinión",
      html: studentFeedback,
      showLoaderOnConfirm: true,
    }).then(function() {
      let comments = $('#comments').val();
      let selectedValue = $('.selected-face').data('value');
      let roomId = state.roomId;

      let user = JSON.parse(localStorage.user)


      let data  = {
        userId: user._id,
        userName: user.username,

        time: timePassed,
        comment: comments,
        roomId: roomId,
        score: selectedValue,
        studentId: state.user.userIdDev
      }

      StudentStore.setSessionData(data, (err) => {
        if (err) {
          console.log(err)
          cb(err)
        } else {
          cb(null, 'ok')
        }
      })
    })
  }

  showTeacherModal(state, cb) {
    swal({
      // title: "Reporte de sesión",
      html: teacherFeedback,
      showLoaderOnConfirm: true,
    }).then(function () {
      if (!state.inCallStudent || !state.allStudents[state.inCallStudent] || !state.allStudents[state.inCallStudent].roomId) {
        return cb(null, 'ok')
      }
      let comments = $('#comments').val();
      let lessonStuding = $('#lessonStuding').val();
      let currentLevel = $('input[name="group1"]:checked').val();
      let hasHomework = $('input[name="group2"]:checked').val();

      console.log('state.allStudents', state.allStudents);
      console.log('state.allStudents[state.inCallStudent]', state.allStudents[state.inCallStudent]);


      let data = {
        lessonStuding: lessonStuding,
        currentLevel: currentLevel,
        hasHomework: hasHomework,
        objection: comments,

        userIdDev: state.allStudents[state.inCallStudent].userIdDev,
        userId: state.allStudents[state.inCallStudent]._id,
        userName: state.allStudents[state.inCallStudent].name,
        userEmail: state.allStudents[state.inCallStudent].email,

        teacherIdDev: state.user.userIdDev,
        teacherId: state.user._id,
        teacherName: state.user.name,
        teacherEmail: state.user.email,
      }

      console.log('data', data);

      TeachersStore.saveTeacherRating(data, (err) => {
        if (err) {
          console.log(err)
          cb(err)
        } else {
          cb(null, 'ok')
        }
      })
    })
  }

  restartAll(disconnect) {
    this.peerConection.endCall()
    this.setState({
        onStreaming: null,
        vid1: null,
        remoteAudio: true,
        remoteVideo: true,
        isBoardShared: false,
        buttonAudio: true,
        buttonVideo: true
      })
      // se vuelve a la normalidad los videos
    this.refs.mainComponent.playAudio(2)
    this.refs.mainComponent.playVideo(2)
    swal("Llamada finalizada!")
    if (this.state.userRole == 'learner' || this.state.userRole == 'teacher') {
      this.showPostSessionData(disconnect);
    }
    this.onStopShareScreen(true)
  }

  loadMoreMessage(){
    if(!!this.state.selectedUser){

      let mesagges = this.state.allMessages

      let dataChat ={
        studentId: this.state.selectedUser,
        skipMessages: mesagges[this.state.selectedUser].length
      }

      StudentStore.getChats(dataChat, (err, chats) => {
          // asigno los ultimos chats
        mesagges[this.state.selectedUser] = chats.concat(mesagges[this.state.selectedUser])

        // si llegan 0 mensajes no hay mas para cargar...
        let canLoadMessages = true
        if(chats.length == 0){
          canLoadMessages= false
        }

        this.setState({ allMessages: mesagges, canLoadMore: canLoadMessages})
      })
    }
  }

  userChatStatus(userId, roomId) {
    this.setState({ selectedUser: userId })
    let students = this.state.allStudents
    let student = students[userId]

    // console.log('roomId - userChatStatus', roomId);

    if (roomId == 'offLine'){

      this.findUserOffLine(userId)

      let dataChat ={
        studentId: userId
      }

      StudentStore.getChats(dataChat, (err, chats) => {

        console.log("chats", chats);

        let mesagges = this.state.allMessages
          // asigno los ultimos chats
        console.log('chats', chats);
        mesagges[userId] = chats
        this.setState({ allMessages: mesagges})
      })
    }else{
      this.setState({
        offLineUser: null
      })
    }

    // si el estudiante esta online se resetean sus notificaciones al ser seleccionado
    if (student) {
      student.badge = 0;
      let data = {
        userIdDev: student.userIdDev,
        notifyType: 0, // 1 para llamadas, 2 para mensajes
        notifyNumber: 0, // numero de notificaciones
      }

      StudentStore.addNotify(data, (err, resp)=>{
        if(err){
          console.log('err', err);
        }
        console.log('resp', resp);
      })

      this.setState({ allStudents: students })
    }
  }

  // metodo encargado de notificar que cambio el contenido de la pizarra
  notifyBoardContentChanged(content) {
    this.setState({ boardContent: content })
    this.socket.emit("boardContent", content, this.state.allStudents[this.state.inCallStudent].roomId)
  }

  findStudent(roomId) {
    // se inicia la posición de la frase en null
    let index = null
      // se recorren todas las traducciones
    for (var estudentid in this.state.allStudents) {
      // si la frase de la traduccion actual es igual a la frase que se desea buscar
      if (this.state.allStudents[estudentid].roomId == roomId) {
        // se setea la variable index igual la posicion actual del for
        index = estudentid
          // se rompe el ciclo
        break
      }
    }
    // se retorna la posicion en el arreglo si se encontro si no null
    return index
  }

  restartAllAdmin() {
    this.setState({ onStreaming: null, vid1: null, vid2: null })
      // reinicio conexión con el profesor
    this.teacherConection.endCall()
      // reinicio conexión con el estudiante
    this.studentConection.endCall()
    swal("Llamada finalizada!")
  }

  restartAdminConection() {
    // reinicio conexión con el administrador
    this.adminConection.endCall()
  }

  updateAuth(loggedIn) {
    // si el cambio es negativo se desloguea
    if (!loggedIn) {
      this.context.router.replace('/login')
    }
  }

  // se ejecuta cunado se conecta por real time
  onConnect(user) {
    // emito un evento al servidor para que me conecte
    user.source = 'video-chat'
    this.socket.emit('join', user, (err, user) => {
      if (err){
        console.log("err", err)
        return swal("error de red")
      }
      this.setState({ user: user })
        // console.log("user", user)
      if (this.state.userRole == 'learner') {
        // console.log('user._id', user);
        this.setState({ selectedUser: user._id })
        this.socket.emit('findTeacher', user)
      }
    })
  }

  sortStudents(students, action) {
    var arr = Object.keys(students).map(function(key) {
      return students[key]
    });

    arr.sort((a, b) => {
      if (a.lastMessage != undefined && b.lastMessage != undefined) {
        return b.lastMessage - a.lastMessage
      } else if (a.lastMessage == undefined && b.lastMessage == undefined) {
        return 0;
      } else if (a.lastMessage == undefined) {
        return 1;
      } else {
        return -1;
      }
    })
    let sortedStudentsId = [];
    arr.forEach((student) => {
      sortedStudentsId.push(student._id);
    })

    if (action == "leave") {
      this.setState({ allStudents: students, studentOrder: sortedStudentsId })
    } else {
      this.setState({ studentOrder: sortedStudentsId })
    }
  }

  // cuando un profesor se va
  onTeacherLeave(socketId) {
    if (this.state.myTeacher && (socketId == this.state.myTeacher.socket.id)) {
      if (this.state.onStreaming) {

        this.setState({ onStreaming: null, vid2: null, myTeacher: null })
        this.restartAll(true)
      } else {
        // reinicio my teacher por si no estaba en streaming pero si en chat
        this.setState({ myTeacher: null })
          // busco un nuevo profesor
        this.socket.emit('findTeacher', this.state.user)
      }

    }
  }

  onShareScreen(){
    this.initDetectRTC()
  }

  onStopShareScreen(endCall){

    // let remoteAudio = this.state.remoteAudio
    // console.log('remoteAudio', remoteAudio);

    if(!endCall){
      let roomId = this.state.userRole == 'teacher' ? this.state.allStudents[this.state.inCallStudent].roomId : this.state.roomId
      this.socket.emit('endCallScreen', roomId)
    }

    if(this.state.myStreamScreen){
      let stream = this.state.myStreamScreen
      var track = stream.getTracks()[0];  // if only one media track
      track.stop();
      this.setState({vid2: this.state.myStream})
    }


      if(this.remoteStreamScreen){

        let remoteVideo = this.state.remoteVideoTemp
      // this.setState({ remoteAudio: data.changeType == 1 ? false : true })
        this.setState({
          vid1: this.remoteStream,
          // buttonAudio: true,
          remoteVideo: remoteVideo,
          remoteVideoTemp: true,
          buttonShare: true
        })
      }else{
        this.setState({
          myStreamScreen: null,
          buttonShare: true
        })
      }
      this.remoteStreamScreen= null
      this.peerConectionScreen.endCall()
      this.peerConectionScreen.reSetPc()

      let remoteAudio = this.state.remoteAudio
      this.refs.mainComponent.playAudio(remoteAudio? false : 1)
  }

  learnerAcceptCall(type){
    this.accepCallFuntion({roomId: this.state.roomId})
    if (type == 2) {
      // se quita el video
      console.log('learnerAcceptCall onChangeTracks 2,1');
      this.onChangeTracks(2, 1)
    }
  }

  answerCallType(type, studentId) {
    // console.log("student data", this.state.allStudents[studentId])
    // console.log("type", type)
    createjs.Sound.stop();

    if (type != 1) {

      if(this.state.userRole == 'learner'){
        this.learnerAcceptCall(type)
        return
      }

      // si el estudiante está entre mis estudiantes
      if (studentId in this.state.allStudents) {

        // Se establece el usuario del chat con el de la llamada
        this.userChatStatus(studentId)

        // me uno al room para continuar con el proceso de llamada
        if(!this.state.isStream){
          // reactiva la camara para recibir la llamada
          this.stopCamShare()
        }
        this.socket.emit('acceptCall', { roomId: this.state.allStudents[studentId].roomId })

        if(!this.state.swalCalling){
          let loadingNew = loading.replace(/text-to-load/g, "Conectando");
          swal({
            title: '',
            html: loadingNew,
            showConfirmButton: false
          })
        }

        this.setState({ callStartTime: new Date().getTime(), inCallStudent: studentId })
          // si es solo con audio
        if (type == 2) {
          // se quita el video
          console.log('answerCallType onChangeTracks 2,1');
          this.onChangeTracks(2, 1)
        }
      } else {
        swal("Llamada Cancelada", "El usuario ha cancelado la llamada");
        console.log("El usuario no se encuentra en la lista de usuarios");
      }

    } else {
      // if (studentId in this.state.allStudents) {
        // me uno al room para continuar con el proceso de llamada
        this.socket.emit('CancelledCall',this.state.userRole == 'learner'? this.state.roomId: this.state.allStudents[studentId].roomId)
      // }

      if(this.state.userRole != 'learner'){
        swal("Llamada no concretada", "El usuario será notificado");
      }else{
        swal.close()
      }

    }
  }

  loadOffLineUsersChat(){
    if(this.state.userRole == 'teacher'){
      let query = {
        sortField: 'updatedAt',
        sortType: -1,
        role: "learner",
        excludeStatus: true
      }

      StudentStore.loadOffLineUsersChat(query, (err, resp)=>{
        if(err){
          console.log('loadOffLineUsersChat err', err);
          this.context.router.replace('/login')
        }
        // this.addOffLineUsers(resp)
        // console.log('resp', resp);
        // console.log('usersOffLine', resp);
        this.setState({ usersOffLine: resp })
      })
    }
  }

  findUserOffLine(userIdSelected){

    var users = this.state.usersOffLine

    if(users.length > 0){

      var user = null

      var userIndex = null

      try {
        users.forEach(function(el, i) {
          if(el._id === userIdSelected){
            user = el
            // console.log('i', i);
            userIndex = i
            throw false;
          }
        });
      } catch (e) {
        if (e == false) console.log('Usuario encontrado', e);
      }

      // console.log('user', user);

      // se borran las notificaciones del usuario
      if(user.hasOwnProperty("notifyNumber") && user.notifyNumber > 0){
        let data = {
          userIdDev: user.userIdDev,
          notifyType: 0, // 1 para llamadas, 2 para mensajes
          notifyNumber: 0, // numero de notificaciones
        }
        if(userIndex != null){
          users[userIndex].notifyNumber = 0;
          users[userIndex].notifyType = 0;
          this.setState({ usersOffLine : users })
        }

        StudentStore.addNotify(data, (err, resp)=>{
          if(err){
            console.log('err', err);
          }

          // console.log('resp', resp);
        })
      }



      // console.log('user', user);

      this.setState({
        offLineUser: user
      })
    }

  }

  componentWillMount() {
    $('body').on('click', '.answerCall', (event) => {
      let answerType = event.currentTarget.getAttribute("data-call")
      let studentId = event.currentTarget.getAttribute("data-student-id")

      let temp = this.state.waitingAnswerStudents
      if(temp.length > 0){
        this.makeIncomingCall(temp[0])
        this.setState({waitingAnswerStudents: temp})
        temp.shift()
      }else{
        this.setState({swalCalling: false})
      }

      if(answerType == 4){
        // si se requiere poner llamada entrante en pausa
      }else if(this.state.onStreaming){
        // si esta en llamada pone el usuario actual en pausa y luego responde la llamada.
        this.onPauseCall()
        this.answerCallType(answerType, studentId)
      }else{
        this.answerCallType(answerType, studentId)
      }
    })

    this.loadOffLineUsersChat()

    loginUser.onChange = this.updateAuth
    let user = JSON.parse(localStorage.user)
      // inicio la coneccion real time por socket
    this.socket = io()
      // escucho cuando me conecto
    this.socket.on('connect', () => {
      // inicio la funcion on connect al conectarme
      this.onConnect(user)
        // console.log("me conecto")
    })

    // escucho cada que alguien se conecta
    this.socket.on('joined', (joinedName) => {
      // muestro quien se conectó

      this.loadOffLineUsersChat()
      console.log("se conectó: ", joinedName)
    })

    if (this.state.userRole == "admin") {
      // se cargan los profesores en linea
      this.loadTeachers()
      this.loadRooms();

      // me hacen una oferta de conexion peer to peer
      this.socket.on('teachersChange', () => {
        // console.log("cambiaron los profesores")
        // se recargan los profesores
        this.loadTeachers()
      })

      // cuando cambian los rooms
      this.socket.on('roomsChange', () => {
        // console.log("cambiaron los rooms")
        this.loadRooms();
        // se recargan los rooms
      })

      // escucho el evento que no hay profesores
      this.socket.on('noUser', (callTo) => {
        let msg = callTo == 'teacher' ? "El profesor se ha desconectado!" : "El estudiante se ha desconectado!"
          // muestro quien se conectó
        swal(msg)
      })

      // escucho cuando el room está listo
      this.socket.on('roomAdminReady', (data) => {
        // muestro el id del room al que me uní
        let loadingNew = loading.replace(/text-to-load/g, "Cargando");
        swal({
          title: '',
          html: loadingNew,
          showConfirmButton: false
        })
        let peerSpaceName = data.callTo == 'teacher' ? 'teacherConection' : 'studentConection'
          // se crea una descripccion de mis datos para conexion peer
        this[peerSpaceName].createPeerAdminConnectionOffer()
        if (data.callTo == 'teacher') {
          // me subscribo al evento para cuando llegue un candidato
          this[peerSpaceName].onIceCandidate = this.onIceTeacherCandidate.bind(this)
            // me subscribo al evento para cuando el peer remoto agrege streaming
          this[peerSpaceName].onRemoteStreamAdded = this.onRemoteTeacherStreamAdded.bind(this)
            // me subscribo al evento para cuando esté lista mi descripción se la envíe al que está en linea
          this[peerSpaceName].onSendOffer = this.onSendTeacherOffer.bind(this)
        } else {
          // me subscribo al evento para cuando llegue un candidato
          this[peerSpaceName].onIceCandidate = this.onIceStudentCandidate.bind(this)
            // me subscribo al evento para cuando el peer remoto agrege streaming
          this[peerSpaceName].onRemoteStreamAdded = this.onRemoteStudentStreamAdded.bind(this)
            // me subscribo al evento para cuando esté lista mi descripción se la envíe al que está en linea
          this[peerSpaceName].onSendOffer = this.onSendStudentOffer.bind(this)
        }

      })


      // escucho cuando terminan la llamada
      this.socket.on('endAdminCall', () => {
        // muestro quien se conectó
        if (this.state.onStreaming) {
          this.restartAllAdmin()
        }
      })

    } else {

      // escucho cuando terminan la llamada
      this.socket.on('endCall', (data) => {
        console.log('data.user', data);

        if(data.user._id == this.state.inCallStudent || this.state.userRole == 'learner'){
          if (this.state.vid1 != null || this.state.onStreaming) {
            console.log('endCall**');
            this.restartAll()
          }
        }else{

          let temp  = this.state.pauseCallStudents
          var index;

          temp.forEach((el, i)=>{
            if(el._id == data.user._id)
              return index=i
          })

          // console.log('index', index);

          if (index > -1) {
            temp.splice(index, 1);
          }
          this.setState({pauseCallStudents: temp})
        }
      })

      this.socket.on('changeTeacher', (data) => {
        this.socket.emit('leaveToChange', data )
        data.student = this.state.user,
        // se conecta con el profesor asignado por otro profesor
        this.socket.emit('assignToTeacher', data)



        //envio a otro profesor de un estudiante en llamada o en pausa de llamada
        if(data.hasOwnProperty("remoteAudio") && data.hasOwnProperty("remoteVideo") && !data.hasOwnProperty("studentPaused") ){
          // se guardan los datos para rehacer la llamada con el nuevo profesor
          this.setState({
            newCallData: data
          })
        //  si el estudiante estaba en pausa, se guarda el estado.
        }else if(data.hasOwnProperty("studentPaused")){
          console.log("data.hasOwnProperty studentPaused", data.studentPaused);

          this.setState({
            dataPausedSend: data.studentPaused
          })
        }
      })

      // escucho cuando llega un mensaje
      this.socket.on('message', (data) => {

        // capturo los mensajes actuales
        let mesagges = this.state.allMessages
          // console.log(data, "llega mensaje")
          // agrego el mensaje
        mesagges[data.chat.studentId].push(data.chat)
          // guardo el estado
        this.setState({ allMessages: mesagges })
          // se captura el usuario
        let students = this.state.allStudents
        let student = students[data.chat.studentId]
        playSound('message');
        if (this.state.userRole == 'teacher' && this.state.selectedUser != data.chat.studentId) {
          student.badge++;
          student.lastMessage = new Date().getTime();
          this.sortStudents(students);
          // Materialize.toast(student.name + ' ' + student.lastname + ' ha enviado un mensaje', 1000)
          let actionToltip = { name: "ha enviado un mensaje", action: "connect" }
          this.showToltip(student, actionToltip)

          let data = {
            userIdDev: student.userIdDev,
            notifyType: 2, // 1 para llamadas, 2 para mensajes
            notifyNumber: student.badge, // numero de notificaciones
          }
          StudentStore.addNotify(data, (err, resp)=>{
            if(err){
              console.log('err', err);
            }

            // console.log('resp', resp);
          })


        } else if (this.state.userRole == 'teacher' && this.state.selectedUser == data.chat.studentId) {
          student.badge = 0;
          this.setState({ allStudents: students });
        }

        if( !document.hasFocus() ){
        // if(  this.state.userRole == 'teacher' && !document.hasFocus() ){
            this.notifyMessage(data.chat.message)
          }

      })

      // escucho cuando terminan la llamada
      this.socket.on('endAdminCall', () => {
        // muestro quien se conectó
        this.restartAdminConection()
      })

      // escucho cuando un admin llama y ya crea el room
      this.socket.on('adminRoomCreated', (data) => {
        // muestro el id del room creado
        // console.log("el admin creo el room", data.roomId)
        // me uno a la sala
        this.socket.emit('joinToAdminRoom', { roomId: data.roomId, callTo: data.callTo });
      })


      // me hacen una oferta de conexion peer to peer
      this.socket.on('offer', (msg) => {

        console.log("candidate msg", msg);

        this.setState({
          studentRoomReceived: msg.roomId,
          inCallStudent: msg.studentId
        })

        // llamo el metodo que me permite responder una oferta
        console.log("offer", msg);
        this.onOffer(msg.sessionDescription, msg.callTo)
      })

      // me hacen una oferta de conexion peer to peer
      this.socket.on('offerScreen', (msg) => {
        // console.log("llego la oferta con callTo", msg.callTo)
        // llamo el metodo que me permite responder una oferta
        this.onOfferScreen(msg.sessionDescription, msg.callTo)
      })

    }

    // si hay un candidato
    this.socket.on('candidate', (msg) => {

      // se inicia el nombre de la instancia a asignar el candidato
      let peerSpaceName = 'peerConection'
        // se recorren los casos
      switch (msg.callTo) {
        case 'teacher':
          peerSpaceName = 'teacherConection'
          break;

        case 'learner':
          peerSpaceName = 'studentConection'
          break;

        case 'admin':
          peerSpaceName = 'adminConection'
          break;

        default:
          // no op
      }

      // añado el nuevo candidato
      this[peerSpaceName].addIceCandidate(msg.candidate)
    })

    // si hay un candidato
    this.socket.on('candidateScreen', (msg) => {
      // añado el nuevo candidato
      this.peerConectionScreen.addIceCandidate(msg.candidate)
    })

    this.socket.on('endCallScreen', () => {
      this.onStopShareScreen(true)
    })

    // escucho cuando el profesor pausa la llamada
    this.socket.on('pauseCall', (roomID) => {
      console.log('pauseCall Student', roomID);
      // swal({
      //   title: 'LLamada en pausa',
      //   text: 'por favor espera mientras reanudamos la llamada.',
      //   showConfirmButton: false
      // })

      this.setState({imStudentPaused: true})
    })

    // escucho cuando el profesor pausa la llamada
    this.socket.on('resumeCall', (data) => {
      if( !document.hasFocus() ){
        let mensagge =  data.name + ' ' + data.lastname + ' ha reanudado la llamada'
        this.notifyMessage(mensagge, 'Reanudo llamada')
      }

      this.setState({
        imStudentPaused: false,
        callStartTime: new Date().getTime()
      })
        // muestro el id del room al que me uní
      let loadingNew = loading.replace(/text-to-load/g, "Conectando");
      swal({
        title: '',
        html: loadingNew,
        showConfirmButton: false
      })

      // se crea una descripccion de mis datos para conexion peer
      this.peerConection.createPeerConnectionOffer(this.state.myStream)
        // me subscribo al evento para cuando llegue un candidato
      this.peerConection.onIceCandidate = this.onIceCandidate.bind(this)
        // me subscribo al evento para cuando el peer remoto agrege streaming
      this.peerConection.onRemoteStreamAdded = this.onRemoteStreamAdded.bind(this)
        // me subscribo al evento para cuando esté lista mi descripción se la envíe al que está en linea
      this.peerConection.onSendOffer = this.onSendOffer.bind(this)
    })

    if (this.state.userRole == 'teacher') {
      // escucho cuando un estudiante quiere chatear
      this.socket.on('roomCreated', (data) => {
        // muestro el id del room creado
        // console.log("alguien quiere chatear y creó el room", data.roomId)
        // estudiantes en linea

        let students = this.state.allStudents
        data.student.badge = 0

        if(data.student.notifyNumber && data.student.notifyNumber > 0){
          data.student.badge += data.student.notifyNumber
        }

          // nuevo estudiante
        let student = data.student
          // agrego el id del room del nuevo estudiante
        student.roomId = data.roomId
          // agrego el estudiante a los estudiantes en linea
        students[student._id] = student
        this.sortStudents(students);
        // me uno al room para continuar con el proceso de llamada
        this.socket.emit('joinToRoom', { roomId: data.roomId, teacher: this.state.user })
          // pido los ultimos chats del estudiante


        if(data.makeNotify){
          this.notifyMessage(student.name + " " + student.lastname , "Estudiante transferido")
        }

        let dataChat ={
          studentId: student._id
        }

        console.log("dataChat", dataChat);
        StudentStore.getChats(dataChat, (err, chats) => {

          console.log("chats", chats);

          let mesagges = this.state.allMessages
            // asigno los ultimos chats
          mesagges[student._id] = chats
          this.setState({ allMessages: mesagges, allStudents: students })
          playSound('login');
          let actionToltip = { name: "Se ha conectado", action: "connect" }
          this.showToltip(student, actionToltip)
            // Materialize.toast(student.name + ' ' + student.lastname + ' se ha conectado', 4000)
        })
      })

      // escucho cuando un estudiante se va
      this.socket.on('userLeave', (roomId) => {
        // muestro el id del room creado
        // se busca la posicion del estudiante
        let studentId = this.findStudent(roomId)
          // estudiantes en linea
        let students = this.state.allStudents
          // mensajes de los estudiantes
        let mesagges = this.state.allMessages
          // estudiante que se va
        let student = students[studentId]
          // muestro mensaje del usuario que se va
        playSound('logout');
        // Materialize.toast(student.name + ' ' + student.lastname + ' se ha desconectado', 4000)
        let actionToltip = { name: "Se ha desconectado", action: "" }
        this.showToltip(student, actionToltip)
          // elimino los mensajes del usuario
        delete mesagges[studentId]
          // se elimina el estudiante
        delete students[studentId]
          // se actualiza el estado
        this.sortStudents(students, "leave");
        this.setState({ allMessages: mesagges })
        if (this.state.userRole == 'teacher' && this.state.selectedUser == studentId) {
          this.setState({ selectedUser: null })
        }

        if (this.state.userRole == 'teacher' && this.state.inCallStudent == studentId) {
          this.restartAll(true)
        }

      })

    }

    if (this.state.userRole == 'learner') {
      let currentDate = new Date();
      let minDate = new Date('05/01/2019 00:00:00');
      let maxDate = new Date('05/02/2019 07:00:00');

      let loadingNew = loading.replace(/text-to-load/g, "Cargando");
      swal({
          title: '',
          html: loadingNew,
          showConfirmButton: false
        })
        // escucho el evento que no hay profesores
      this.socket.on('noTeacher', () => {
        // muestro quien se conectó
        // swal("No hay tutores disponibles!")
        // mostrar anuncio o mensaje normal
        if(currentDate > minDate && currentDate < maxDate) {
          swal({
            title: '¡Anuncio importante!',
            text: 'Estimado alumn@, le informamos que el feriado miércoles 01 de mayo no habrá atención a través del video chat; sin embargo, lo invitamos a seguir trabajando con las diferentes secciones de su plataforma virtual. Restablecemos nuestras asesorías el jueves 02 de mayo a las 7 am. Gracias por su comprensión.',
            showConfirmButton: true
          })
        } else {
          swal({
            title: 'Buscando profesor',
            text: 'por favor espera mientras te asignamos un profesor.',
            showConfirmButton: false
          })
        }

        if(this.state.onTimeConnect){
          this.restartAll();
        }
      })

      this.socket.on('onBoardShareState', (boardState) => {
        // console.log("comparte", boardState);
        this.setState({ isBoardShared: boardState })
      })
      this.socket.on('boardContentReceive', (content) => {
        // console.log("recibi contenido", content);
        this.setState({ boardContent: content })
      })

      this.socket.on('teachersChange', () => {
        // console.log(this.state.myTeacher, "el teacher");
        if (this.state.myTeacher == null) {
          this.socket.emit('findTeacher', this.state.user)
        }
      })

      // escucho cuando el profesor rechaza la llamada
      this.socket.on('BusyCall', () => {
        createjs.Sound.stop();
        // muestro quien se conectó

        let user = JSON.parse(localStorage.user);

        let answerCapacity = {
          userId: user._id,
          userName: user.username,
          callRespose: false,
          entityName: user.entityName? user.entityName : undefined,
          entityId: user.entityId? user.entityId : undefined,
        }

        AnswerCapacityStore.create(answerCapacity, (err, resp)=>{
          if (err) {
            return console.log(err);
          }
          // console.log('resp', resp);

        })

        swal("Tutor Ocupado.", "El tutor se encuentra ocupado en estos momentos. Espera en línea para ser contactado.")
      })

      // escucho cuando el room está listo
      this.socket.on('roomReady', (data) => {
        // se guardan datos necesarios
        // console.log("room ready")
        // console.log("roomId", data.roomId)
        //
        let dataChat ={
          studentId: this.state.user._id
        }
        //
        StudentStore.getChats(dataChat, (err, chats) => {
          let mesagges = this.state.allMessages
            // asigno los ultimos chats
          mesagges[this.state.user._id] = chats
            // se cambia el estado
          this.setState({ roomId: data.roomId, myTeacher: data.teacher, allMessages: mesagges })
            // muestro el id del room al que me uní

          this.setState({onTimeConnect: true})


          //si es enviado por otro profesor y estaba en llamada se resume la llamada
          // if(this.state.callNewTeacher){

          var toRoom
          if(this.state.studentRoomReceived && !this.state.inCallStudent){
            toRoom = this.state.studentRoomReceived
          }else{
            toRoom = this.state.userRole == 'teacher' ? this.state.allStudents[this.state.inCallStudent?this.state.inCallStudent: this.state.selectedUser].roomId : this.state.roomId
          }

          console.log("this.state.dataPausedSend", this.state.dataPausedSend);

          if(this.state.dataPausedSend) {
            console.log("on dataPausedSend");
            this.socket.emit('pausedStudent', { dataPausedSend: this.state.dataPausedSend, roomId: toRoom})
          }else if(this.state.newCallData){
            this.socket.emit('TeacherOnCall', toRoom )
          }else{
            swal("Welcome", "Bienvenido")
          }

          // console.log('selectedUser', this.state.selectedUser);

          // let wordDate = formatDate((new Date)).toString()
          // envia la hora y fecha de conexión como un mensaje
          // this.sendMessage(wordDate, this.state.selectedUser, this.state.roomId )

        })

      })

      // escucho cuando el room está listo
      this.socket.on('teacherLeave', (socketId) => {
        // se guardan datos necesarios
        // console.log("se fue un profesor");
        this.onTeacherLeave(socketId)
      })

      // escucho cuando el room está listo
      this.socket.on('teacherAcceptCall', (data) => {
        // console.log('data', data);
        this.accepCallFuntion(data)
      })

    }

    // si me responden a la oferta
    this.socket.on('TeacherOnCall', (toRoom) => {
      var isCall = false
      if(this.state.inCallStudent){
        isCall = true
      }
      console.log("!!!!!!!! isCall", isCall);
      this.socket.emit('teacherOnCallAnswer', isCall, toRoom )
    })

    // si me responden a la oferta
    this.socket.on('teacherOnCallAnswer', (isCall) => {

      console.log("!!!!!!!!!!!teacherOnCallAnswer", isCall);

      var toRoom
      if(this.state.studentRoomReceived && !this.state.inCallStudent){
        toRoom = this.state.studentRoomReceived
      }else{
        toRoom = this.state.userRole == 'teacher' ? this.state.allStudents[this.state.inCallStudent?this.state.inCallStudent: this.state.selectedUser].roomId : this.state.roomId
      }

      if(isCall){
        this.socket.emit('callTeacher', this.state.user, toRoom);
      }else{
        //si no esta en llamada, arma la llamada
        // pausa el audio
        if(!this.state.newCallData.remoteVideo) {
          this.socket.emit('removeVideo', { changeType: 1, roomId: toRoom })
        }
        // pausa el video
        if(!this.state.newCallData.remoteAudio) {
          this.socket.emit('removeAudio', { changeType: 1, roomId: toRoom })
        }

        this.setState({
          imStudentPaused: false,
          callStartTime: new Date().getTime()
        })

        // se crea una descripccion de mis datos para conexion peer
        this.peerConection.createPeerConnectionOffer(this.state.myStream)
        // me subscribo al evento para cuando llegue un candidato
        this.peerConection.onIceCandidate = this.onIceCandidate.bind(this)
        // me subscribo al evento para cuando el peer remoto agrege streaming
        this.peerConection.onRemoteStreamAdded = this.onRemoteStreamAdded.bind(this)
        // me subscribo al evento para cuando esté lista mi descripción se la envíe al que está en linea
        this.peerConection.onSendOffer = this.onSendOffer.bind(this)

        this.setState({newCallData: null})

      }

    })



    // si me responden a la oferta
    this.socket.on('pausedStudent', (data) => {
      console.log(" pausedStudent data ->", data);

      // agrega el usuario a la lista de estudiantes en pausa
      let temp  = this.state.pauseCallStudents
      let student = this.state.allStudents[data.dataPausedSend._id]
      student.remoteAudio = data.dataPausedSend.remoteAudio
      student.remoteVideo = data.dataPausedSend.remoteVideo

      console.log('student', student);

      temp.push(student)
      this.setState({pauseCallStudents: temp})
    })

    // si me responden a la oferta
    this.socket.on('answer', (msg) => {

      console.log("recibe la respuesta del profesor con la descripcion de la session rtc msg -> ", msg);

      let peerSpaceName = msg.callTo == 'peer' ? 'peerConection' : (msg.callTo == 'teacher' ? 'teacherConection' : 'studentConection')
        // agrego la descripcion para empezar la llamada
      console.log("peerSpaceName", peerSpaceName);
      this[peerSpaceName].createCallerRemoteDescription(msg.sessionDescription)
    })

    // si me responden a la oferta
    this.socket.on('answerScreen', (msg) => {
      // console.log("me llega la respuesta")
        // agrego la descripcion para empezar la llamada
      this.peerConectionScreen.createCallerRemoteDescription(msg.sessionDescription)
    })

    // escucho para iniciar compartir pantalla
    this.socket.on('studenShareScreen', () => {
      // muestro quien se conectó
      this.initShareScreen()
    })

    // escucho para iniciar compartir pantalla
    this.socket.on('renegotiateShareScreen', () => {
      // muestro quien se conectó
      this.inRenegotiateScreen()
    })

    // escucho cuando alguien se va
    this.socket.on('userDisconnected', (socketId) => {
      // elimino a la persona que se desconectó
      this.loadOffLineUsersChat()
      // console.log("alguien se va", socketId)
    })

    // escucho cuando alguien se va
    this.socket.on('removeVideo', (data) => {
      console.log('removeVideo 1 == pause ->', data.changeType);
      this.setState({ remoteVideo: data.changeType == 1 ? false : true })
      this.refs.mainComponent.playVideo(data.changeType)
    })

    // escucho cuando alguien se va
    this.socket.on('removeAudio', (data) => {
      console.log('removeAudio 1 == pause ->', data.changeType);
      this.setState({ remoteAudio: data.changeType == 1 ? false : true })
      this.refs.mainComponent.playAudio(data.changeType)
    })

    // escucho cuando un estudiante o profesor llama
    this.socket.on('studentCall', (data) => {

      // se verifica que no este recibiendo una llamada previa (profesor)
      if(this.state.swalCalling){
        let temp = this.state.waitingAnswerStudents
        temp.push(data)
        this.setState({ waitingAnswerStudents : temp})
        return;
      }else{
        console.log('true swall');
        this.setState({swalCalling: true})
      }

      if (this.state.inCallStudent) {
        playSound('message');
      } else {
        playSound('call');
      }

      this.makeIncomingCall(data)
    })

    // escucho cuando el profesor rechaza la llamada
    this.socket.on('CancelledCall', () => {
      createjs.Sound.stop();
      // muestro quien se conectó

      if(this.state.userRole == 'teacher'){
        swal("No se pudo concretar la llamada. Intenta de nuevo.")
        this.setState({inCallStudent : null, swalCalling: false})
      }else{

        // si es estudiante se guarda registro en el chat de la llamada perdida
        let data = {
          userIdDev: this.state.user.userIdDev,
          notifyType: 1, // 1 para llamadas, 2 para mensajes
          notifyNumber: 1, // numero de notificaciones
        }



        StudentStore.addNotify(data, (err, resp)=>{
          if(err){
            console.log('err', err);
          }

          // console.log('resp', resp);
          this.sendMessage('No se pudo concretar la llamada.', this.state.selectedUser )
        })

        swal("No se pudo concretar la llamada. Intenta de nuevo.")
        // se guardan datos necesarios
        let user = JSON.parse(localStorage.user);
        let answerCapacity = {
          userId: user._id,
          userName: user.username,
          callRespose: false,
          entityName: user.entityName? user.entityName : undefined,
          entityId: user.entityId? user.entityId : undefined,
        }
        AnswerCapacityStore.create(answerCapacity, (err, resp)=>{
          if (err) {
            return console.log(err);
          }
          // console.log('resp', resp);
        })
      }

    })

    // escucho cuando un estudiante cancela una llamada
    this.socket.on('teacherCancelCall', (data) => {
      createjs.Sound.stop();
        swal({
          title: data.name + ' ' + data.lastname,
          text: "canceló la llamada!",
          type: "info"
        }
      )
      this.setState({swalCalling: false})

    })
  }

  makeIncomingCall(data){
    let incomingNew = incoming.replace(/data-student-id-replace/g, data._id);
    incomingNew = incomingNew.replace(/student-name/g, data.name + ' ' + data.lastname);
    swal({
      title: '',
      html: incomingNew,
      showConfirmButton: false
    })
    if( !document.hasFocus() ){
      let mensagge =  data.name + ' ' + data.lastname + ' esta llamando'
      this.notifyMessage(mensagge, 'Te estan llamando')
    }
  }

  //el profesor acepto la llamada pero se inicia desde el estudiante
  accepCallFuntion(data){
    // se guardan datos necesarios
    console.log('data -> accepCallFuntion = ', data);

    let user = JSON.parse(localStorage.user);

    let answerCapacity = {
      userId: user._id,
      userName: user.username,
      callRespose: true,
      entityName: user.entityName? user.entityName : undefined,
      entityId: user.entityId? user.entityId : undefined,
    }

    AnswerCapacityStore.create(answerCapacity, (err, resp)=>{
      if (err) {
        return console.log(err);
      }
      // console.log('resp', resp);
    })

    this.setState({ callStartTime: new Date().getTime() })
      // muestro el id del room al que me uní
    let loadingNew = loading.replace(/text-to-load/g, "Conectando");
    swal({
      title: '',
      html: loadingNew,
      showConfirmButton: false
    })

    console.log('this.state.myStream accepCallFuntion -> ' , this.state.myStream);

    // se crea una descripccion de mis datos para conexion peer
    this.peerConection.createPeerConnectionOffer(this.state.myStream)
    // me subscribo al evento para cuando esté lista mi descripción se la envíe al que está en linea
    this.peerConection.onSendOffer = this. onSendOffer.bind(this)
    // me subscribo al evento para cuando llegue un candidato
    this.peerConection.onIceCandidate = this.onIceCandidate.bind(this)
      // me subscribo al evento para cuando el peer remoto agrege streaming
    this.peerConection.onRemoteStreamAdded = this.onRemoteStreamAdded.bind(this)
  }

  notifyMessage(menssage, tittle) {
    if (!Notification) {
      console.log('Desktop notifications not available in your browser.');
      return;
    }

    if (Notification.permission !== "granted")

      Notification.requestPermission();
    else {
      let notifyTittle = tittle ? tittle : 'Nuevo mensage'

      let options = {
        icon: '/images/logo.png',
        body: menssage,

        // body: "Tienes un mensaje nuevo de ...",
      }

      if(this.state.userRole == 'teacher'){
        // no se cierra hasta hacer click
        options.requireInteraction = true
      }

      var notification = new Notification( notifyTittle, options );

      notification.onclick = function () {
        window.focus();
        this.close();
        // window.open("http://stackoverflow.com/a/13328397/1269037");
      };

      setTimeout(notification.close.bind(notification), 20000);

    }

  }


  // cuando esté listo
  componentDidMount() {

    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isChrome = !!window.chrome && !!window.chrome.webstore;

    if(isFirefox)
      this.setState({ isFirefox })

    if(isChrome)
      this.setState({ isChrome })

    // if (this.state.userRole != "learner") {
      // document.addEventListener('DOMContentLoaded', function () {
    if (Notification.permission !== "granted")
      Notification.requestPermission();
      // });
      //
    // document.addEventListener('focus', () => {
    //   if(Notification)
    //     Notification.close();
    // });
    // }

    // setTimeout(function() { console.log('document.hasFocus()', document.hasFocus()); }.bind(this), 3000);

    if (this.state.userRole != "admin") {
      // se accede a la camara y al microfono
      // console.log('se accede');
      this.tryCatchCam()
    }
  }

  tryCatchCam(index){
    if(!index) index = 0
    navigator.mediaDevices.getUserMedia({
      audio:true,
      video:Constants.CONSTRAINTS[index]
    })
    .then(this.onUserMediaSuccess.bind(this))
    .catch((e)=> {
      console.log('tryCatchCam -> getUserMedia() error: ' + e);
      index++
      if(index < Constants.CONSTRAINTS.length){
        // si la camara no permite la resolucion por defecto, se captura nuevamente con otra resolucion
        this.tryCatchCam(index)
      }else{
        swal({
          title: 'Error!',
          text: 'No se puede acceder a la camara, tal vez otra aplicación la esta usando.'
        })
      }
    });
  }

  stopCamShare(){
    if(this.state.isStream){

      let stream = this.state.myStream

      // stream.getTracks().forEach(function(track) {
      //   track.stop();
      // });

      console.log('stream', stream);
      stream.getAudioTracks()[0].stop();
      stream.getVideoTracks()[0].stop();

      this.setState({isStream: false})
    }else{
      this.tryCatchCam()
      this.setState({isStream: true})
    }
  }

  // checkExt(){
  //   this.state.DetectRTC.screen.getChromeExtensionStatus((status) => {
  //       if(status == 'installed-enabled') {
  //           console.log('Great, is install...');
  //
  //           this.shareScreen()
  //       }else{
  //         console.log('please install extension');
  //
  //           swal({
  //             title: "extensión requerida",
  //             text: 'Por favor instale la extension de chrome para poder compartir pantalla',
  //             // showCancelButton: false,
  //             confirmButtonColor: "#DD6B55",
  //             confirmButtonText: "Instalar",
  //           }).then(() => {
  //             this.installExt()
  //           })
  //       }
  //   });
  // }

  installExt(){
    // console.log('installExt');

    window.open("https://chrome.google.com/webstore/detail/ajhifddimkapgcifgcodmmfdlknahffk");

    swal({
      title: "Recargar después de instalar.",
      text: 'Si ya instaló la extensión, debe recargar la aplicación para habilitarla.',
      // showCancelButton: false,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Recargar!",
    }).then(() => {
      window.location.reload()
    })
  }

  shareScreen(){
    getScreenId((error, sourceId, screen_constraints) => {

      console.log('screen_constraints', JSON.stringify(screen_constraints, null, '\t'));
      navigator.mediaDevices.getUserMedia( screen_constraints )
        .then((stream)=>{
          console.log('screen_constraints, stream', stream);
          this.captureUsingGetUserMedia(stream)
          // this.onUserMediaSuccessScreen(stream)
        })
        // .then(this.captureUsingGetUserMedia.bind(this))
        .catch((e) => {
          console.log('shareScreen -> getUserMedia() error: ' + e);

          var isFirefox = this.state.isFirefox;
          var isChrome = this.state.isChrome;

          var Firefox_Screen_Capturing_Warning = 'Make sure that you are using Firefox Nightly and you enabled: media.getusermedia.screensharing.enabled flag from about:config page. You also need to add your domain in "media.getusermedia.screensharing.allowed_domains" flag.';

          // if (isChrome && window.location.protocol === 'http:') {
          //     alert('You\'re not testing it on SSL origin (HTTPS domain) otherwise you didn\'t enable --allow-http-screen-capture command-line flag on canary.');
          // } else
          if (isChrome) {

                      swal({
                        title: "extensión requerida",
                        text: 'Por favor instale la extension de chrome para poder compartir pantalla',
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Instalar",
                      }).then(() => {
                        this.installExt()
                      })

              console.log('Screen capturing is either denied or not supported. Please install chrome extension for screen capturing or run chrome with command-line flag: --enable-usermedia-screen-capturing');
          } else if (isFirefox) {
              console.log(Firefox_Screen_Capturing_Warning);
              swal({
                title: "Error!",
                text: 'Debes dar permiso a firefox para compartir pantalla y seleccionar la ventana a compartir, si no recibes el aviso para dar permiso instala la extensión.',
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Instalar extensión",
                cancelButtonText: "Reintentar",
              }).then(() => {
                InstallTrigger.install({
                    'Foo': {
                        // URL: 'https://addons.mozilla.org/en-US/firefox/addon/enable-screen-capturing/',
                        URL: 'https://addons.mozilla.org/firefox/downloads/file/355418/enable_screen_capturing_in_firefox-1.0.006-fx.xpi?src=cb-dl-hotness',
                        toString: function() {
                            return this.URL;
                        }
                    }
                });
               })
          }
        });


    })
  }

  initDetectRTC(){
    var isChrome = !!navigator.webkitGetUserMedia;

    var DetectRTC = {};
    var screenCallback;

    DetectRTC.screen = {
        chromeMediaSource: 'screen',
        getSourceId: function(callback) {
            if(!callback) throw '"callback" parameter is mandatory.';
            screenCallback = callback;
            window.postMessage('get-sourceId', '*');
        },
        isChromeExtensionAvailable: function(callback) {
            if(!callback) return;

            if(DetectRTC.screen.chromeMediaSource == 'desktop') return callback(true);

            // ask extension if it is available
            window.postMessage('are-you-there', '*');

            setTimeout(function() {
                if(DetectRTC.screen.chromeMediaSource == 'screen') {
                    callback(false);
                }
                else callback(true);
            }, 2000);
        },
        onMessageCallback: function(data) {
            if (!(typeof data == 'string' || !!data.sourceId)) return;

            // "cancel" button is clicked
            if(data == 'PermissionDeniedError') {
                DetectRTC.screen.chromeMediaSource = 'PermissionDeniedError';
                if(screenCallback) return screenCallback('PermissionDeniedError');
                else throw new Error('PermissionDeniedError');
            }

            // extension notified his presence
            if(data == 'rtcmulticonnection-extension-loaded') {
                if(document.getElementById('install-button')) {
                    document.getElementById('install-button').parentNode.innerHTML = '<strong>Great!</strong> <a href="https://chrome.google.com/webstore/detail/screen-capturing/ajhifddimkapgcifgcodmmfdlknahffk" target="_blank">Google chrome extension</a> is installed.';
                }
                DetectRTC.screen.chromeMediaSource = 'desktop';
            }

            // extension shared temp sourceId
            if(data.sourceId) {
                DetectRTC.screen.sourceId = data.sourceId;
                if(screenCallback) screenCallback( DetectRTC.screen.sourceId );
            }
        },
        getChromeExtensionStatus: function (callback) {
            if (navigator.mozGetUserMedia) return callback('not-chrome');

            var extensionid = 'ajhifddimkapgcifgcodmmfdlknahffk';

            var image = document.createElement('img');
            image.src = 'chrome-extension://' + extensionid + '/icon.png';
            image.onload = function () {
                DetectRTC.screen.chromeMediaSource = 'screen';
                window.postMessage('are-you-there', '*');
                setTimeout(function () {
                    if (!DetectRTC.screen.notInstalled) {
                        callback('installed-enabled');
                    }
                }, 2000);
            };
            image.onerror = function () {
                DetectRTC.screen.notInstalled = true;
                callback('not-installed');
            };
        }
    };

    // check if desktop-capture extension installed.
    if(window.postMessage && isChrome) {
        DetectRTC.screen.isChromeExtensionAvailable();
    }

    this.setState({DetectRTC}, ()=>{
      this.shareScreen()
      // this.checkExt()
    })

  }

  // cuando me llega una oferta
  onOffer(sessionDescription, callTo) {

    if (callTo == 'peer') {

      // crea una conexion peer como llamado
      this.peerConection.createPeerConnectionAnswer(this.state.myStream, sessionDescription)

      // me subscribo al evento para cuando el peer remoto agrege streaming
      this.peerConection.onRemoteStreamAdded = this.onRemoteStreamAdded.bind(this)

      // me subscribo al evento para cuando llegue un candidato
      this.peerConection.onIceCandidate = this.onIceCandidate.bind(this)

      // me subscribo al evento para cuando el peer remoto agrege streaming
      this.peerConection.onSendAnswer = this.onSendAnswer.bind(this);

    } else {
      // crea una conexion peer como llamado
      this.adminConection.createPeerConnectionAnswer(this.state.myStream, sessionDescription)
        // me subscribo al evento para cuando llegue un candidato
      this.adminConection.onIceCandidate = this.onIceAdminCandidate.bind(this)
        // me subscribo al evento para cuando el peer remoto agrege streaming
      this.adminConection.onSendAnswer = this.onSendAdminAnswer.bind(this);
    }

  }

  // cuando me llega una oferta
  onOfferScreen(sessionDescription) {
    // console.log("me llega una oferta", sessionDescription)

    if(this.peerConectionScreen.getPc()){
      this.peerConectionScreen.renegotiateCreatePeerConnectionAnswer(this.state.myStreamScreen, sessionDescription )
    }else{
      // me subscribo al evento para cuando el peer remoto agrege streaming
      this.peerConectionScreen.onRemoteStreamAdded = this.onRemoteStreamAddedScreen.bind(this)
      // crea una conexion peer como llamado
      this.peerConectionScreen.createPeerConnectionAnswer(this.state.myStreamScreen, sessionDescription)
      // me subscribo al evento para cuando llegue un candidato
      this.peerConectionScreen.onIceCandidate = this.onIceCandidateScreen.bind(this)
      // me subscribo al evento para cuando el peer remoto agrege streaming
      this.peerConectionScreen.onSendAnswer = this.onSendAnswerScreen.bind(this);
    }


  }

  // evento que envia mi respuesta al que me llama
  onSendAnswer(sessionDescription) {
    // console.log("emito el evento de enviar respuesta")

    var toRoom
    if(this.state.studentRoomReceived && !this.state.inCallStudent){
      toRoom = this.state.studentRoomReceived
    }else{
      toRoom = this.state.userRole == 'teacher' ? this.state.allStudents[this.state.inCallStudent?this.state.inCallStudent: this.state.selectedUser].roomId : this.state.roomId
    }

    this.socket.emit('answer', {
      sessionDescription: sessionDescription,
      callTo: 'peer',
      roomId: toRoom,
      studentId: this.state.user._id
      // roomId: this.state.userRole == 'teacher' ? this.state.allStudents[this.state.inCallStudent? this.state.inCallStudent : this.state.selectedUser].roomId : this.state.roomId
    })
  }

  // evento que envia mi respuesta al que me llama
  onSendAnswerScreen(sessionDescription) {
    // console.log("emito el evento de enviar respuesta")
    this.socket.emit('answerScreen', {
      sessionDescription: sessionDescription,
      roomId: this.state.allStudents[this.state.inCallStudent].roomId
    })
  }

  // evento que envia mi respuesta al que me llama
  onSendAdminAnswer(sessionDescription) {
    // console.log("emito el evento de enviar respuesta al administrador")
    this.socket.emit('answer', {
      sessionDescription: sessionDescription,
      callTo: this.state.userRole
    })
  }

  captureUsingGetUserMedia(stream){
    console.log('stream', stream);
    navigator.mediaDevices.getUserMedia({
      "audio": true,
      "video": false
      // "video": {width: {exact: 1280}, height: {exact: 720}}
    })
      .then((audioStream)=>{
        this.onUserMediaSuccessScreen(stream, audioStream)
      })

      .catch(function(e) {

        swal({
          title: 'Error!',
          text: 'No se puede acceder a la camara, tal vez otra aplicación la esta usando.'
        })

        console.log('captureUsingGetUserMedia -> getUserMedia() error: ' + e);
      });
  }

  onUserMediaSuccessScreen(videoStream, audioStream) {

    console.log('videoStream', videoStream);

    // console.log('audioStream', audioStream, 'videoStream', videoStream);

    var audioTrack = audioStream.getAudioTracks()[0];
    videoStream.addTrack( audioTrack );

    this.setState({ buttonShare: false,myStreamScreen: videoStream, vid2: videoStream })

    console.log("this.remoteStreamScreen", !!this.remoteStreamScreen);

    if(this.remoteStreamScreen){
      if (this.state.userRole == 'learner') {
        this.inRenegotiateScreen()
      }else{
        let roomId = this.state.allStudents[this.state.inCallStudent].roomId
        this.socket.emit('renegotiateShareScreen', roomId)
      }

      // this.peerConectionScreen.addLocalStream(stream)
    }else{
      if (this.state.userRole == 'learner') {
        this.initShareScreen()
      }else{
        let roomId = this.state.allStudents[this.state.inCallStudent].roomId
        this.socket.emit('studenShareScreen', roomId)
      }
    }

  }

  inRenegotiateScreen(){
    this.peerConectionScreen.renegotiateCreatePeerConnectionOffer(this.state.myStreamScreen )
  }

  initShareScreen(){
    // se crea una descripccion de mis datos para conexion peer
    this.peerConectionScreen.createPeerConnectionOffer(this.state.myStreamScreen)
      // me subscribo al evento para cuando llegue un candidato
    this.peerConectionScreen.onIceCandidate = this.onIceCandidateScreen.bind(this)
      // me subscribo al evento para cuando el peer remoto agrege streaming
    this.peerConectionScreen.onRemoteStreamAdded = this.onRemoteStreamAddedScreen.bind(this)
      // me subscribo al evento para cuando esté lista mi descripción se la envíe al que está en linea
    this.peerConectionScreen.onSendOffer = this.onSendOfferScreen.bind(this)
  }

  onUserMediaSuccess(stream) {
    // console.log("llegó esto", stream)
    let videoTrack = stream.getVideoTracks();
    let audioTrack = stream.getAudioTracks();
    this.setState({ myStream: stream, vid2: stream, audiotracks: audioTrack, videotracks: videoTrack })
  }

  // se añaden o quitan tracks
  onChangeTracks(trackType, changeType) {
    console.log('onChangeTracks -> ', 'trackType: ', trackType, 'changeType: ', changeType );
    // se obtiene el room

    var toRoom
    if(this.state.studentRoomReceived && !this.state.inCallStudent){
      toRoom = this.state.studentRoomReceived
    }else{
      toRoom = this.state.userRole == 'teacher' ? this.state.allStudents[this.state.inCallStudent?this.state.inCallStudent: this.state.selectedUser].roomId : this.state.roomId
    }

      // se verifica el tipo de track que se quiere añadir o quitar
    if (trackType == 2 && this.state.videotracks.length > 0) {
      // se emite el evento
      this.socket.emit('removeVideo', { changeType: changeType, roomId: toRoom })
      this.setState({ buttonVideo: changeType == 1 ? false : true })
    } else if (trackType == 1 && this.state.audiotracks.length > 0) {
      // se emite el evento
      this.socket.emit('removeAudio', { changeType: changeType, roomId: toRoom })
      this.setState({ buttonAudio: changeType == 1 ? false : true })
    }
  }

  onCallPartner(onlyVoice) {
    // si es solo con audio
    if (onlyVoice) {
      console.log('onCallPartner onChangeTracks 2, 1');
      this.onChangeTracks(2, 1)
    }

    if (!!this.state.myStream) {
      let toRoom = this.state.userRole == 'teacher' ? this.state.allStudents[this.state.selectedUser].roomId : this.state.roomId

      if(this.state.userRole == 'teacher'){
        let selectedUser = this.state.selectedUser
        this.setState({inCallStudent: selectedUser})
        if(!this.state.isStream){
          // reactiva la camara para recibir la llamada
          this.stopCamShare()
        }
      }

      // tambien emite el mismo evento cuando el profesor llama al estudiante
      this.socket.emit('callTeacher', this.state.user, toRoom);

      let loadingNew = loading.replace(/text-to-load/g, "Llamando");
      swal({
        title: "",
        html: loadingNew,
        showCancelButton: false,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Cancelar llamada",
      }).then(() => {
        this.setState({inCallStudent: null, isCalling: false})
        let toRoom = this.state.userRole == 'teacher' ? this.state.allStudents[this.state.inCallStudent?this.state.inCallStudent: this.state.selectedUser].roomId : this.state.roomId
        this.socket.emit('userCancelCall', this.state.user, toRoom );
      })
    } else {
      swal("Debes activar tu camara")
    }
    // Si es un administrador llama a el profesor que el haya elegido por tanto llega socketId como parametro
  }

  onCallTeacher(teacher) {
    this.socket.emit('adminCall', { socketId: teacher.socket.id, callTo: 'teacher' });
  }

  // evento para envia una oferta
  onSendOffer(sessionDescription) {
    console.log('envio oferta', sessionDescription);
    this.socket.emit('offer', {
      sessionDescription: sessionDescription,
      callTo: 'peer',
      roomId: this.state.roomId,
      studentId: this.state.user._id
    })
  }

  // evento para envia una oferta
  onSendOfferScreen(sessionDescription) {
    // console.log('envio oferta', sessionDescription);
    this.socket.emit('offerScreen', {
      sessionDescription: sessionDescription,
      callTo: 'peer'
    })
  }

  // evento que subscribo a la clase webrtc para escuchar cuando tenga un candidato de conexion
  onIceCandidate(event) {
    // si en el evento viene un candidato
    if (event.candidate) {
      // console.log("event", event);

      console.log("this.state.studentRoomReceived", this.state.studentRoomReceived);

      var toRoom
      if(this.state.studentRoomReceived && !this.state.inCallStudent){
        toRoom = this.state.studentRoomReceived
      }else{
        toRoom = this.state.userRole == 'teacher' ? this.state.allStudents[this.state.inCallStudent?this.state.inCallStudent: this.state.selectedUser].roomId : this.state.roomId
      }

        // console.log("toRoom", toRoom)
        // me creo como candidato
      let Newcandidate = { candidate: event.candidate, callTo: 'peer', roomId: toRoom }
        // console.log("mando un candidato", Newcandidate)
        // envio el evento al servidor de canditato a la persona conectada

      //evita que se envie el mismo candidato dos veces
      if(    this.currentCandidate != Newcandidate ){
        this.socket.emit('candidate', Newcandidate)
        this.currentCandidate = Newcandidate
      }
    } else {
      // console.log("End of candidates.");
    }
  }

  // evento que subscribo a la clase webrtc para escuchar cuando tenga un candidato de conexion
  onIceCandidateScreen(event) {
    // si en el evento viene un candidato
    if (event.candidate) {
      let toRoom = this.state.userRole == 'teacher' ? this.state.allStudents[this.state.inCallStudent].roomId : this.state.roomId
        // console.log("toRoom", toRoom)
        // me creo como candidato
      let Newcandidate = { candidate: event.candidate, roomId: toRoom }
        // console.log("mando un candidato", Newcandidate)
        // envio el evento al servidor de canditato a la persona conectada
      this.socket.emit('candidateScreen', Newcandidate)

    } else {
      // console.log("End of candidates.");
    }
  }

  // evento que subscribo para cuand haya transmision desde el peer remoto
  onRemoteStreamAdded(event) {
    // console.log("entra a onRemoteStreamAdded (onaddstream)", event)
    // console.log("event.track.kind", event.track.kind);

    switch(event.track.kind) {
      case "video": {
        this.setState({ vid1: event.streams[0] })
        break;
      }
      case "audio": {
        this.setState({ aud1: event.streams[0] })
        break;
      }

      }

        this.setState({ onStreaming: 1 })
    this.remoteStream = event.streams[0]
    this.waitForRemoteVideo()
  }

  // evento que subscribo para cuand haya transmision desde el peer remoto
  onRemoteStreamAddedScreen(event) {
    // console.log("entra a onRemoteStreamAdded", event)

    if(event.track.kind == "video"){
      let removeVideoTemp = this.state.remoteVideo

      this.setState({ onStreaming: 1, vid1: event.streams[0], remoteVideo: true, remoteVideoTemp: removeVideoTemp })
      this.remoteStreamScreen = event.streams[0]
      this.waitForRemoteVideoScreen()
    }
  }

  onSendTeacherOffer(sessionDescription) {
    console.log('envio oferta', sessionDescription);
    this.socket.emit('offer', {
      sessionDescription: sessionDescription,
      callTo: 'teacher'
    })
  }

  // evento que subscribo a la clase webrtc para escuchar cuando tenga un candidato de conexion
  onIceTeacherCandidate(event) {
    console.log("onIceTeacherCandidate", event);
    // si en el evento viene un candidato
    if (event.candidate) {
      // me creo como candidato
      let Newcandidate = { candidate: event.candidate, callTo: 'admin' }
        // console.log("mando un candidato", Newcandidate)
        // envio el evento al servidor de canditato a la persona conectada

      //evita que se envie el mismo candidato dos veces
      if(    this.currentCandidate != Newcandidate ){
        this.socket.emit('candidate', Newcandidate)
        this.currentCandidate = Newcandidate
      }

    } else {
      // console.log("End of candidates.");
    }
  }

  // evento que subscribo para cuand haya transmision desde el peer remoto
  onRemoteTeacherStreamAdded(event) {
    // console.log("entra a onRemoteStreamAdded", event)
    this.setState({ onStreaming: 1, vid1: event.streams[0] })
    this.remoteStream = event.streams[0]
    this.waitForRemoteVideo('teacher')
  }

  onSendStudentOffer(sessionDescription) {
    console.log('envio oferta', sessionDescription);
    this.socket.emit('offer', {
      sessionDescription: sessionDescription,
      callTo: 'learner'
    })
  }

  // evento que subscribo a la clase webrtc para escuchar cuando tenga un candidato de conexion
  onIceStudentCandidate(event) {
    console.log("onIceStudentCandidate", event);
    // si en el evento viene un candidato
    if (event.candidate) {
      // me creo como candidato
      let Newcandidate = { candidate: event.candidate, callTo: 'admin' }
        // console.log("mando un candidato", Newcandidate)
        // envio el evento al servidor de canditato a la persona conectada

      //evita que se envie el mismo candidato dos veces
      if(    this.currentCandidate != Newcandidate ){
        this.socket.emit('candidate', Newcandidate)
        this.currentCandidate = Newcandidate
      }

    } else {
      // console.log("End of candidates.");
    }
  }

  // evento que subscribo para cuand haya transmision desde el peer remoto
  onRemoteStudentStreamAdded(event) {
    // console.log("entra a onRemoteStreamAdded", event)
    this.setState({ onStreaming: 1, vid2: event.streams[0] })
    this.remoteStream = event.stream[0]
    this.waitForRemoteVideo('learner')
  }

  // evento que subscribo a la clase webrtc para escuchar cuando tenga un candidato de conexion
  onIceAdminCandidate(event) {
    console.log("onIceAdminCandidate", event);
    // si en el evento viene un candidato
    if (event.candidate) {
      // me creo como candidato
      let Newcandidate = { candidate: event.candidate, callTo: this.state.userRole }
        // console.log("mando un candidato", Newcandidate)
        // envio el evento al servidor de canditato a la persona conectada

      //evita que se envie el mismo candidato dos veces
      if(    this.currentCandidate != Newcandidate ){
        this.socket.emit('candidate', Newcandidate)
        this.currentCandidate = Newcandidate
      }

    } else {
      console.log("End of candidates.");
    }
  }

  waitForRemoteVideo() {
    let videoTracks = this.remoteStream.getVideoTracks()
    let remoteVideo = document.getElementById('vid1')
    if (videoTracks.length === 0 || (remoteVideo && remoteVideo.currentTime > 0)) {

      console.log('remoteVideo remoteVideoTemp', !!this.state.myStreamScreen);
      // if(this.state.remoteVideo && !){
        // swal("!Conectado!")

      if(!this.state.swalCalling)
        swal.close()
      // }

    } else {
      setTimeout(() => { this.waitForRemoteVideo() }, 100)
    }
  }

  waitForRemoteVideoScreen() {
    let videoTracks = this.remoteStreamScreen.getVideoTracks()
    let remoteVideo = document.getElementById('vid1')
    if (videoTracks.length === 0 || remoteVideo.currentTime > 0) {
      // swal("Conectado!")
      console.log('waitForRemoteVideoScreen -> Compartiendo!');
    } else {
      if(!this.state.myStreamScreen){
        setTimeout(() => { this.waitForRemoteVideoScreen() }, 100)
      }
    }
  }

  sendMessage(word, to, roomId, isUrl) {
    let chat = {
      studentId: to,
      senderId: this.state.user._id,
      message: word,
      messageType: 1,
    }

    if (isUrl) {
      chat.isUrl = isUrl
    }

    // si es un estudiante
    if (this.state.userRole == 'learner') {
      chat.messageType = 0
      roomId = this.state.roomId
    }

    this.socket.emit('message', { roomId: roomId, chat: chat })
      // capturo los mensajes actuales
    let mesagges = this.state.allMessages
    console.log("mesagges", mesagges)
      // agrego el mensaje

    console.log("to", to);
    console.log("mesagges", mesagges);

    mesagges[to].push(chat)
      // guardo el estado
    this.setState({ allMessages: mesagges })
  }

  onReceiveMessage(event) {
    // capturo los mensajes actuales
    let mesagges = this.state.allMessages
      // se agrego la nueva palabra
    mesagges.push(JSON.parse(event.data))
      // guardo el estado
    this.setState({ allMessages: mesagges })
  }

  loadTeachers() {
    // se piden todos los usuarios nuevamente
    TeachersStore.getOnline((err, response) => {
      console.log('err', err)
        // console.log('response', response)
      if (err) return
        // se cambia el estado allTeachers con los nuevos usuarios
      this.setState({
        allTeachers: response,
      })
    })
  }

  showToltip(student, action) {
    this.setState({
      studentToltip: student,
      toltipAction: action,
      showToltip: "show-user-toltip"
    })
    setTimeout(this.hideToltip, 3000);
  }

  hideToltip() {
    this.setState({
      showToltip: ""
    })
  }

  doToltipAction(student, action) {
    if (action == "connect") {
      this.userChatStatus(student._id)
    }
    this.hideToltip()
  }


  changeTeacher(teacher, student){
    let data = {
      teacher,
      roomId : student.roomId,
      prevTeacher: this.state.user
    }

    const isStudentPaused = this.findStudentPaused(student._id)

    if( isStudentPaused ){
      data.studentPaused = isStudentPaused
    }

    if(this.state.inCallStudent == student._id || isStudentPaused){
      data.remoteAudio= this.state.remoteAudio
      data.remoteVideo= this.state.remoteVideo
    }

    // le digo al estudiante que cambie de profesor y le mando el profesor
    this.socket.emit('changeTeacher', data)
  }

  findStudentPaused(id){
    var tempStudents = this.state.pauseCallStudents
    var temp = false
    tempStudents.forEach((student, index) => {
      if(student._id.toString() === id.toString()){
        temp = student
        tempStudents.splice(index, 1);
      }
    })

    this.setState({
      pauseCallStudents: tempStudents
    })

    return temp
  }

  render() {
    let ChatInfo;
    // let chatLogo = this.state.userRole == "teacher" ? "teacher-logo" : "logoChat";
    if (this.state.userRole == "admin") {
      ChatInfo = <Chat userRole={this.state.userRole} allRooms={this.state.allRooms} allTeachers={this.state.allTeachers} allMessages={this.state.allMessages} onCallTeacher={this.onCallTeacher.bind(this)} user={this.state.user} />;
    }

    // let chromeExtLink = "https://chrome.google.com/webstore/detail/ajhifddimkapgcifgcodmmfdlknahffk".toString()
    // console.log('this.state.pauseCallStudents', this.state.pauseCallStudents);
    return (
      <div className="video-chat" >

        {/* boton apra instalar directo la extension de compartir pantalla en chrome */}
        {/* <button id="chrome-ext-button" onClick={()=>{
          chrome.webstore.install(chromeExtLink, (d)=>{
            console.log('susses Install', d);
          },(err)=>{
            console.log('err to install', err);
          }
        )
      }} > Instalar Extensión </button> */}

        <Header path={this.props.location.pathname}/>
        <Main ref="mainComponent"

          offLineUser={this.state.offLineUser}
          pauseCallStudents={this.state.pauseCallStudents}
          onResumeCall={this.onResumeCall.bind(this)}
          imStudentPaused={this.state.imStudentPaused}

          canLoadMore={this.state.canLoadMore}
          loadMoreMessage={this.loadMoreMessage.bind(this)}

          changeTeacher={this.changeTeacher.bind(this)}
          notifyBoardContentChanged={this.notifyBoardContentChanged.bind(this)}
          boardContent={this.state.boardContent}
          userRole={this.state.userRole}
          onChangeTracks={this.onChangeTracks.bind(this)}
          onStreaming={this.state.onStreaming}
          vid1={this.state.vid1}
          vid2={this.state.vid2}
          aud1={this.state.aud1}
          onCallPartner={this.onCallPartner.bind(this)}
          onStopShareScreen={this.onStopShareScreen.bind(this)}
          onShareScreen={this.onShareScreen.bind(this)}
          onEndCall={this.endCall.bind(this)}
          onUserMediaSuccess={this.onUserMediaSuccess.bind(this)}
          onBoardShare={this.onBoardShare.bind(this)}
          onPauseCall={this.onPauseCall.bind(this)}
          isBoardShared={this.state.isBoardShared}
          onLogout={this.logout.bind(this)}
          stopCamShare={this.stopCamShare.bind(this)}
          buttonAudio={this.state.buttonAudio}
          buttonVideo={this.state.buttonVideo}
          buttonShare={this.state.buttonShare}
          remoteVideo={this.state.remoteVideo}
          selectedUser={this.state.selectedUser}
          userChatStatus={this.userChatStatus.bind(this)}
          sendMessage={this.sendMessage.bind(this)}
          allMessages={this.state.allMessages}
          user={this.state.user}
          allStudents={this.state.allStudents}
          studentOrder={this.state.studentOrder}
          usersOffLine={this.state.usersOffLine}
          />
        {ChatInfo}
        <div className={"alerts-zone "+ this.state.showToltip}>
          <div className="alert-toltip" onClick={this.doToltipAction.bind(this, this.state.studentToltip, this.state.toltipAction.action)}>
            <div className="col-xs-12">
              <div className="user-list">
                <div className="img-user-toltip">
                  {(() => {
                      if(this.state.studentToltip.profileImg == '') {
                          return <img src='/images/profile-img.png' className="cosmo-image"/>
                      } else {
                            return <img src={this.state.studentToltip.profileImg} className="cosmo-image"/>

                      }
                  })()}
                </div>
                <div className="toltip-text">
                  <div className="col-xs-12">
                    <span className="user-name-toltip">{this.state.studentToltip.name + ' ' + this.state.studentToltip.lastname }</span>
                  </div>
                  <div className="col-xs-12">
                    <span className="user-action-toltip">{this.state.toltipAction.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


VideoChat.contextTypes = {
  router: React.PropTypes.object
}

export default VideoChat
