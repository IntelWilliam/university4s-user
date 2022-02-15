import React from 'react'
import ChatMessage from 'src/client/modules/Chat/Chat/ChatMessage'

export default class ChatMessages extends React.Component {

  constructor() {
    super();
    this.state = {
      scrollToLoad: false,
      scrollLastMessage: false,
      currentLength: 0
    }
  }

  componentWillUnmount() {
    // $('#chat-list').perfectScrollbar('destroy')

  }
  componentWillMount() {
    // $('#chat-list').perfectScrollbar()

  }

  componentWillReceiveProps(nextProps){
    // let student = this.props.allStudents ? this.props.allStudents[this.props.selectedUser] : this.props.user
    let length = nextProps.allMessages[nextProps.selectedUser] ? nextProps.allMessages[nextProps.selectedUser].length : 0

    if(this.state.currentLength != length){
      if(length <= 20 ||(length-this.state.currentLength) == 1){
        this.setState({
          currentLength: length,
          scrollLastMessage: true
        })
      }else{
        this.setState({
          currentLength: length,
          scrollToLoad: true
        })
      }
    }
  }

  loadMoreMessage(){

    this.setState({scrollTo: true}, ()=>{
      this.props.loadMoreMessage.call(null)
    })

  }

  render() {

    // console.log(this.props.allStudents[this.props.selectedUser]);
    // console.log(!!this.props.allStudents[this.props.selectedUser]);
    var student = this.props.user
    if (!!this.props.allStudents) {
      if (!!this.props.allStudents[this.props.selectedUser]) {
        student = this.props.allStudents[this.props.selectedUser]
      } else {
        student = this.props.offLineUser
      }

    }

    return (<div id="chat-color" className="chat-color">

                {(() => {
                  if(this.props.allMessages[this.props.selectedUser]){
                    if(this.props.canLoadMore && this.props.allMessages[this.props.selectedUser].length >= 20)
                      return(
                        <div className="load-message-content">
                          <button className="load-message-button center mousePoint" onClick={this.loadMoreMessage.bind(this)} >Cargar mensages</button>
                        </div>
                      )
                  }
                })()}

                {(() => {


                  if(this.props.allMessages[this.props.selectedUser]){
                    return this.props.allMessages[this.props.selectedUser].map((message, index) => {
                      if((index + 1) ==  this.state.currentLength && this.state.scrollLastMessage){

                        setTimeout(() => {
                          let chatContainer = document.getElementById("chat-color");
                          chatContainer.scrollTop = chatContainer.scrollHeight;
                          this.setState({
                            scrollLastMessage: false
                          })
                        }, 50)

                      }else if ((index + 1) == this.state.currentLength && this.state.scrollToLoad){
                        setTimeout(() => {

                          $('#chat-color').animate({
                            scrollTop: ($('#unicodeToImg_18').offset().top) - $('#chat-color').height()
                          },1);
                          this.setState({scrollToLoad: false})
                        }, 100)
                      }
                      return <ChatMessage
                          student={student}
                          user={this.props.user}
                          role={this.props.role}
                          key={index}
                          index={index}
                          emojiPicker={this.props.emojiPicker}
                          selectedUser={this.props.selectedUser}
                          from={message.senderId}
                          createdAt={message.createdAt}
                          isFile={message.isUrl ? message.isUrl: false}
                          messagge={message.message}/>
                    })
                  }
                })()}
            </div>

    )
  }
}
