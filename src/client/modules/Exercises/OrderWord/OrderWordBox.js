import React from 'react'

class OrderWordBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            word: this.props.word
        };
    }

    setWord() {
        this.props.wordSelected.call(null, this.state.word, this.props.index)
    }

    render() {
        let isSetStyle = this.props.isSet ? 'select-word-order opacity-regular': 'select-word-order mousePoint'
        return (
            <div className={isSetStyle} onClick={this.setWord.bind(this)}>
                {this.state.word}
            </div>
        )
    }
}

export default OrderWordBox
