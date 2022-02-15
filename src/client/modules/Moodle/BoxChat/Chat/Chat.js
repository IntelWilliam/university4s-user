import React from 'react'
// import UserInfo from 'src/client/modules/Chat/Chat/UserInfo'
import ChatMessages from 'src/client/modules/Moodle/BoxChat/Chat/ChatMessages'
import MessageSender from 'src/client/modules/Moodle/BoxChat/Chat/MessageSender'
// import SessionList from 'src/client/modules/Chat/Admin/SessionList'
// import UsersInSession from 'src/client/modules/Chat/Teachers/UsersInSession'
// import CurrentChat from 'src/client/modules/Chat/Teachers/CurrentChat'
import BoxChatStore from 'src/client/modules/Moodle/BoxChat/BoxChatStore'

export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      allMessages: [],
      user: JSON.parse(localStorage.user),
      emojiPicker: new EmojiPicker({
        emojiable_selector: '[data-emojiable=true]',
        assetsPath: '/images/emoji/',
        popupButtonClasses: 'fa fa-smile-o'
      })
    }


    this.handleClick = this.handleClick.bind(this)
  }

  // solo permite letras sin espacios
  onlyLetters(event) {
    if (event.charCode == 13) {
      event.preventDefault()
      this.handleClick()
      return false
    }
  }

  handleUpload(fileName){
    const isUrl = true;
    this.handleClick(fileName, isUrl)
    // this.props.sendMessage.call(null, fileName, this.props.selectedUser, this.state.roomId, isUrl)
  }

  // se maneja el evento de agregar nueva palabra
  handleClick(fileName, isUrl) {
    let word = $('#input-message').val()

    if(fileName){
      word = fileName
    }

    // si la palabra es diferente de vacio
    if (word != '') {
      // se llama la funcion del padre para agregar una nueva palabra
      // envia el mensaje
      // this.props.sendMessage.call(null, word, this.props.selectedUser, this.state.roomId)

      if(this.state.allMessages.length > 0){
        this.updateMenssage(word, isUrl)
      }else{
        this.createMenssage(word, isUrl)
      }

      $('#input-message').val("")
      $('.emoji-wysiwyg-editor').empty();
      $('#input-message').focus()
    }
  }

  updateMenssage(word, isUrl){

    let tempMenssages = this.state.allMessages

    let newMenssage = {
      messageType: 0, // 0 enviado por el estudiante, 1 enviado por el profesor
      isUrl: isUrl?  isUrl : undefined,
      message: word,
    }

    tempMenssages.push(newMenssage)
    let param = {
      studentId: this.state.user._id,
      messages: tempMenssages,
      lastMesage: word,
      lastMesageFrom: 0
    }

    param.messages = JSON.stringify(param.messages)

    BoxChatStore.updateMessages(this.state.menssageId, param, (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        if(body.messages.length > 0 ){
          this.setState({
            allMessages: body.messages
          })
        }else{
          // console.log('hay mensajes');
        }
      }
    })
  }

  createMenssage(word, isUrl){
    let param = {
      studentId: this.state.user._id,
      userName: this.state.user.name,
      userLastname: this.state.user.lastname,
      messages: [
        {
          messageType: 0, // 0 enviado por el estudiante, 1 enviado por el profesor
          isUrl: isUrl?  isUrl : undefined,
          message: word
        }
      ],
      lastMesage: word,
      lastMesageFrom: 0
    }

    param.messages = JSON.stringify(param.messages)


    console.log('param', param);

    BoxChatStore.createMenssage(param, (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        if(body.messages.length > 0 ){
          this.setState({
            allMessages: body.messages,
            menssageId: body._id
          })
        }else{
          // console.log('hay mensajes');
        }
      }
    })
  }

  componentWillMount(){
    this.loadMessages()
  }

  loadMessages(){

    let param = {
      studentId: this.state.user._id
    }

    BoxChatStore.getMessages(param, (err, body) => {
      // si llega un error
      if (err) {
        console.log("error", err)
      } else {
        if(body.data.length > 0 ){
          this.setState({
            allMessages: body.data[0].messages,
            menssageId: body.data[0]._id
          })
        }else{
          // console.log('hay mensajes');
        }
      }
    })
  }

  render() {

    // let length = this.props.allMessages.length

    return (
      <div className="col-xs-12 chat-container">
        <ChatMessages allMessages={this.state.allMessages}
          emojiPicker={this.state.emojiPicker}
          user={this.state.user}
        />


        <MessageSender  onlyLetters={this.onlyLetters.bind(this)}
          emojiPicker={this.state.emojiPicker}
          handleUpload={this.handleUpload.bind(this)}
          handleClick={this.handleClick.bind(this)}
        />

      </div>
    )
  }
}
