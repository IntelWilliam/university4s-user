import React from 'react'
// import ExerciseDescription from 'src/client/modules/Exercises/ExerciseDescription'
import CommentContainer from 'src/client/modules/Moodle/ChatCosmo/Conversation/CommentContainer'
import Constants from 'src/client/Constants/Constants'
import Speecher from 'src/client/modules/Speecher/Speecher'

class ConversationSectionItem extends React.Component {
  constructor() {
    super()
    this.state = {
      comments: [],
      currentIndex: 0,
      section: Constants.SECTION_ID.CONVERSATION,
      commentsFinished: false
    }
  }

  // se ejecuta antes de de montar el componente
  componentWillMount() {
    // se cargan los datos
    this.speecherInstance = new Speecher()
  }

  resetState(){
    console.log('onRset');
    this.refs['CommentContainer'].resetState()
  }

  render() {
    return (
      <div className="container">
        <div className="col-xs-12">
          <div className="row">
            <div className="col-xs-12">
              <div className="row">
                <CommentContainer
                  ref="CommentContainer"
                  cosmoSesion = {this.props.cosmoSesion}
                  speecherInstance = {this.speecherInstance}
                  storyRaw = {this.props.storyRaw}
                  topic = {this.props.topic}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ConversationSectionItem
