import React from 'react'
import {formatDate} from 'src/client/Util/Util.js'

export default class ChatMessage extends React.Component {

  constructor() {
    super();
    this.state = {
      showMensagge: '',
    }
  }

  componentDidMount() {
    if(!this.props.isFile){
      this.checkIfEmoji(this.props.messagge)
    }
  }

  checkIfEmoji(word){
    let matchEmoji = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g;

    if(matchEmoji.test(word)){
      this.unicodeToImg(word)
    }else{
      this.setState({showMensagge: word})
    }
  }

  unicodeToImg(wordEmoji){
    var toSpan = $('#unicodeToImg_' + this.props.index)
    if(this.props.messagge){
      toSpan.empty();
      let updateMessage = wordEmoji ? wordEmoji : this.props.messagge
      this.props.emojiPicker.appendUnicodeAsImageToElement(toSpan, updateMessage)
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.messagge != nextProps.messagge && !nextProps.isFile){
      this.checkIfEmoji(nextProps.messagge)
    }
  }

  render() {
    let userImg = this.props.student.profileImg ? this.props.student.profileImg : '/images/profile-img.png'

    let fileStyle = this.props.isFile? {
      background: '#9E9E9E',
    } : {}

    let fileClass = this.props.isFile? 'student-message-file' : 'student-message'


    return <div className="col-xs-12">
      {(() => {

        if (this.props.from == 0) {
          return  <div className="message-container">
            <div className="row">
              <div className="col-xs-12 pull-end">
                <span className="message-name">{this.props.student.name + ' ' + this.props.student.lastname}</span>
              </div>
              <div className="col-xs-12 flex-disp student-message-container">
                <div className={"message-subcontainer " + fileClass} style={fileStyle}>
                    {(() => {
                      if (this.props.isFile) {
                        return(
                          <a href={"/api/file-chat/" + this.props.messagge} target="_blank" rel='noopener noreferrer'>
                            {this.props.messagge}
                          </a>
                        )
                    }else{
                      return(
                        <span style={{maxWidth: '100%'}} className="" id={"unicodeToImg_"+this.props.index} > { this.state.showMensagge } </span>
                      )
                    }
                  })()}
                  {/* <span className="">{this.props.messagge}</span> */}
                </div>
                <div className="img-user-list">
                  <img src={userImg} className="cosmo-image"/>
                </div>
              </div>
            </div>
          </div>
        } else {
          return <div className="message-container">
            <div className="row">
              <div className="col-xs-12 flex-disp">
                <div className="img-user-list">
                  <img src="/images/chat-teacher.png" className="cosmo-image"/>
                </div>
                <div className={"message-subcontainer teacher-triangle" + fileClass} style={fileStyle}>
                      {(() => {
                        if (this.props.isFile) {
                          return(
                            <a href={"/api/file-chat/" + this.props.messagge} target="_blank" rel='noopener noreferrer'>
                              {this.props.messagge}
                            </a>
                          )
                      }else{
                        return(
                          // <span className="">{this.props.messagge}</span>
                          <span className="" style={{maxWidth: '100%'}} id={"unicodeToImg_"+this.props.index} > { this.state.showMensagge } </span>
                        )
                      }
                    })()}
                  {/* <span className="">{this.props.messagge}</span> */}
                </div>
              </div>
            </div>
          </div>
        }

      })()}
    </div>
  }
}
