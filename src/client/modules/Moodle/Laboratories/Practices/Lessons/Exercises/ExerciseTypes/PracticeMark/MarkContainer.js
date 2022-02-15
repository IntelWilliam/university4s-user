import React from 'react'
import {shuffle} from 'src/client/Util/Randomize'
import update from 'react/lib/update';

class MarkContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            correct: null
        };
    }

    userAnswer(id) {
        this.setState({selected: id, correct: null})
    }

    checkAnswer() {
        let temp = parseInt(this.props.exercise.answer_index) - 1
        if (this.state.selected == temp) {
            this.setState({correct: true})
            this.props.practiceScore.call(null)
        } else {
            this.setState({correct: false})
        }
    }

    render() {
        let tempArr = this.props.exercise.answers
        let arr = Object.keys(tempArr).map(function(key) {
            return tempArr[key]
        });

        let styleSelec = {
            background: '#008BFF',
            color: 'white'
        };

        let styleWrong = {
            background: 'rgba(255,0,0,0.5)',
            color: 'white',
            border: 'solid 1px rgba(255,0,0,0.5)'
        };

        // let class1 = this.state.selected == 1 ? "mark-word mousePoint "

        return (
            <div className="col-xs-12 section-name">
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="image-drag-excercise">
                                <div className="complete-word-number-container">
                                    {this.props.index + 1}
                                </div>
                                <div className="info-title-container">
                                    <div className="row">
                                        <div className="col-xs-12">
                                            <div className="row">
                                                <div className="col-xs-12">
                                                    <span className="right-translation-phrase">
                                                        {this.props.exercise.question.replace(/&#157;/g," ")}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="words-to-translate">
                                                <div className="row">

                                                    {arr.map((answer, index) => {
                                                        let style = this.state.selected == index
                                                            ? styleSelec
                                                            : null
                                                        if (this.state.correct == false && this.props.exercise.answer_index == index + 1)
                                                            style = styleWrong
                                                        return (
                                                            <span key={index} className="mark-word mousePoint" style={style} onClick={this.userAnswer.bind(this, index)}>{answer}</span>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {(() => {
                                    if (this.state.correct == true){
                                      return <i className="material-icons check-class" style={{color: 'rgba(132, 218, 79, 0.8)'}}>done</i>
                                    }else if(this.state.correct == false){
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

export default MarkContainer
