import React from 'react'
import Pronouncer from 'src/client/modules/Pronouncer/Pronouncer'
import ListenCompleteBox from 'src/client/modules/Exercises/ListenComplete/ListenCompleteBox'
import { caseDescription } from 'src/client/Util/Capitalize'

class OrderWordContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      exercise: this.props.exercise,
      phrase: this.props.exercise.phrase,
      missingWords: this.props.exercise.missingWords,
      currentPhrase: [],
      errorMessage: "completar-frase"
    };
  }

  // se ejecuta antes de de montar el componente
  componentWillMount() {
    this.preOrderData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.exercise._id != this.props.exercise._id) {
      this.setState({
        exercise: nextProps.exercise,
        missingWords: nextProps.exercise.missingWords,
        phrase: nextProps.exercise.phrase,
        currentPhrase: []
      }, (() => {
        this.preOrderData();
      }).bind(this));
    }
  }

  // se ejecuta antes de de montar el componente
  preOrderData() {
    let phrase = this.state.exercise.phrase.trim()
    let phraseArray = phrase.split(" ");
    let words = this.state.missingWords;

    let missingWords = words.map((word, index) => {
      return {
        word: phraseArray[index],
        isHidden: word.isHidden
      }
    })

    let currentPhrase = missingWords.map((word, index) => {
      if (word.isHidden) {
        return ""
      } else {
        return word.word;
      }
    })

    this.setState({
      phrase: phraseArray,
      missingWords: missingWords,
      currentPhrase: currentPhrase
    })
  }

  sayWord() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.state.exercise.phrase)
  }

  sayWordSpeed() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.state.exercise.phrase, null, { rate: 0.5 })
  }

  // metodo encargado de actualizar el estado de acuerdo a la palabra digitada por el usuario
  wordChanged(word, index) {

    // creo un arreglo con los datos que va a tener el state para mandarlo al metodo que verifica si ya
    // finalizó , esto ya que el state es asincrono y la validación falla
    let checkArray = this.state.currentPhrase.slice(0)
    checkArray[index] = word;
    this.setState({
      currentPhrase: checkArray
    });
  }

  checkIfFinished() {

    console.log('checkIfFinished');

    // console.log('this.state.currentPhrase', this.state.currentPhrase);
    // console.log('this.state.phrase', this.state.phrase);

    let currentPhrase = this.state.currentPhrase;
      // se compara el length de la phrase original con la creada si son iguales es por que se terminó
    if (currentPhrase.length == this.state.phrase.length) {
      let finished = true;
      let phrase = this.state.phrase;
      // se verifica si son iguales de lo contrario el ejercicio está mal
      for (let i = 0; i < currentPhrase.length; i++) {
        console.log('currentPhrase[i].replac', currentPhrase[i].replace(/([^a-z0-9]+)/gi, ''));
        console.log('== =>', phrase[i].replace(/([^a-z0-9]+)/gi, ''));
        if (currentPhrase[i].replace(/([^a-z0-9]+)/gi, '').toLowerCase() != phrase[i].replace(/([^a-z0-9]+)/gi, '').toLowerCase()) {
          finished = false;
          break;
        }
      }
      if (finished) {
        this.props.loadNext.call(null);
      } else  {
        this.props.showFailMessage.call(null, this.state.errorMessage);
      }
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
              <div className="words-to-complete">
                  {this.state.missingWords.map((word, index) => {
                  return <ListenCompleteBox word={word.word}
                                       isHidden={word.isHidden}
                                       index={index}
                                       wordChanged={this.wordChanged.bind(this)}
                                       key={index} />
                  })}
                <div className="col-xs-12 col-md-2">
                  <button className="translate-check mousePoint" onClick={this.checkIfFinished.bind(this)}>Enviar</button>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                <div className="" onClick={this.sayWordSpeed.bind(this)}>
                    <img style={{ float: "right", marginLeft: "5px", marginTop: "0.3em"}} src="/images/turtle.png" className="icon-comment mousePoint"/>
                </div>
                <div className="" onClick={this.sayWord.bind(this)}>
                  <img style={{ float: "right", marginLeft: "5px", marginTop: "0.3em"}} src="/images/sound.png" className="icon-comment mousePoint"/>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default OrderWordContainer
