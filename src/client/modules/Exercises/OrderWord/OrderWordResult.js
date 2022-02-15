import React from 'react'

class OrderWordResult extends React.Component {

  constructor(props) {
    super(props);
  }

    undoWord(unOrderedIndex, currentIndex) {
        this.props.undoWord.call(null, unOrderedIndex, currentIndex);
    }

  render() {
    return (
      <div className="result-order-exercise">
            {this.props.phrase.map((phrase, index) => {
                return (<div className="select-word-order remove-option" key={index}>
                            {phrase.word}
                            <span className="remove-order mousePoint" onClick={this.undoWord.bind(this, phrase.index, index)}>x</span>
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
    )
  }
}

export default OrderWordResult
