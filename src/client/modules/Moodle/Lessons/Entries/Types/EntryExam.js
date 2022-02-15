import React from 'react'
import Constants from 'src/client/Constants/Constants'

export default class EntryExam extends React.Component {
    constructor() {
        super()
        this.state = {
            allAnswers: [],
            selected: null,
            correct: null,
            isRight: null,
            showCongratulate: '',
            currentCongratulate: "very-good",
            congratulateWords: ["very-good", "well-done", "excellent-job", "congratulations", "you-could-do-it"]

        }
    }

    componentWillMount() {
        let temp
        let tempArr = this.props.entry.examId.answers
        let arr = Object.keys(tempArr).map(function(key) {
            if (tempArr[key].isRight) {
                temp = key;
            }
            return tempArr[key]
        })
        this.setState({allAnswers: arr, isRight: temp})

    }

    userAnswer(id) {
        this.setState({selected: id, correct: null})
    }

    checkAnswer() {
        if (this.state.isRight == this.state.selected) {
            this.setState({correct: true})
            this.toCongratulate()

        } else {
            this.setState({correct: false})
            this.toError()
        }
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
                                                <span className="info-description">La pregunta tiene x alternativas de las cuales podrá elegir solo una como respuesta.</span>
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
                                                            let style = this.state.selected == index
                                                                ? styleSelec
                                                                : null
                                                            if (this.state.correct == false && this.state.isRight == index) {
                                                                style = styleWrong
                                                            }
                                                              return (
                                                                <span key={index} className="mark-word mousePoint" style={style} onClick={this.userAnswer.bind(this, index)}>{answer.answer}</span>
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

EntryExam.contextTypes = {
    router: React.PropTypes.object
}
