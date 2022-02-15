import React from 'react'
import CallButton from 'src/client/modules/Chat/Main/CallButton'
import Timer from 'src/client/modules/Chat/Timer/Timer'
import Board from 'src/client/modules/Chat/Board/Board'
import StudentBoard from 'src/client/modules/Chat/Board/StudentBoard'
import Chat from 'src/client/modules/Chat/Chat/Chat'

class Main extends React.Component {
  constructor() {
    super()
    this.state = {
      teacherOutChat: true,
      isBoardShared: false,
      hasAudio: true,
      hasVideo: true,
      vid1State: null,
      vid2State: null
    }
    this.playVideo = this.playVideo.bind(this)
    this.playAudio = this.playAudio.bind(this)
  }

  onUserMediaSuccess(stream) {
    this.props.onUserMediaSuccess.call(null, stream)
  }

  playVideo(changeType) {
    if (this.refs.videRef) {
      if (changeType == 1) {
        this.refs.vidRef.pause()
        this.setState({hasVideo: false})
      } else {
        this.refs.vidRef.play()
        this.setState({hasVideo: true})
      }
    }
  }

  playAudio(changeType) {
    if (this.refs.audRef) {
      if (changeType == 1) {
        this.setState({hasAudio: false})
        this.refs.audRef.pause()
      } else {
        this.setState({hasAudio: true})
        this.refs.audRef.play()
      }
    }
  }

  componentDidMount(){
    this.setState({
      vid2State: this.props.vid2,
      vid1State: this.props.vid1
    })

    this.updateVid2(this.props.vid2)
    this.updateVid1(this.props.vid1)
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.vid2 != this.state.vid2State){
      this.setState({
        vid2State: nextProps.vid2
      })
      if(this.props.userRole != "admin") {
        this.updateVid2(nextProps.vid2)
      }
    }

    if(nextProps.vid1 != this.state.vid1State){
      this.setState({
        vid1State: nextProps.vid1
      })
      if(this.props.userRole != "admin") {
        this.updateVid1(nextProps.vid1)
      }
    }
  }

  updateVid2(stream) {
    let video2 = document.getElementById("vid2")
    if(video2)
      video2.srcObject = stream
  }

  updateVid1(stream) {
    console.log('stream vid1: -> ', stream);

    let video1 = document.getElementById("vid1")
    if(video1)
      video1.srcObject = stream
  }

  render() {
    let remoteVideo = this.props.remoteVideo ? 'block' : 'none'
    // let remoteVideo = this.props.remoteVideo && !this.props.imStudentPaused ? 'block' : 'none'
    let imageRemote = this.props.onStreaming == undefined ? 'block' : (this.props.remoteVideo ? 'none': 'block')
    // let chatButton = this.props.userRole == 'teacher' ? "teacher-chat-button" : "chat-button";
    // let logOutButton = this.props.userRole == 'teacher' ? "teacher-logout-button" : "logout-button";
    // let videoContainer = this.props.userRole == 'teacher' ? "teacher-video-container-main" : "video-container-main";
    // let chatLayoutId = this.props.userRole == 'teacher' ? "teacherDispChatList" : "dispChat";
    // let video2 = this.props.userRole == 'teacher' ? "teacher-video2" : "video2";
    // let chatIcon = this.props.userRole == "teacher" ? "mdi-action-list" : "mdi-communication-comment";

    return (
      <div className="col-xs-12">
        <div className="video-chat-container" style = {{display: 'flex', justifyContent: 'center'}}>
          <div className="col-xs-11">
          {/* <div className="container"> */}
            <div className="row">
              <div className="col-xs-12 col-md-4">
                <div className="row">
                  <div className="col-xs-12 user-video-container">
                    <div className="user-video-container-in">
                      <img className="img-student" src="/images/teacher-chat.png"/>

                      {(() => {
                        if(this.props.userRole != "admin") {
                          return (
                            <video id="vid2" className="user-chat-video" autoPlay muted />
                          )
                         }
                      })()}

                      {(() => {
                      // if(true) {
                        if(!this.props.offLineUser){
                      // if(this.props.userRole === "learner" || this.props.onStreaming != null) {
                          return <CallButton onShareBoard={this.props.onBoardShare}
                                             buttonAudio={this.props.buttonAudio}
                                             onPauseCall={this.props.onPauseCall}
                                             buttonVideo={this.props.buttonVideo}
                                             buttonShare={this.props.buttonShare}
                                             imStudentPaused={this.props.imStudentPaused}
                                             onChangeTracks={this.props.onChangeTracks}
                                             onShareScreen={this.props.onShareScreen}
                                             onStopShareScreen={this.props.onStopShareScreen}
                                             onStreaming={this.props.onStreaming}
                                             userRole={this.props.userRole}
                                             selectedUser={this.props.selectedUser}
                                             stopCamShare={this.props.stopCamShare}
                                             onCallPartner={this.props.onCallPartner}
                                             onEndCall={this.props.onEndCall}/>
                        }
                      })()}
                    </div>
                  </div>
                  <Chat userChatStatus={this.props.userChatStatus}
                        selectedUser={this.props.selectedUser}
                        sendMessage={this.props.sendMessage}
                        userRole={this.props.userRole}
                        allMessages={this.props.allMessages}
                        changeTeacher={this.props.changeTeacher}
                        user={this.props.user}

                        canLoadMore = {this.props.canLoadMore}
                        loadMoreMessage={this.props.loadMoreMessage}

                        offLineUser={this.props.offLineUser}
                        pauseCallStudents={this.props.pauseCallStudents}
                        onResumeCall= {this.props.onResumeCall}
                        onStreaming={this.props.onStreaming}

                        allStudents={this.props.allStudents}
                        usersOffLine={this.props.usersOffLine}
                        studentOrder={this.props.studentOrder}/>

                </div>
              </div>
              <div className="col-xs-12 col-md-8">
                <div className="row other-user-video-container-row">
                  <div className="col-xs-12 other-user-video-area">

                    {(() => {
                        // if(this.props.onStreaming != undefined) {
                      if( this.props.imStudentPaused) {
                        return (
                          <div className="pauseContaine">
                            <p className="pauseTitle">LLamada en pausa</p>
                            <p className="pauseDesc">por favor espera mientras reanudamos la llamada.</p>
                          </div>
                        )
                      }
                    })()}


                    <img className="img-student second-container" src="/images/teacher-chat.png" style={{display:imageRemote}}/>

                  {(() => {
                    if (this.props.isBoardShared && this.props.userRole == 'teacher') {
                        return(
                            <Board remoteVideo={this.props.remoteVideo} notifyBoardContentChanged={this.props.notifyBoardContentChanged} boardContent={this.props.boardContent}/>
                        )
                    }
                  })()}

                  {(() => {
                       if (this.props.isBoardShared && this.props.userRole == 'learner') {
                            return (
                                    <StudentBoard boardContent={this.props.boardContent}/>
                                )
                        }
                  })()}

                  {(() => {
                    if(this.props.userRole == "admin") {

                      let video1 = document.getElementById("vid1")
                      if(video1)
                        video1.srcObject = this.props.vid1? this.props.vid1 : null

                      let video2 = document.getElementById("vid2")
                      if(video2)
                        video2.srcObject = this.props.vid2? this.props.vid2 : null

                      return  (<div>
                                  <div className="col-xs12 col-md-12 col-lg-6">
                                    <video id="vid1" autoPlay className="video1" />
                                  </div>
                                  <div className="col-xs12 col-md-12 col-lg-6">
                                    <video id="vid2" autoPlay className="video1" />
                                  </div>
                                </div>)
                    } else {
                      // console.log('this.props.isBoardShared', this.props.isBoardShared);
                        if (true) {
                        // if (!this.props.isBoardShared) {
                            return (<div className="other-user-video-container" style={{display:remoteVideo}}>

                                    {(() => {
                                        // if(this.props.onStreaming != undefined) {
                                      if( !this.props.imStudentPaused) {

                                        // let video1 = document.getElementById("vid1")
                                        // if(video1)
                                        //   video1.srcObject = this.state.hasVideo && this.props.vid1? this.props.vid1 : null
                                        return (
                                              <video ref="vidRef" id="vid1" autoPlay muted className="video1 video-other other-user-video"/>
                                        )
                                      }
                                    })()}
                                    </div>)
                        }
                    }
                  })()}


                  {(() => {

                    let aud1 = document.getElementById("aud1")
                    if(aud1)
                      aud1.srcObject = this.state.hasAudio && this.props.aud1? this.props.aud1 : null

                    // if(this.props.onStreaming != undefined) {
                    return (
                      <audio ref="audRef" id="aud1" autoPlay style={{display: 'none'}}/>
                    )
                  })()}


                  {(() => {
                      // if(this.props.onStreaming != undefined) {
                      if(this.props.onStreaming != undefined && !this.props.imStudentPaused) {
                          return (
                            <Timer/>
                          )
                      }
                  })()}

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

export default Main
