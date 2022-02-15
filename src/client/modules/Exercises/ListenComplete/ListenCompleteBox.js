import React from 'react'

class ListenCompleteBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      word: this.props.word,
      value: "",
      isHidden: this.props.isHidden,
      isOk: false
    };
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    this.props.wordChanged.call(null, event.target.value.toLowerCase(), this.props.index)
  }


  onlyLetters(event) {
    var regex = new RegExp("^[ña-zA-Z?¿!¡.,]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  }

  render() {
    let style = this.state.isOk ? 'show-green input-complete' : 'show-red input-complete'
    let classPrent = this.state.isHidden ? 'input-complete-container' : ''
    return (
      <div className={classPrent}>
                {(() => {
                    if(this.state.isHidden) {
                        return (
                            <input type="text" className={style} value={this.state.value}
                                   onKeyPress={this.onlyLetters}
                                   onChange={this.handleChange.bind(this)} />
                        )
                    } else {
                        return (
                            <div className='select-word-order'>
                                {this.state.word}
                            </div>
                        )
                    }
                })()}
            </div>
    )
  }

}

export default ListenCompleteBox
