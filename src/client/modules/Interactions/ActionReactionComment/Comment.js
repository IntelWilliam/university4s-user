import React from 'react'
import ActionItem from 'src/client/modules/Interactions/ActionReactionComment/ActionItem'
import Constants from 'src/client/Constants/Constants'

class Comment extends React.Component {

  constructor(props) {
    super(props)
      // si es el primer item
    let shouldSpeak = this.props.index == 0;
    this.state = {
      correct: null,
      shouldSpeak: shouldSpeak,
      whatAmISaying: "",
      listening: false
    }
    this.checkRecognized = this.checkRecognized.bind(this)
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

  listenWord(recognized) {
    // se hace esto ya que a veces cogia la frase de cosmo como invalida
    if (this.props.author == Constants.AUTHOR.COSMO && recognized) {
      this.updateListenWord(recognized)
    } else if (this.props.author == Constants.AUTHOR.USER) {
      this.updateListenWord(recognized)
    }
  }

  whatAmISaying(phrase) {
    this.setState({
      whatAmISaying: "Vuelve a intentarlo, pronuncia de nuevo"
      // whatAmISaying: phrase
    })
    this.changeListening(false)
  }

  checkRecognized() {
    this.props.phraseEnded.call(null)
    this.props.checkFinished.call(null)
  }

  updateListenWord(recognized) {
    this.setState({
      correct: recognized
    }, (() => {
      if (recognized) {
        setTimeout(this.checkRecognized, 1000)
      }
    }).bind(this))
  }

  // se ejecuta antes de de montar el componente
  componentWillMount() {
    // console.log('Comment');
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
                <ActionItem
                    triggerListenChange={this.props.triggerListenChange.bind(this)}
                    changeListening={this.changeListening.bind(this)}
                    listenWord={this.listenWord.bind(this)}
                    classCorrect={classCorrect}
                    phraseId={this.props.phraseId}
                    shouldSpeak={this.state.shouldSpeak}
                    phraseInProgress={this.props.phraseInProgress}
                    phraseEnded={this.props.phraseEnded}
                    canSayNext={this.props.canSayNext}
                    whatAmISaying={this.state.whatAmISaying}
                    description={this.props.description}
                    listening={this.state.listening}
                    author={this.props.author}
                    refComponent={this.props.index + 1}
                    name={this.props.name}
                    castell={this.props.castell}
                />
            </div>
    )
  }
}

export default Comment
