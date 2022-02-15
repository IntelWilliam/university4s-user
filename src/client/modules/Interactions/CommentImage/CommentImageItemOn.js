import React from 'react'
import Pronouncer from 'src/client/modules/Pronouncer/Pronouncer'
import { sentenceCase } from 'src/client/Util/Capitalize'

class CommentImageItemOn extends React.Component {

  // se ejecuta antes de de montar el componente
  componentWillMount() {
    // se cargan los datos
  }

  sayWord() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.props.name.replace(/_/g,' .'))
  }

  speakWord() {
    this.props.triggerListenChange.call(null, this.props.name, this.props.refComponent)
    this.props.changeListening.call(null, true)
  }

  sayWordSpeed() {
    // se pronuncia la palabra deseada
    Pronouncer.sayWord(this.props.name.replace(/_/g,' .'), null, { rate: 0.5 })
  }

  render() {
    return (
      <div className={this.props.classCorrect}>
        <div className="image-container-comment" style={{margin: '0 auto'}} onMouseLeave={this.props.mouseLeave}>
          <img className="image-interaction-comment" src={this.props.imageUrl} />
          {(() => {
            if(this.props.classCorrect == " correct-pronunciation") {
              return (
                <div className="enter-comment">
                  <div className="icon-comment-container">
                    <img src="/images/check.png" className="icon-comment"/>
                  </div>
                </div>
              )
            } else {
              if(this.props.listening){
                return (
                  <div className="enter-comment">
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
                  <div className="enter-comment">
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
          })()}
        </div>
        {(() => {
          if(this.props.classCorrect != " correct-pronunciation") {
            return (
              <div className="margin-top-container text-to-say-container">
                <div className="row image-drag">
                  <div className="col-xs-12 text-to-say-container">
                    <span className="text-to-say">{sentenceCase(this.props.name)}</span>
                    <span className="text-to-say">/&nbsp;{sentenceCase(this.props.translation)}</span>
                  </div>
                  {
                    (() => {
                      if (this.props.castell) {
                        return (
                          <div className="col-xs-12 text-to-say-container">
                            <span className="text-to-say blue-text">({sentenceCase(this.props.castell)})</span>
                          </div>

                        )
                      }
                    })()
                  }

                  <div className="col-xs-12 text-to-say-container">
                    <span className="whatAmISaying">{sentenceCase(this.props.whatAmISaying)}</span>
                  </div>
                </div>
              </div>
            )
          }
        })()}
      </div>
    )
  }
}

export default CommentImageItemOn
