import React from 'react'
import ChatMessage from 'src/client/modules/Moodle/BoxChat/Chat/ChatMessage'

export default class ChatMessages extends React.Component {

  componentWillUnmount() {
    // $('#chat-list').perfectScrollbar('destroy')

  }
  componentWillMount() {
    // $('#chat-list').perfectScrollbar()
  }

  render() {
    let student = this.props.user
    let length = this.props.allMessages.length
    return (<div id="chat-color" className="chat-color-box">

                {(() => {

                    if(length > 0){
                        return this.props.allMessages.map((message, index) => {
                          // console.log('message', message);
                        if((index + 1) ==  length){

                            setTimeout(() => {
                              let chatContainer = document.getElementById("chat-color");
                              chatContainer.scrollTop = chatContainer.scrollHeight;
                            }, 100)

                        }
                        return <ChatMessage
                          key={index}
                          index={index}
                          emojiPicker={this.props.emojiPicker}
                          student={student}
                          isFile={message.isUrl ? message.isUrl: false}
                          from={message.messageType}
                          messagge={message.message}/>
                        })
                    }
                })()}
            </div>

    )
  }
}
