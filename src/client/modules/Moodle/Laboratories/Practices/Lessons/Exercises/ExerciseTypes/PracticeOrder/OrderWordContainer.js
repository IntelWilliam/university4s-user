import React from 'react'
import {shuffle} from 'src/client/Util/Randomize'
import OrderWordBox from 'src/client/modules/Moodle/Laboratories/Practices/Lessons/Exercises/ExerciseTypes/PracticeOrder/OrderWordBox'
import OrderWordResult from 'src/client/modules/Moodle/Laboratories/Practices/Lessons/Exercises/ExerciseTypes/PracticeOrder/OrderWordResult'
import update from 'react/lib/update';

class OrderWordContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            exercisePhrase: this.props.phrase,
            phrase: [],
            currentPhrase: [],
            unOrderedPhrase: [],
            lastPhrase: [],
            isCorrect: null,
            errorMessage: "ordena-oracion"
        };
    }

    // se ejecuta antes de de montar el componente
    componentWillMount() {
        this.preOrderData();
    }

    // se ejecuta antes de de montar el componente
    preOrderData() {
        let phrase = this.state.exercisePhrase.trim()
        let phraseArray = phrase.split(" ");
        // se hace una copia del array ordenado para mutar la data luego
        let unOrderedPhrase = phraseArray.slice(0)
        unOrderedPhrase = shuffle(unOrderedPhrase);
        let unOrdered = [];
        // se crea un nuevo arreglo para poder guardar el estado de si está ya seleccionado por el usuario o no
        unOrderedPhrase.forEach((word) => {
            unOrdered.push({word: word, isSet: false})
        })
        this.setState({phrase: phraseArray, unOrderedPhrase: unOrdered})
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
            checkArray.push({word: word})
            this.setState(update(this.state, {
                currentPhrase: {
                    $push: [
                        {
                            word: word,
                            index: index
                        }
                    ]
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
            this.setState({lastPhrase: checkArray})
        }
    }

    checkIfFinished() {
        let currentPhrase = this.state.lastPhrase;
        this.setState({isCorrect: null})
        // se compara el length de la phrase original con la creada si son iguales es por que se terminó
        if (currentPhrase.length == this.state.phrase.length) {
            this.setState({isCorrect: true})
            this.props.practiceScore.call(null, true)
            let phrase = this.state.phrase;
            // se verifica si son iguales de lo contrario el ejercicio está mal
            for (let i = 0; i < currentPhrase.length; i++) {
                if (currentPhrase[i].word != phrase[i]) {
                    this.setState({isCorrect: false})
                    this.props.practiceScore.call(null, false)
                    break;
                }
            }
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

        this.setState({currentPhrase: currentPhrase, unOrderedPhrase: unOrdered})
    }

    nullCorrect() {
        this.setState({isCorrect: null})
    }

    render() {
        return (
            <div className="col-xs-12 section-name">
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="image-drag-excercise">
                                <div className="complete-word-number-container">
                                    {this.props.exerciseIndex}
                                </div>
                                <div className="info-title-container">
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <div className="row order-word-practice-container">
                                                {this.state.unOrderedPhrase.map((phrase, index) => {
                                                    return <OrderWordBox word={phrase.word} isSet={phrase.isSet} index={index} wordSelected={this.wordSelected.bind(this)} key={index}/>
                                                })}
                                            </div>

                                            <div className="words-to-translate order-container">
                                                <OrderWordResult isCorrect={this.state.isCorrect} phrase={this.state.currentPhrase} nullCorrect={this.nullCorrect.bind(this)} undoWord={this.undoWord.bind(this)}/>
                                            </div>

                                            {(() => {
                                                if (this.state.isCorrect == false){
                                                  return <div className="col-xs-12 result-order-exercise" style={{
                                                      borderBottom: 0
                                                  }}>
                                                  <div className="row">

                                                      {this.state.phrase.map((word, index) => {
                                                          return (
                                                              <span key={index} className="select-word-order select-word-order-practice remove-option">{word}</span>
                                                          )
                                                      })}
                                                  </div>
                                                  </div>
                                                }
                                            })()}
                                        </div>
                                    </div>
                                </div>

                                {(() => {
                                    if (this.state.isCorrect == true){
                                      return <i className="material-icons check-class" style={{color: 'rgba(132, 218, 79, 0.8)'}}>done</i>
                                    }else if(this.state.isCorrect == false){
                                      return <i className="material-icons check-class" style={{color: 'rgba(255, 0, 0, 0.5)'}}>clear</i>
                                    }
                                })()}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default OrderWordContainer
