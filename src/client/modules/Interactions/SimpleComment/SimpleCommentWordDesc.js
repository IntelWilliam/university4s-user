import React from 'react'
import Pronouncer from 'src/client/modules/Pronouncer/Pronouncer'
import PhrasesActions from 'src/client/modules/Phrases/PhrasesActions'
import { sentenceCase, caseDescription } from 'src/client/Util/Capitalize'

class SimpleCommentWordDesc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      translation: ""
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

    concatWordDescription(){
      let temp = this.props.wordDesc;

      let wordToSay = ''

      for (var index = 0; index < temp.length; index++) {
        wordToSay = wordToSay.concat(temp[index].name + '.\n ' + temp[index].description + '.\n ' )
      }

      return wordToSay
    }

    sayWord() {
      // se pronuncia la palabra deseada
      Pronouncer.sayWord(this.concatWordDescription())
    }

    // se ejecuta antes de de montar el componente
    componentWillMount() {
      // se cargan los datos
      this.loadTranslation()
    }

    speakWord() {
      this.props.triggerListenChange.call(null, this.props.name, this.props.refComponent)
      this.props.changeListening.call(null, true)
    }

    sayWordSpeed() {
      // se pronuncia la palabra deseada
      Pronouncer.sayWord(this.concatWordDescription(), null, { rate: 0.5 })
    }

    nl2br(str) {
      const breakTag = '<br/>'; // Adjust comment to avoid issue on phpjs.org display

      return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
    }

    render() {

      return (
        <div className={'row' + this.props.classCorrect}>
          <div className="col-xs-12" style={{ marginBottom: "1em" }}>
            {caseDescription(this.props.description)}
          </div>

          <div className="col-xs-12 text-to-say-container" style={{ justifyContent: 'flex-start' }}>

            <div className="row">
              <div className="col-xs-12" style={{ display: 'flex', flexDirection: 'row' }}>

                {this.props.wordDesc.map((wordD, index) => {
                  return (

                    <div key={index} className="" style={{ marginRight: '1em' }}>
                      <p className="text-to-say" style={{textAlign: 'center'}}>{wordD.name}</p>
                      <p className="">{wordD.description}</p>
                    </div>
                  )
                })}

              </div>


              {
                (() => {
                  if (this.props.castell) {
                    return (
                      <div className="col-xs-12 blue-text"><span className="text-to-say">({sentenceCase(this.props.castell)})</span></div>


                    )
                  }
                })()
              }
              {(() => {
                if (this.state.translation) {
                  return (
                    <div className="col-xs-12">{sentenceCase(this.state.translation)}</div>)
                  }
                })()}
                {(() => {
                  if (this.props.classCorrect != " correct-pronunciation") {
                    return (
                      <div className="col-xs-12 whatAmISaying">{this.props.whatAmISaying}</div>
                    )
                  }
                })()}
              </div>
            </div>



            <div className="col-xs-12" >
              {(() => {
                if (this.props.classCorrect == " correct-pronunciation") {
                  return (
                    <div className="row">
                      <div className="col-xs-12 text-to-say-container" style={{ justifyContent: 'flex-start' }}>
                        <div className="icon-comment-container" onClick={this.sayWord.bind(this)}>
                          <img src="/images/sound.png" className="icon-comment mousePoint" />
                        </div>
                        <div className="icon-comment-container" onClick={this.sayWordSpeed.bind(this)}>
                          <img src="/images/turtle.png" className="icon-comment mousePoint" />
                        </div>
                        <div className="icon-comment-container">
                          <img src="/images/check.png" className="icon-comment mousePoint" />
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  if (this.props.listening) {
                    return (
                      <div className="row">
                        <div className="col-xs-12 text-to-say-container" style={{ justifyContent: 'flex-start' }}>
                          <div className="icon-comment-container" onClick={this.sayWord.bind(this)}>
                            <img src="/images/sound.png" className="icon-comment mousePoint" />
                          </div>
                          <div className="icon-comment-container" onClick={this.sayWordSpeed.bind(this)}>
                            <img src="/images/turtle.png" className="icon-comment mousePoint" />
                          </div>
                          <div className="icon-comment-container micro-active" onClick={this.speakWord.bind(this)}>
                            <img src="/images/microactive.png" className="icon-comment mousePoint" />
                          </div>
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div className="row">
                        <div className="col-xs-12 text-to-say-container" style={{ justifyContent: 'flex-start' }}>
                          <div className="icon-comment-container" onClick={this.sayWord.bind(this)}>
                            <img src="/images/sound.png" className="icon-comment mousePoint" />
                          </div>
                          <div className="icon-comment-container" onClick={this.sayWordSpeed.bind(this)}>
                            <img src="/images/turtle.png" className="icon-comment mousePoint" />
                          </div>
                          <div className="icon-comment-container" onClick={this.speakWord.bind(this)}>
                            <img src="/images/micro.png" className="icon-comment mousePoint" />
                          </div>
                        </div>
                      </div>
                    )
                  }
                }
              })()}
            </div>

          </div>
        )
      }
    }

    export default SimpleCommentWordDesc
