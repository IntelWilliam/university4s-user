import React from 'react'
import Pronouncer from 'src/client/modules/Pronouncer/Pronouncer'
import ListenWriteInput from 'src/client/modules/Exercises/ListenWrite/ListenWriteInput'
import { caseDescription, sentenceCase} from 'src/client/Util/Capitalize'

class CorrectAnswerContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      allAnswers: this.props.exercise.answers,
      correctAnswer: this.props.exercise.correctAnswer,
      phrase: this.props.exercise.phrase,
      formattedPhrase: this.props.exercise.phrase.replace(/([^a-zA-Z]+)/gi, ''),
      isPhraseOk: false,
      errorMessage: "identifica-la-palabra"
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.exercise._id != this.props.exercise._id) {
      this.setState({
        exercise: nextProps.exercise,
        formattedPhrase: nextProps.exercise.phrase.replace(/([^a-zA-Z]+)/gi, ''),
        phrase: nextProps.exercise.phrase,
        isPhraseOk: false
      });
    }
  }

  sayWord() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.state.phrase)
  }

  sayWordSpeed() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.state.phrase, null, { rate: 0.5 })
  }

  checkIfFinished(index) {
    if(this.state.correctAnswer == index){
        this.setState({
          isOk: true
        })
        this.props.loadNext.call(null);
    }else{
      this.props.showFailMessage.call(null, this.state.errorMessage);

    }

  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
            {caseDescription(this.props.exercise.description)}
        </div>
        <div className="col-xs-12">
          <div className="order-word-container">

            <div className="row">
              <div className="col-xs-12">
                <span className="right-translation-phrase">
                  {sentenceCase(this.state.phrase)}
                </span>
              </div>
            </div>


            <div className="words-to-complete">
                {this.state.allAnswers.map((answer, index) => {

                return (

                  <div key={index} className="select-word-order mousePoint" onClick={this.checkIfFinished.bind(this, index)}>
                      {sentenceCase(answer)}
                  </div>

                )
                })}
            </div>


            <div className="row">
              <div className="col-xs-12">
                <div className="" onClick={this.sayWordSpeed.bind(this)}>
                    <img style={{ float: "right", marginLeft: "5px"}} src="/images/turtle.png" className="icon-comment mousePoint"/>
                </div>
                <div className="" onClick={this.sayWord.bind(this)}>
                  <img style={{ float: "right", marginLeft: "5px"}} src="/images/sound.png" className="icon-comment mousePoint"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CorrectAnswerContainer
