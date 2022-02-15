import React from 'react'
import Pronouncer from 'src/client/modules/Pronouncer/Pronouncer'
import Constants from 'src/client/Constants/Constants'
import { sentenceCase, caseDescription } from 'src/client/Util/Capitalize'

class ActionItem extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.name != nextProps.name ||
      this.props.author != nextProps.author ||
      this.props.cosmoCanSay != nextProps.cosmoCanSay) {
        console.log('nextProps.cosmoCanSay', nextProps.cosmoCanSay);
        if (nextProps.author == Constants.AUTHOR.COSMO && nextProps.cosmoCanSay) {
          this.cosmoSpeaks(nextProps.name)
        }
      }
    }

    cosmoSpeaks(phrase) {
      let phraseToSay = phrase? phrase: this.props.name
      Pronouncer.sayWord(phraseToSay.replace(/_/g,' .'), null, { onend: this.cosmoPhraseEnded.bind(this) })
    }

    cosmoPhraseEnded() {
      // console.log('cosmoPhraseEnded');
      this.props.changeCanSay.call(null)
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

    sendMessageButton() {

      // llamo la funcion que envía el mensaje
      let word = $('#input-message-2').val()
      console.log("word", word)
      // si la palabra es diferente de vacio
      if (word != '') {
        this.props.sendQuestion.call(null, word, this.props.refComponent)
        $('#input-message-2').val("")
        $('.emoji-wysiwyg-editor').empty();
        $('#input-message-2').focus()
      }
      
    }

    render() {
      let userImage
      if(localStorage.user){
        userImage = JSON.parse(localStorage.user).profileImg? JSON.parse(localStorage.user).profileImg : '/images/profile-img.png'
      }else{
        userImage = '/images/profile-img.png'
      }
      let justify = this.props.author == Constants.AUTHOR.COSMO ? ' me-Comment' : ''
      // let image = this.props.author == Constants.AUTHOR.COSMO ? '/images/cosmo.jpg' : userImage
      let image =  '/images/cosmo.jpg' 
      let backgroundColor = this.props.author == Constants.AUTHOR.COSMO ? 'cosmo-background' : 'me-background'
      return (
        <div className={'row' + justify }>
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
                        <span className={"cosmo-text-content"}>
                          {sentenceCase(this.props.name)}
                        </span>
                      </div>
                      {(() => {
                        if(this.props.author != Constants.AUTHOR.COSMO) {
                            return (
                                      <div className="container-mesagge-context">
                                        <div className="row">
                                          <div className="col-xs-9">
                                            <span className="input-chat-container ">
                                              <input
                                                id="input-message-2"
                                                data-emojiable="true"
                                                placeholder="Escribir mensaje"
                                                className="input-chat"
                                                type="text"
                                                // onKeyPress={this.sendMessage.bind(this)}
                                              />
                                              <div className="triangle-right">
                                                <div className="inner-triangle"></div>
                                              </div>
                                            </span>
                                          </div>
                                          <div className="col-xs-3" style={{ display: 'grid'}}>
                                            <button className="chat-button" onClick={this.sendMessageButton.bind(this)} title="Enviar mensaje"><i className="material-icons">send</i></button>
                                          </div>
                                        </div>
                                      </div>
                            )
                        }
                      })()}
                      {(() => {
                        if(this.props.whatAmISaying) {
                          return (
                            <div style={{ marginBottom: "1em"}} className="col-xs-12 whatAmISaying">{sentenceCase(this.props.whatAmISaying)}</div>
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

                    if(this.props.listening) {
                      return (
                        <div className="icons-cosmo-out">

                          <div className="icon-comment-container micro-active" onClick={this.speakWord.bind(this)}>
                            <img src="/images/microactive.png" className="icon-comment mousePoint"/>
                          </div>
                        </div>
                      )
                    } else {
                      return (
                        <div className="icons-cosmo-out">

                          <div className="icon-comment-container" onClick={this.speakWord.bind(this)}>
                            <img src="/images/micro.png" className="icon-comment mousePoint"/>
                          </div>
                        </div>
                      )
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
