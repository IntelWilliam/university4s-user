import React from 'react'

class OrderWordResult extends React.Component {

  constructor(props) {
    super(props);
  }

    undoWord(unOrderedIndex, currentIndex) {
      this.props.nullCorrect.call();
      this.props.undoWord.call(null, unOrderedIndex, currentIndex);
    }

  render() {
    let orderClass = this.props.isCorrect == false
        ? "select-word-order select-word-order-practice remove-option wrong-Order"
        : (this.props.isCorrect == true
            ? "select-word-order select-word-order-practice remove-option"
            : "select-word-order select-word-order-practice remove-option")

    let resultClass = this.props.isCorrect == true
        ? "col-xs-12 result-order-exercise correct-Order"
        : "col-xs-12 result-order-exercise"


    return (
      <div className={resultClass}>
        <div className="row">

            {this.props.phrase.map((phrase, index) => {
                return (<div style={{cursor:'pointer'}} className={orderClass} key={index} onClick={this.undoWord.bind(this, phrase.index, index)}>
                            {phrase.word}
                            <span className="remove-order" >x</span>
                        </div>)
            })}
            {(() => {
                if(this.props.phrase.length == 0) {
                  return (
                      <p className="order-word-place">Ordena las palabras</p>
                  )
                }
            })()}

          </div>
        </div>
    )
  }
}

export default OrderWordResult
