import React from 'react'
import {shuffle} from 'src/client/Util/Randomize'
import update from 'react/lib/update';

class ExamContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            correct: null
        };
    }

    userAnswer(id) {
      if(this.props.canEdit)
        this.setState({selected: id, correct: null})
    }

    checkAnswer() {
        let temp = parseInt(this.props.item.answer_index) - 1
        if (this.state.selected == temp) {
            this.setState({correct: true})
            this.props.examScore.call(null);
        } else {
            this.setState({correct: false})
        }
    }

    render() {
        let tempArr = this.props.item.answers
        let arr = Object.keys(tempArr).map(function(key) {
            return tempArr[key]
        });

        let styleSelec = {
            background: 'rgb(0, 139, 255)',
            color: 'white'
        };

        let styleWrong = {
            background: 'rgba(255,0,0,0.5)',
            color: 'white',
            border: 'solid 1px rgba(255,0,0,0.5)'
        };

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
                                                        {this.props.item.question}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="words-to-translate">
                                                <div className="row">

                                                    {arr.map((answer, index) => {
                                                        let style = this.state.selected == index
                                                            ? styleSelec
                                                            : null
                                                        if (this.state.correct == false && this.props.item.answer_index == index + 1)
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ExamContainer
