import React from 'react'

class TranslateInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            word: this.props.word,
            value: "",
            isOk: this.props.isOk
        };
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit() {
        this.props.checkIfFinished.call(null, this.state.value.toLowerCase())
    }

    onlyLetters(event) {
        var regex = new RegExp("^[ña-zA-Z?¿!¡., ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    }

    restartValue() {
        this.setState({
            value:""
        })
    }
    
    render() {
        let style = this.state.isOk ? 'show-green translate-input':'show-red translate-input'
        return (
            <div className="row">
                <div className="col-xs-12 col-md-10">
                    <input type="text" className={style} placeholder="Escribe una traducción correcta"
                           value={this.state.value}
                                   onKeyPress={this.onlyLetters}
                                   onChange={this.handleChange.bind(this)} />
                </div>
                <div className="col-xs-12 col-md-2">
                    <button className="translate-check mousePoint" onClick={this.handleSubmit.bind(this)}>Enviar</button>
                </div>
            </div>
        )
    }
}

export default TranslateInput
