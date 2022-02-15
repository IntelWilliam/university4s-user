import React, { PropTypes, Component } from 'react';
import PhrasesActions from 'src/client/modules/Phrases/PhrasesActions'
import { DragSource } from 'react-dnd';
import Pronouncer from 'src/client/modules/Pronouncer/Pronouncer'
import { sentenceCase } from 'src/client/Util/Capitalize'

const boxSource = {
  beginDrag(props) {
    return {
      name: props.name,
      translation: props.translation
    };
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      props.showFailMessage.call(null)
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
      return;
    }
  }
};

@DragSource(props => props.type, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
class Box extends Component {

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    phraseId: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isDropped: PropTypes.bool.isRequired
  };

  render() {
    const { name, translation, isDropped, isDragging, connectDragSource } = this.props;
    const opacity = isDragging ? 0.4 : 1;
    let classOpacity = isDropped ? " text-to-say-opacity" : ""

    return connectDragSource(
      <div className={"col-xs-12" + classOpacity} style={{ opacity }}>
                <div className="row">
                    <div className="col-xs-12">
                      {(() => {
                        if(isDropped) {
                          return (
                              <div> <span className="text-to-say">{sentenceCase(name)}/</span> <span>{sentenceCase(translation)}</span></div>
                          )
                        } else {
                          return (
                             <div> <span className="text-to-say">{sentenceCase(name)}/</span> <span>{sentenceCase(translation)}</span></div>
                          )
                        }
                      })()}
                    </div>
                  <div className="col-xs-12">
                    <div className="" onClick={this.props.sayWordSpeed}>
                      <img style={{ float: "right", marginLeft: "5px", marginTop: "0.3em"}} src="/images/turtle.png" className="icon-comment mousePoint"/>
                    </div>
                    <div className="" onClick={this.props.sayWord}>
                      <img style={{ float: "right", marginLeft: "5px", marginTop: "0.3em"}} src="/images/sound.png" className="icon-comment mousePoint"/>
                    </div>
                  </div>
                </div>
            </div>
    );
  }
}

export default class StatefulSourceBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translation: "",
      errorMessage: "identifica-la-palabra"
    };

    // se manda el contexto a los metodos
    this.loadTranslation.bind(this)
  }

  loadTranslation() {
    // se obtiene la traducción de la phrase
    PhrasesActions.getPhraseTranslations(this.props.phraseId, { phrases: this.props.phraseId },
      (err, phraseTranslations) => {
        if (phraseTranslations[0]) {
          this.setState({
            translation: phraseTranslations[0].phrases.phrase
          })
        }
      })
  }

  sayWord() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.props.name)
  }

  showFailMessage() {
    this.props.showFailMessage.call(null, this.state.errorMessage)
  }

  sayWordSpeed() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.props.name, null, { rate: 0.5 })
  }

  // se ejecuta antes de de montar el componente
  componentWillMount() {
    // se cargan los datos
    this.loadTranslation()
  }

  render() {
    return (
      <Box {...this.props}
            translation={this.state.translation}
            showFailMessage={() => this.showFailMessage()}
            sayWord={() => this.sayWord()}
            sayWordSpeed={() => this.sayWordSpeed()}
            />
    );
  }
}
