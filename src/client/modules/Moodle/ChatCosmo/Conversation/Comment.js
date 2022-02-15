import React from 'react'
import ActionItem from 'src/client/modules/Moodle/ChatCosmo/Conversation/ActionItem'
// import Constants from 'src/client/Constants/Constants'

class Comment extends React.Component {

  constructor(props) {
    super(props)
    // si es el primer item
    this.state = {
      whatAmISaying: "",
      listening: false
    }
  }

  isFinished() {
    return this.state.correct;
  }

  restartState() {
    this.setState({
      listening: false,
      whatAmISaying: "",
      correct: null
    })
  }

  whatAmISaying(phrase) {
    this.setState({
      // whatAmISaying: "Vuelve a intentarlo, pronuncia de nuevo"
      whatAmISaying: phrase
    })
    this.changeListening(false)
  }

  changeListening(isListening) {
    this.setState({
      listening: isListening
    })
  }

  render() {
    return (
      <div className="comment-item">
        <ActionItem
          triggerListenChange={this.props.triggerListenChange.bind(this)}
          changeListening={this.changeListening.bind(this)}
          changeCanSay={this.props.changeCanSay}
          cosmoCanSay={this.props.cosmoCanSay}
          whatAmISaying={this.state.whatAmISaying}
          sendQuestion={this.props.sendQuestion}
          description={this.props.description}
          listening={this.state.listening}
          author={this.props.author}
          canSay={this.state.canSay}
          refComponent={this.props.index + 1}
          name={this.props.name}
        />
      </div>
    )
  }
}

export default Comment
