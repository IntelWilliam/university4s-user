import React from 'react'
import ChatMessages from 'src/client/modules/Chat/Chat/ChatMessages'
import MessageSender from 'src/client/modules/Chat/Chat/MessageSender'
import UserInfo from 'src/client/modules/Chat/Chat/UserInfo'

export default class CurrentChat extends React.Component {

  componentWillUnmount() {
    // $('#teacher-chat-list').perfectScrollbar('destroy')
  }
  componentDidMount() {
    // $('#teacher-chat-list').height(window.innerHeight - 185).perfectScrollbar();
    // $("#teacher-chat-list").scrollTop($("#teacher-chat-list").prop("scrollHeight"));
    // $("#teacher-chat-list").perfectScrollbar('update');
  }

  render() {
    let profilePicture = "/images/student-profile.png"
    return (
        <div>
            {(() => {

                if(this.props.selectedUser != null) {
                    if(this.props.allStudents[this.props.selectedUser]) {
                        return (<aside>
                            <ul id="teacher-chat-out" className="chat-bar">
                                <UserInfo picture={profilePicture}
                                          name={this.props.allStudents[this.props.selectedUser].name}
                                          lastname={this.props.allStudents[this.props.selectedUser].lastname}
                                          email={this.props.allStudents[this.props.selectedUser].email}/>
                                <div id="teacher-chat-list" className="chat-list">
                                    <ChatMessages allMessages={this.props.allMessages}
                                                  selectedUser={this.props.selectedUser}/>
                                </div>
                                <MessageSender onlyLetters={this.props.onlyLetters}
                                               isEnabled={this.props.selectedUser}/>
                            </ul>
                        </aside>)
                    }
                }
            })()}
            </div>
    )
  }
}
