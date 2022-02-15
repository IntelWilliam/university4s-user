import React from 'react'
// import UserInfo from 'src/client/modules/Chat/Chat/UserInfo'
import ChatMessages from 'src/client/modules/Chat/Chat/ChatMessages'
import MessageSender from 'src/client/modules/Chat/Chat/MessageSender'
import SessionList from 'src/client/modules/Chat/Admin/SessionList'
import UsersInSession from 'src/client/modules/Chat/Teachers/UsersInSession'
import UsersPausedCall from 'src/client/modules/Chat/Teachers/UsersPausedCall'
// import CurrentChat from 'src/client/modules/Chat/Teachers/CurrentChat'

export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      roomId: null,
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
    if (event.keyCode == 13) {
      // event.preventDefault()
      // event.stopPropagation()
      this.handleClick()
    }
  }

  // se maneja el evento de agregar nueva palabra
  handleClick() {
    // let word = $('.emoji-wysiwyg-editor').val()
    let word = $('#input-message').val()
    // si la palabra es diferente de vacio

    if (word != '') {
      // se llama la funcion del padre para agregar una nueva palabra
      this.props.sendMessage.call(null, word, this.props.selectedUser, this.state.roomId)
      $('#input-message').val("")
      $('.emoji-wysiwyg-editor').empty();
      $('#input-message').focus()
    }
  }

  handleUpload(fileName){
    const isUrl = true;
    this.props.sendMessage.call(null, fileName, this.props.selectedUser, this.state.roomId, isUrl)
  }

  /**
   * Funcion encargada de cambiar el estado del chat para decidir si se muestra el chat o la lista de estudiantes
   * el userId puede ser de utilidad para llamar a otra funcion en App.JS y saber hacia quien va dirigido el mensaje
   * todo depende de la estructura que se le de, como aun no se como sera solo asumo
   * @param status
   * @param userId
   */
  userChatStatus(userId, roomId) {
    // console.log('userChatStatus', roomId);
    this.props.userChatStatus.call(null, userId, roomId)

    if(roomId != 'offLine'){
      this.setState({ roomId: roomId })
    }
  }


  componentWillReceiveProps(nextProps) {
    if(this.props.selectedUser != nextProps.selectedUser){
      if(nextProps.allStudents[nextProps.selectedUser]){
        // se actualiza el roomId si llega un nuevo usuario seleccionado (por props)
        let student = nextProps.allStudents[nextProps.selectedUser]
        this.setState({ roomId: student.roomId })
      }
    }
  }

  backPressed() {
    this.props.userChatStatus.call(null, null)
  }

  render() {
    // let length = this.props.allMessages.length
    return (<div className="col-xs-12 chat-container">
              {(() => {
                if(this.props.userRole == 'admin') {
                    return <SessionList onCallTeacher={this.props.onCallTeacher}
                                        allRooms={this.props.allRooms}
                                        allTeachers={this.props.allTeachers}/>
                } else if(this.props.userRole == 'teacher') {

                  if(this.props.selectedUser) {
                  // if(this.props.selectedUser && this.props.allStudents[this.props.selectedUser]) {
                      return <ChatMessages allMessages={this.props.allMessages}
                                           selectedUser={this.props.selectedUser}
                                           allStudents={this.props.allStudents}
                                           emojiPicker={this.state.emojiPicker}

                                           canLoadMore = {this.props.canLoadMore}
                                           loadMoreMessage={this.props.loadMoreMessage}

                                           offLineUser={this.props.offLineUser}

                                           role={this.props.userRole}
                                           user={this.props.user}/>
                  } else {
                    return <div className="chat-color-no-chat">
                              <div className="row center-xs">
                                <div className="col-xs-12 leyend-item-score">
                                  <div className="no-chat">
                                    <i className="material-icons">chat</i>
                                  </div>
                                </div>
                                <div className="col-xs-12 leyend-item-score">
                                  <span className="no-chat-title">
                                    Chat desactivado
                                  </span>
                                </div>
                                <div className="col-xs-6">
                                  <span className="no-chat-subtitle">
                                    selecciona un chat para activarlo nuevamente
                                  </span>
                                </div>
                              </div>
                           </div>
                  }
                } else {
                  return <ChatMessages allMessages={this.props.allMessages}
                                       selectedUser={this.props.selectedUser}

                                       canLoadMore={this.props.canLoadMore}
                                       loadMoreMessage={this.props.loadMoreMessage}

                                       role={this.props.userRole}
                                       emojiPicker={this.state.emojiPicker}
                                       user={this.props.user}
                                        />
                }
              })()}
              {(() => {
                  if(this.props.userRole == 'learner') {
                      return <MessageSender onlyLetters={this.onlyLetters.bind(this)}
                                            isEnabled={this.props.selectedUser}
                                            emojiPicker={this.state.emojiPicker}
                                            handleUpload={this.handleUpload.bind(this)}
                                            handleClick={this.handleClick.bind(this)}
                                             />
                  } else if(this.props.userRole == 'teacher') {
                    if(this.props.selectedUser) {
                    // if(this.props.selectedUser && this.props.allStudents[this.props.selectedUser]) {
                        return <MessageSender onlyLetters={this.onlyLetters.bind(this)}
                                              isEnabled={this.props.selectedUser}
                                              emojiPicker={this.state.emojiPicker}
                                              handleUpload={this.handleUpload.bind(this)}
                                              handleClick={this.handleClick.bind(this)}
                                            />
                    }
                  }
              })()}
              {(() => {
                  if(this.props.userRole == 'teacher') {
                      return <UsersInSession changeChatStatus={this.userChatStatus.bind(this)}
                                             studentOrder={this.props.studentOrder}
                                             changeTeacher={this.props.changeTeacher}
                                             user={this.props.user}
                                             usersOffLine={this.props.usersOffLine}
                                             allStudents={this.props.allStudents}/>
                  }
              })()}

              {(() => {
                if(this.props.userRole == 'teacher' && this.props.pauseCallStudents.length > 0) {
                  return  <UsersPausedCall
                    onResumeCall={this.props.onResumeCall}
                    pauseCallStudents={this.props.pauseCallStudents}
                    onStreaming={this.props.onStreaming}
                  />
                }
              })()}



            </div>
    )
  }
}
