import React from 'react';
import { shuffle } from 'src/client/Util/Randomize';
import PhrasesActions from 'src/client/modules/Phrases/PhrasesActions';
import TranslationWordBox from 'src/client/modules/Exercises/RightTranslation/TranslationWordBox';
import Pronouncer from 'src/client/modules/Pronouncer/Pronouncer';
import { caseDescription } from 'src/client/Util/Capitalize';

class RightTranslationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise: this.props.exercise,
      phrase: this.props.exercise.phrase,
      fakeTranslations: this.props.exercise.fakeTranslations,
      translation: '',
      translations: [],
      errorMessage: 'vuelve-intentarlo',
    };
  }

  // se ejecuta antes de de montar el componente
  componentWillMount() {
    this.loadTranslation();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.exercise._id != this.props.exercise._id) {
      this.setState(
        {
          exercise: nextProps.exercise,
          phrase: nextProps.exercise.phrase,
          fakeTranslations: nextProps.exercise.fakeTranslations,
          translations: [],
        },
        (() => {
          this.loadTranslation();
        }).bind(this)
      );
    }
  }

  loadTranslation() {
    console.log('loadTranslation');
    // se obtiene la traducción de la phrase
    PhrasesActions.getPhraseTranslations(
      this.state.exercise.phraseId,
      { phrases: this.state.exercise.phraseId },
      (err, phraseTranslations) => {
        console.log('phraseTranslations', phraseTranslations);
        if (phraseTranslations[0]) {
          this.setState({
            translation: phraseTranslations[0].phrases.phrase,
          });
          let realTranslation = {
            isRight: true,
            phrase: phraseTranslations[0].phrases.phrase,
          };
          this.setFakeAndRealTranslations(realTranslation);
        }
      }
    );
  }

  /**
   * metodo encargado de mezclar las traducciones incorrectas con la correcta en un arreglo
   * @param realTranslation
   */
  setFakeAndRealTranslations(realTranslation) {
    let translations = [];

    this.state.fakeTranslations.forEach((translation) => {
      translations.push({
        isRight: false,
        phrase: translation,
      });
    });
    translations.push(realTranslation);
    translations = shuffle(translations);
    this.setState({
      translations: translations,
    });
  }

  // metodo que verifica si la palabra seleccionada es la correcta para cambiar al siguiente ejercicio
  wordSelected(index) {
    let phrase = this.state.translations[index];

    if (phrase.isRight) {
      this.props.loadNext.call(null);
    } else {
      this.props.showFailMessage.call(null, this.state.errorMessage);
    }
  }

  sayWord() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.state.translation);
  }

  sayWordSpeed() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.state.translation, null, { rate: 0.5 });
  }

  render() {
    return (
      <div className='row'>
        <div className='col-xs-12'>
          {caseDescription(this.props.exercise.description)}
        </div>
        <div className='col-xs-12'>
          <div className='order-word-container'>
            <div className='row'>
              <div className='col-xs-12'>
                <span className='right-translation-phrase'>
                  {this.state.phrase}
                </span>
              </div>
            </div>
            <div className='words-to-complete'>
              {this.state.translations.map((translation, index) => {
                return (
                  <TranslationWordBox
                    phrase={translation.phrase}
                    wordSelected={this.wordSelected.bind(this)}
                    isRight={translation.isRight}
                    index={index}
                    key={index}
                  />
                );
              })}
            </div>
            <div className='row'>
              <div className='col-xs-12'>
                <div className='' onClick={this.sayWordSpeed.bind(this)}>
                  <img
                    style={{
                      float: 'right',
                      marginLeft: '5px',
                      marginTop: '0.3em',
                    }}
                    src='/images/turtle.png'
                    className='icon-comment mousePoint'
                  />
                </div>
                <div className='' onClick={this.sayWord.bind(this)}>
                  <img
                    style={{
                      float: 'right',
                      marginLeft: '5px',
                      marginTop: '0.3em',
                    }}
                    src='/images/sound.png'
                    className='icon-comment mousePoint'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RightTranslationContainer;
