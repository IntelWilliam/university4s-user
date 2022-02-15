import React from 'react'

class TranslationWordBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            phrase: this.props.phrase,
            wasSelected: false
        };
    }

    setWord() {
        // si no es correcta se cambia el estado para cambiar el estilo
        if(!this.state.phrase.isRight) {
            this.setState({
                wasSelected: true
            })
        }
        this.props.wordSelected.call(null, this.props.index)
    }

    render() {
        let isSetStyle = this.state.wasSelected ? 'translation-to-select opacity-regular': 'translation-to-select'
        return (
            <div className={isSetStyle} onClick={this.setWord.bind(this)}>
                {this.state.phrase}
            </div>
        )
    }
}

export default TranslationWordBox
