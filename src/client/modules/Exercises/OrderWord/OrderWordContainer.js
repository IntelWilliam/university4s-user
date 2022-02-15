import React from 'react'
import { shuffle } from 'src/client/Util/Randomize'
import OrderWordBox from 'src/client/modules/Exercises/OrderWord/OrderWordBox'
import OrderWordResult from 'src/client/modules/Exercises/OrderWord/OrderWordResult'
import update from 'react/lib/update';
import Pronouncer from 'src/client/modules/Pronouncer/Pronouncer'
import { sentenceCase, caseDescription } from 'src/client/Util/Capitalize'

class OrderWordContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      exercise: this.props.exercise,
      phrase: [],
      currentPhrase: [],
      unOrderedPhrase: [],
      errorMessage: "ordena-oracion"
    };
  }

  sayWord() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.state.exercise.phrase)
  }

  sayWordSpeed() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.state.exercise.phrase, null, { rate: 0.5 })
  }

  // se ejecuta antes de de montar el componente
  componentWillMount() {
    this.preOrderData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.exercise._id != this.props.exercise._id) {
      this.setState({
        exercise: nextProps.exercise,
        phrase: [],
        unOrderedPhrase: [],
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
    // se hace una copia del array ordenado para mutar la data luego
    let unOrderedPhrase = phraseArray.slice(0)
    unOrderedPhrase = shuffle(unOrderedPhrase);
    let unOrdered = [];
    // se crea un nuevo arreglo para poder guardar el estado de si está ya seleccionado por el usuario o no
    unOrderedPhrase.forEach((word) => {
      unOrdered.push({
        word: word,
        isSet: false
      })
    })
    this.setState({
      phrase: phraseArray,
      unOrderedPhrase: unOrdered
    })
  }

  // metodo encargado de actualizar el estado de acuerdo a la palabra selecconada desde un componente hijo
  wordSelected(word, index) {
    let isWordAlready = this.state.currentPhrase.filter((phrase) => {
      return phrase.index == index;
    })
    if (isWordAlready.length == 0) {
      // creo un arreglo con los datos que va a tener el state para mandarlo al metodo que verifica si ya
      // finalizó
      let checkArray = this.state.currentPhrase.slice(0)
      checkArray.push({
        word: word
      })
      this.setState(update(this.state, {
        currentPhrase: {
          $push: [{
            word: word,
            index: index
          }]
        },
        unOrderedPhrase: {
          [index]: {
            $set: {
              word: word,
              isSet: true
            }
          }
        }
      }));
      this.checkIfFinished(checkArray);
    }
  }

  checkIfFinished(currentPhrase) {
    // se compara el length de la phrase original con la creada si son iguales es por que se terminó
    if (currentPhrase.length == this.state.phrase.length) {
      let finished = true;
      let phrase = this.state.phrase;
      // se verifica si son iguales de lo contrario el ejercicio está mal
      for (let i = 0; i < currentPhrase.length; i++) {
        if (currentPhrase[i].word != phrase[i]) {
          finished = false;
          break;
        }
      }
      this.checkAnswer(finished);
    }
  }

  checkAnswer(status) {
    // de acuerdo al estado del ejercicio se llama al siguiente o se reinicia
    if (status) {
      this.props.loadNext.call(null);
    } else {
      this.props.showFailMessage.call(null, this.state.errorMessage);
      let unOrdered = this.state.unOrderedPhrase.map((phrase) => {
        return {
          word: phrase.word,
          isSet: false
        }
      })
      unOrdered = shuffle(unOrdered);
      this.setState({
        currentPhrase: [],
        unOrderedPhrase: unOrdered
      })
    }
  }

  /**
   * Metodo encargado de deshacer una palabra que el usuario elimina
   * @param unOrderedIndex, el indice del arreglo de palabras que está desordenado
   * @param currentPhraseIndex el indice de la palabra que elimina el usuario dentro del arreglo de
   * palabras que está conformando
   */
  undoWord(unOrderedIndex, currentPhraseIndex) {
    let currentPhrase = this.state.currentPhrase;
    currentPhrase.splice(currentPhraseIndex, 1);
    let unOrdered = this.state.unOrderedPhrase;
    unOrdered[unOrderedIndex].isSet = false;

    this.setState({
      currentPhrase: currentPhrase,
      unOrderedPhrase: unOrdered
    })
  }

  render() {
    return (
      <div className="row">
      <div className="col-xs-12">
          {caseDescription(this.props.exercise.description)}
      </div>
      <div className="col-xs-12">
        <div className="order-word-container">
          <div className="words-to-select-container">
              {this.state.unOrderedPhrase.map((phrase, index) => {
              return <OrderWordBox word={phrase.word}
                                   isSet={phrase.isSet}
                                   index={index}
                                   wordSelected={this.wordSelected.bind(this)}
                                   key={index} />
              })}
          </div>
          <OrderWordResult phrase={this.state.currentPhrase} undoWord={this.undoWord.bind(this)}/>
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
