import React from 'react'
import SimpleCommentItem from 'src/client/modules/Interactions/SimpleComment/SimpleCommentItem'
import SimpleCommentWordDesc from 'src/client/modules/Interactions/SimpleComment/SimpleCommentWordDesc'

class SimpleComment extends React.Component {

  constructor() {
    super()
    this.state = {
      correct: null,
      whatAmISaying: '',
      listening: false
    }
  }

  isFinished() {
    return this.state.correct;
  }

  restartState() {
    this.setState({
      listening: false,
      whatAmISaying: '',
      correct: null
    })
  }

  listenWord(recognized) {
    this.setState({
      correct: recognized
    }, (() => {
      if (recognized) {
        this.props.checkFinished.call(null)
      }
    }).bind(this))
  }

  whatAmISaying(phrase) {
    this.setState({
      // whatAmISaying: 'Vuelve a intentarlo, pronuncia de nuevo'
      whatAmISaying: phrase
    })
  }

  changeListening(isListening) {

    this.setState({
      listening: isListening
    })
  }

  render() {
    let classCorrect = this.state.correct ? " correct-pronunciation" : (this.state.correct == false ? " bad-pronunciation" : "")
    return (
      <div className="comment-item">

        {(() => {
          if (this.props.wordDesc.length > 0) {
            return(
              <SimpleCommentWordDesc
                triggerListenChange={this.props.triggerListenChange.bind(this)}
                changeListening={this.changeListening.bind(this)}
                classCorrect={classCorrect}
                phraseId={this.props.phraseId}
                whatAmISaying={this.state.whatAmISaying}
                description={this.props.description}
                listening={this.state.listening}
                wordDesc = { this.props.wordDesc }
                refComponent={this.props.index + 1}
                name={this.props.name}
                castell={this.props.castell}
              />
            )
          }else {
            return (
              <SimpleCommentItem
                triggerListenChange={this.props.triggerListenChange.bind(this)}
                changeListening={this.changeListening.bind(this)}
                classCorrect={classCorrect}
                phraseId={this.props.phraseId}
                whatAmISaying={this.state.whatAmISaying}
                description={this.props.description}
                listening={this.state.listening}
                refComponent={this.props.index + 1}
                name={this.props.name}
                castell={this.props.castell}
              />
            )
          }

        })()}

        <div className="row">
          <div className="col-xs-12" style={{ paddingTop: '2em' }}>
            <img src={this.props.commentImage} style={{ maxWidth: '80%', borderRadius: '10px' }} />
          </div>
        </div>
      </div>
    )
  }
}

export default SimpleComment
