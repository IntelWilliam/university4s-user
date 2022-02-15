import React from 'react'
import Pronouncer from 'src/client/modules/Pronouncer/Pronouncer'
import Constants from 'src/client/Constants/Constants'
import { sentenceCase, caseDescription } from 'src/client/Util/Capitalize'

class ActionItem extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // si el autor es cosmo se pronuncia automaticamente
    if (this.props.author == Constants.AUTHOR.COSMO && this.props.shouldSpeak) {
      this.cosmoSpeaks()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.phraseId != nextProps.phraseId ||
        this.props.name != nextProps.name ||
        this.props.author != nextProps.author) {

      if (nextProps.shouldSpeak && nextProps.author == Constants.AUTHOR.COSMO) {
        this.cosmoSpeaks(nextProps.name)
      }
      // se valida si cambio el estado de canSayNext la cual indica que ya se hizo la frase anterior
      // de igual manera si el autor es cosmo, y si anteriormente habia una frase en progreso
      // y ya terminó para poder ejecutar una frase por cosmo
    } else if (this.props.canSayNext == false && nextProps.canSayNext == true && nextProps.author == Constants.AUTHOR.COSMO && this.props.phraseInProgress == true && nextProps.phraseInProgress == false && !this.props.shouldSpeak) {
      this.cosmoSpeaks(nextProps.name)
    }
  }

  cosmoSpeaks(phrase) {
    let phraseToSay = phrase || this.props.name
    Pronouncer.sayWord(phraseToSay.replace(/_/g,' .'), null, { onend: this.cosmoPhraseEnded.bind(this) })
  }

  cosmoPhraseEnded() {
    this.props.listenWord.call(null, true, true)
  }

  sayWord() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.props.name.replace(/_/g,' .'))
  }

  sayWordSpeed() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.props.name.replace(/_/g,' .'), null, { rate: 0.5 })
  }

  speakWord() {
    this.props.triggerListenChange.call(null, this.props.name, this.props.refComponent)
    this.props.changeListening.call(null, true)
  }

  render() {
    let userImage
    if(localStorage.user){
      userImage = JSON.parse(localStorage.user).profileImg? JSON.parse(localStorage.user).profileImg : '/images/profile-img.png'
    }else{
      userImage = '/images/profile-img.png'
    }

    let justify = this.props.author != Constants.AUTHOR.COSMO ? ' me-Comment' : ''
    let image = this.props.author == Constants.AUTHOR.COSMO ? '/images/cosmo.jpg' : userImage
    let backgroundColor = this.props.author == Constants.AUTHOR.COSMO ? 'cosmo-background' : 'me-background'
    return (
      <div className={'row' + justify + this.props.classCorrect}>
        <div className="col-xs-12 col-md-6">
            <div className="row">
                <div className="col-xs-12" style={{ marginBottom: "1em"}}>
                  {caseDescription(this.props.description)}
                </div>
                <div className="col-xs-12">
                    <div className={"acction-container " + backgroundColor}>
                        <div className="cosmo-image-container">
                            <img src={image} className="cosmo-image"/>
                        </div>
                        <div className="cosmo-text">
                            <div className="row">
                                <div className="col-xs-12 cosmo-text-title-container">
                                    {(() => {
                                        if(this.props.author == Constants.AUTHOR.COSMO) {
                                            return (
                                                <span className="cosmo-text-title">
                                                    Cosmo:
                                                </span>
                                            )
                                        } else {
                                            return (
                                                <span className="cosmo-text-title">
                                                    Me:
                                                </span>
                                            )
                                        }
                                    })()}
                                </div>
                                <div className="col-xs-12">
                                    <span className={"cosmo-text-content"+ this.props.classCorrect}>
                                        {sentenceCase(this.props.name)}
                                    </span>
                                    {
                                        (() => {
                                            if (this.props.castell ) {
                                                return (
                                                  <span>
                                                    <span className={"cosmo-text-content"+ this.props.classCorrect}>
                                                          &nbsp; - &nbsp;
                                                    </span>
                                                    <span className={"cosmo-text-content blue-text"+ this.props.classCorrect}>
                                                      ({sentenceCase(this.props.castell)})
                                                    </span>
                                                  </span>

                                                )
                                            }
                                        })()
                                    }
                                </div>
                                {(() => {
                                    if(this.props.classCorrect != " correct-pronunciation") {
                                        return (
                                            <div className="col-xs-12 whatAmISaying">{sentenceCase(this.props.whatAmISaying)}</div>
                                        )
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                                                {(() => {
                                if(this.props.author == Constants.AUTHOR.COSMO) {
                                    return (
                                        <div className="icons-cosmo-out">
                                            <div className="icon-comment-container" onClick={this.sayWord.bind(this)}>
                                                <img src="/images/sound.png" className="icon-comment mousePoint"/>
                                            </div>
                                            <div className="icon-comment-container" onClick={this.sayWordSpeed.bind(this)}>
                                                <img src="/images/turtle.png" className="icon-comment mousePoint"/>
                                            </div>
                                        </div>
                                    )
                                } else {
                                    if(this.props.classCorrect == " correct-pronunciation") {
                                        return (
                                            <div className="icons-cosmo-out">
                                                <div className="icon-comment-container" onClick={this.sayWord.bind(this)}>
                                                    <img src="/images/sound.png" className="icon-comment mousePoint"/>
                                                </div>
                                                <div className="icon-comment-container" onClick={this.sayWordSpeed.bind(this)}>
                                                    <img src="/images/turtle.png" className="icon-comment mousePoint"/>
                                                </div>
                                                <div className="icon-comment-container">
                                                    <img src="/images/check.png" className="icon-comment mousePoint"/>
                                                </div>
                                            </div>
                                        )
                                    } else if(this.props.classCorrect != " correct-pronunciation") {
                                        if(this.props.listening) {
                                            return (
                                                <div className="icons-cosmo-out">
                                                    <div className="icon-comment-container" onClick={this.sayWord.bind(this)}>
                                                        <img src="/images/sound.png" className="icon-comment mousePoint"/>
                                                    </div>
                                                    <div className="icon-comment-container" onClick={this.sayWordSpeed.bind(this)}>
                                                        <img src="/images/turtle.png" className="icon-comment mousePoint"/>
                                                    </div>
                                                    <div className="icon-comment-container micro-active" onClick={this.speakWord.bind(this)}>
                                                        <img src="/images/microactive.png" className="icon-comment mousePoint"/>
                                                    </div>
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div className="icons-cosmo-out">
                                                    <div className="icon-comment-container" onClick={this.sayWord.bind(this)}>
                                                        <img src="/images/sound.png" className="icon-comment mousePoint"/>
                                                    </div>
                                                    <div className="icon-comment-container" onClick={this.sayWordSpeed.bind(this)}>
                                                        <img src="/images/turtle.png" className="icon-comment mousePoint"/>
                                                    </div>
                                                    <div className="icon-comment-container" onClick={this.speakWord.bind(this)}>
                                                        <img src="/images/micro.png" className="icon-comment mousePoint"/>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    }
                                }
                            })()}
                </div>
            </div>
        </div>
    </div>
    )
  }
}

export default ActionItem
