import React from 'react'
import Pronouncer from 'src/client/modules/Pronouncer/Pronouncer'
import PhrasesActions from 'src/client/modules/Phrases/PhrasesActions'
import { removeDiacritics } from 'src/client/Util/DiacriticsRemoval'
import TranslateInput from 'src/client/modules/Exercises/Translate/TranslateInput'
import { sentenceCase, caseDescription } from 'src/client/Util/Capitalize'


class TranslateContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      exercise: this.props.exercise,
      phrase: this.props.exercise.phrase,
      castell: this.props.exercise.castell,
      isPhraseOk: false,
      translations: [],
      errorMessage: "traduccion-correcta"
    };
  }

  // se ejecuta antes de de montar el componente
  componentWillMount() {
    this.loadTranslations();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.exercise._id != this.props.exercise._id) {
      this.setState({
        exercise: nextProps.exercise,
        phrase: nextProps.exercise.phrase,
        isPhraseOk: false
      }, (() => {
        this.loadTranslations();
      }).bind(this));
    }
  }

  loadTranslations() {
    // se obtiene la traducción de la phrase
    PhrasesActions.getPhraseTranslations(this.state.exercise.phraseId, { phrases: this.state.exercise.phraseId },
      (err, phraseTranslations) => {
        if (phraseTranslations.length > 0) {
          let translations = phraseTranslations.map((translations) => {
            return removeDiacritics(translations.phrases.phrase)
              .replace(/([^ña-zA-z]+)/gi, '');
          })
          this.setState({
            translations: translations
          })
        } else {
        }
      })
  }

  sayWord() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.state.phrase)
  }

  sayWordSpeed() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.state.exercise.phrase, null, { rate: 0.5 })
  }

  checkIfFinished(phrase) {
    console.log('this.state.translations', this.state.translations);
    let phraseWithoutAccents = removeDiacritics(phrase).replace(/([^ña-zA-Z]+)/gi, '');
    let hasPhrase = this.state.translations.filter((translation) => {
      console.log('translation', translation);
      console.log('phraseWithoutAccents', phraseWithoutAccents);
      return translation.toLowerCase() == phraseWithoutAccents.toLowerCase();
    })

    if (hasPhrase.length > 0) {
      this.setState({
        isPhraseOk: true
      })
      this.refs.input.restartValue();
      this.props.loadNext.call(null);
    } else {
      this.props.showFailMessage.call(null, this.state.errorMessage);
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-12">
            {caseDescription(this.props.exercise.description)}
        </div>
        <div className="col-xs-12">
          <div className="order-word-container">
            <div className="row">
              <div className="col-xs-12">
                <span className="right-translation-phrase">
                  {sentenceCase(this.state.phrase)}
                </span>
                {
                    (() => {
                        if (this.state.castell) {
                            return (
                              <span>
                                <span className="right-translation-phrase">&nbsp; - &nbsp;</span>
                                <span className="right-translation-phrase blue-text">({sentenceCase(this.state.castell)})</span>
                              </span>
                            )
                        }
                    })()
                }

              </div>
            </div>
            <div className="words-to-translate">
                <TranslateInput ref="input" isOk={this.state.isPhraseOk} checkIfFinished={this.checkIfFinished.bind(this)}/>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <div className="" onClick={this.sayWordSpeed.bind(this)}>
                    <img style={{ float: "right", marginLeft: "5px", marginTop: "0.3em"}} src="/images/turtle.png" className="icon-comment mousePoint"/>
                </div>
                <div className="" onClick={this.sayWord.bind(this)}>
                  <img style={{ float: "right", marginLeft: "5px", marginTop: "0.3em"}} src="/images/sound.png" className="icon-comment mousePoint"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TranslateContainer
