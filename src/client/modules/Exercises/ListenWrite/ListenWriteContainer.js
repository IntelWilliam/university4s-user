import React from 'react'
import Pronouncer from 'src/client/modules/Pronouncer/Pronouncer'
import ListenWriteInput from 'src/client/modules/Exercises/ListenWrite/ListenWriteInput'
import { caseDescription } from 'src/client/Util/Capitalize'

class ListenWriteContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      exercise: this.props.exercise,
      phrase: this.props.exercise.phrase,
      formattedPhrase: this.props.exercise.phrase.replace(/([^a-zA-Z]+)/gi, ''),
      isPhraseOk: false,
      errorMessage: "escucha-escribe"
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
    Pronouncer.sayWord(this.state.exercise.phrase, null, { rate: 0.5 })
  }

  checkIfFinished(phrase) {
    let formattedPhrase = phrase.replace(/([^a-zA-Z]+)/gi, '')
    if (formattedPhrase == this.state.formattedPhrase) {
      this.setState({
        isOk: true
      })
      this.refs.input.restartValue();
      this.props.loadNext.call(null);
    } else {
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
            <div className="words-to-translate">
                <ListenWriteInput ref="input" isOk={this.state.isOk} checkIfFinished={this.checkIfFinished.bind(this)}/>
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

export default ListenWriteContainer
