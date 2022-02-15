import React from 'react'
import Constants from 'src/client/Constants/Constants'
import Footer from 'src/client/modules/layout/footer'
import HeaderPage from 'src/client/modules/Moodle/HeaderPage'

export default class EntryExamMultiple extends React.Component {
    constructor() {
        super()
        this.state = {
            allAnswers: [],
            selected: [],
            correct: [],
            checked: false,
            isRight: null,
            showCongratulate: '',
            currentCongratulate: "very-good",
            congratulateWords: ["very-good", "well-done", "excellent-job", "congratulations", "you-could-do-it"]
        }
    }

    componentWillMount() {
        let temp = []
        let tempArr = this.props.entry.examId.answers
        let arr = Object.keys(tempArr).map(function(key) {
          temp.push(tempArr[key].isRight);
            return tempArr[key]
        })
        // se guardan las respuestas y las correctas
        this.setState({allAnswers: arr, isRight: temp})
    }

    userAnswer(id, isRight) {

      // si ya se a dado corregir se borran las respuestas anteriores
      let selected = this.state.checked? [] : this.state.selected
      let correct = this.state.checked? [] : this.state.correct

      //seleccionada o no
      selected[id] = selected[id]? false : true;

      // se verifica si la seleccionada es correcta
      if(selected[id] == isRight){
        correct[id] = true;
      }else{
        correct[id] = false;
      }
        this.setState({selected: selected, correct: correct, checked: false})
    }

    checkAnswer() {
      this.setState({checked: true})

      //se verifican las respuestas.
      for (let value of this.state.correct) {
            if (value == false || this.state.correct[value] != this.state.isRight[value]){
              this.setState({correct: [], checked: true})
              this.toError()
              //si hay una mala se muestra el mensaje de error y se sale.
              return
            }
          }
    this.toCongratulate()
    }

    hideCongratulate() {
        this.setState({showCongratulate: ""})
    }

    hideError() {
        this.setState({showError: ""})
    }

    toError() {
        this.setState({showError: "show-congratulate", showCongratulate: ""})
        setTimeout(this.hideError.bind(this, null), 3000);
    }

    toCongratulate() {
        let currentCongratulate = this.state.congratulateWords[Math.floor(Math.random() * this.state.congratulateWords.length)];
        this.setState({currentCongratulate: currentCongratulate, showCongratulate: "show-congratulate", showError: ""})
        setTimeout(this.hideCongratulate.bind(this, null), 3000);
    }

    render() {
        let styleSelec = {
            background: '#008BFF',
            color: 'white'
        };

        let styleWrong = {
            background: 'rgba(255,0,0,0.5)',
            color: 'white',
            border: 'solid 1px rgba(255,0,0,0.5)'
        };

        return (
            <div className="col-xs-12">
                <div className="col-xs-12 section-name">
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="exercise-border">
                                    <span>&nbsp;</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-xs-12 col-md">
                                <div className="image-drag-excercise">
                                    <div className="pdf-icon-container">
                                        <img className="pdf-icon" src="/images/clock.png"/>
                                    </div>
                                    <div className="info-title-container">
                                        <div className="row">
                                            <div className="col-xs-12">
                                                <span className="info-title">Pregunta con unica respuesta</span>
                                            </div>
                                            <div className="col-xs-12">
                                                <span className="info-description">La pregunta tiene x alternativas de las cuales deberá elegir las correctas.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="exercise-border-dotted">
                                    <span>&nbsp;</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xs-12 section-name">
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="image-drag-excercise">
                                    <div className="info-title-container">
                                        <div className="row">
                                            <div className="col-xs-12">
                                                <div className="row">
                                                    <div className="col-xs-12">
                                                        <span className="right-translation-phrase">
                                                            {this.props.entry.examId.question}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="words-to-translate">
                                                    <div className="row">

                                                        {this.state.allAnswers.map((answer, index) => {
                                                            let style = this.state.selected[index] ? styleSelec  : null
                                                            if (this.state.checked && (this.state.correct[index] != true && answer.isRight)) {
                                                                style = styleWrong
                                                            }
                                                              return (
                                                                <span key={index} className="mark-word mousePoint" style={style} onClick={this.userAnswer.bind(this, index, answer.isRight)}>{answer.answer}</span>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xs-12 section-name">
                    <div className="col-xs-12">
                        <div className="row">
                            <div className="col-xs-12 action-container">
                                <button className="next-button mousePoint" onClick={this.checkAnswer.bind(this)}>Evaluar</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={"to-congratulate " + this.state.showCongratulate}>
                    <div className="col-xs-12 congrat-image">
                        <img className="to-congratulate-img" src={"/images/" + this.state.currentCongratulate + ".png"}/>
                    </div>
                </div>
                <div className={"to-congratulate " + this.state.showError}>
                    <div className="col-xs-12 congrat-image">
                        <img className="to-congratulate-img" src={"/images/identifica-la-palabra.png"}/>
                    </div>
                </div>

            </div>
        )
    }
}

EntryExamMultiple.contextTypes = {
    router: React.PropTypes.object
}
