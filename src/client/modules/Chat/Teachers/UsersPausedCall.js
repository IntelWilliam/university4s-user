import React from 'react'
import PausedStudents from 'src/client/modules/Chat/Student/PausedStudents'

export default class UsersPausedCall extends React.Component {
  constructor() {
    super()
    this.state = {
      userOnline: false
    }
  }

  openUserOnline() {
    this.setState({
      userOnline: !this.state.userOnline
    })
  }

  render() {
    let openMenuClass = this.state.userOnline ? 'col-xs-12 learner-list-container learner-list-container-open' : 'col-xs-12 learner-list-container'
    return (
      <div className="users-pause-call">
        <div className="row">
            <div className="col-xs-12 front" onClick={this.openUserOnline.bind(this)}>
                <div className="users-pause-call-list">
                    <div className="user-list-header-text-container">
                        <span className="user-list-header-text">LLamadas en pausa</span>
                    </div>
                    <div className="img-user-list">
                        <img src='/images/profile-img.png' className="cosmo-image"/>
                    </div>
                </div>
            </div>
        </div>
        <div className={openMenuClass}>
            {(() => {
              if(this.props.pauseCallStudents.length > 0) {
                return this.props.pauseCallStudents.map((student, index) => {

                  // console.log('student.notifyNumber', student);
                  return <PausedStudents
                                    student={student}
                                    // ref={'inAct' + index}
                                    key={index}
                                    user={this.props.user}
                                    // offLine = {true}
                                    onResumeCall={this.props.onResumeCall}
                                    // badge = {student.notifyNumber? student.notifyNumber : 0}
                                    // changeChatStatus={this.props.changeChatStatus}
                                    onStreaming={this.props.onStreaming}
                                />
                })
              }
            })()}
        </div>
    </div>
    )
  }
}
