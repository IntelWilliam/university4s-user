import React from 'react'
import Pronouncer from 'src/client/modules/Pronouncer/Pronouncer'
import PhrasesActions from 'src/client/modules/Phrases/PhrasesActions'
import { sentenceCase, caseDescription } from 'src/client/Util/Capitalize'

class SimpleCommentItem extends React.Component {
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

    sayWord() {
        // se pronuncia la palabra deseada
        Pronouncer.sayWord(this.props.name.replace(/_/g, ' .'))
    }

    // se ejecuta antes de de montar el componente
    componentWillMount() {
      // console.log('SimpleComment');
        // se cargan los datos
        this.loadTranslation()
    }

    speakWord() {
        this.props.triggerListenChange.call(null, this.props.name, this.props.refComponent)
        this.props.changeListening.call(null, true)
    }

    sayWordSpeed() {
        // se pronuncia la palabra deseada
        Pronouncer.sayWord(this.props.name.replace(/_/g, ' .'), null, { rate: 0.5 })
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
                <div className="col-xs-4">
                    {(() => {
                        if (this.props.classCorrect == " correct-pronunciation") {
                            return (
                                <div className="row">
                                    <div className="col-xs-12 text-to-say-container">
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
                                        <div className="col-xs-12 text-to-say-container">
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
                                        <div className="col-xs-12 text-to-say-container">
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
                <div className="col-xs-8 text-to-say-container" style={{ justifyContent: 'flex-start' }}>
                    <div className="row">
                        <div className="col-xs-12"><span id="asHtml" className="text-to-say" dangerouslySetInnerHTML={{__html: sentenceCase(this.nl2br(this.props.name))}}></span></div>
                        {
                            (() => {
                                if (this.props.castell) {
                                    return (
                                        <div className="col-xs-12 blue-text"><span className="text-to-say">({sentenceCase(this.props.castell)})</span></div>


                                    )
                                }
                            })()
                        }
                        <div className="col-xs-12">{sentenceCase(this.state.translation)}</div>
                        {(() => {
                            if (this.props.classCorrect != " correct-pronunciation") {
                                return (
                                    <div className="col-xs-12 whatAmISaying">{sentenceCase(this.props.whatAmISaying)}</div>
                                )
                            }
                        })()}
                    </div>
                </div>
            </div>
        )
    }
}

export default SimpleCommentItem
