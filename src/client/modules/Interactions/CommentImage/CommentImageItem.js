import React from 'react'
import CommentImageItemOn from 'src/client/modules/Interactions/CommentImage/CommentImageItemOn'
import CommentImageItemOff from 'src/client/modules/Interactions/CommentImage/CommentImageItemOff'
import PhrasesActions from 'src/client/modules/Phrases/PhrasesActions'

class CommentImageItem extends React.Component {

  constructor() {
    super()
    this.state = {
      showDetails: false,
      correct: null,
      whatAmISaying: '',
      listening: false,
      translation: ""
    }
  }

  componentWillMount(){
    // console.log('CommentImageItem');
    this.loadTranslation()
  }

  loadTranslation() {
    // se obtiene la traducción de la phrase
    PhrasesActions.getPhraseTranslations(this.props.phraseId, { phrases: this.props.phraseId },
      (err, phraseTranslations) => {
        if (phraseTranslations[0]) {
          this.setState({
            translation: phraseTranslations[0].phrases.phrase
          })
        }
      })
    }

    mouseEnter() {
      this.setState({
        showDetails: true
      })
    }

    mouseLeave() {
      this.setState({
        showDetails: false
      })
    }

    isFinished() {
      return this.state.correct;
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
        whatAmISaying: "Vuelve a intentarlo, pronuncia de nuevo"
        // whatAmISaying: phrase
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
        <div className="comment-item" style={{maxWidth: '15em'}}>
          {(() => {
            if(this.state.showDetails) {
              return (
                <CommentImageItemOn
                  mouseLeave={this.mouseLeave.bind(this)}
                  triggerListenChange={this.props.triggerListenChange.bind(this)}
                  changeListening={this.changeListening.bind(this)}
                  imageUrl={this.props.imageUrl}
                  classCorrect={classCorrect}
                  whatAmISaying={this.state.whatAmISaying}
                  listening={this.state.listening}
                  refComponent={this.props.index + 1}
                  name={this.props.name}
                  translation={this.state.translation}
                  castell={this.props.castell}
                />)

              } else {
                return (
                  <CommentImageItemOff
                    mouseEnter={this.mouseEnter.bind(this)}
                    classCorrect={classCorrect}
                    whatAmISaying={this.state.whatAmISaying}
                    name={this.props.name}
                    imageUrl={this.props.imageUrl}
                  />
                )
              }
            })()}
          </div>
        )
      }
    }

    export default CommentImageItem
