import React from 'react'
import Comment from 'src/client/modules/Moodle/ChatCosmo/Conversation/Comment'
// import Speecher from 'src/client/modules/Speecher/Speecher'
// import Constants from 'src/client/Constants/Constants'
import ChatCosmoStore from 'src/client/modules/Moodle/ChatCosmo/ChatCosmoStore'

class CommentContainer extends React.Component {
  // TODO este componente se va a reestructurar para que cargue los comentarios de cualquier sección
  constructor() {
    super()
    this.slider

    this.state = {
      cosmoResp: 'Waiting for your question',
      cosmoCanSay: false
    }
    // se manda el contexto a los metodos
    // this.listenSuccesWord = this.listenSuccesWord.bind(this)
    this.whatAmISaying = this.whatAmISaying.bind(this)
  }

  componentDidMount() {
    this.slider = $(".comments-slider").slick({
      variableWidth: true,
      slidesToShow: 1,
      centerMode: false,
      infinite: false
    });

  }

  resetState(){
    this.setState({
      cosmoResp: 'Waiting for your question',
    })

    this.refs['1'].restartState()
  }

  triggerListenChange(word, ref) {
    // this.props.speecherInstance.onListen = this.listenSuccesWord.bind(this)
    this.props.speecherInstance.whatAmISaying = this.whatAmISaying.bind(this)

    var outString = word.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

    // elimina los espacios repetidos
    outString = outString.replace(/\s+/g,' ')

    this.props.speecherInstance.speechRecognition(outString, ref)
  }

  getCosmoResp(phrase){
      ChatCosmoStore.getCosmoResp(phrase, this.props.storyRaw, this.props.topic , this.props.cosmoSesion, (err, response) => {
        if (err)
        return
        console.log('response', response  );

        this.setState({
          cosmoResp: response.data,
          cosmoCanSay: true
        })
      })
  }


  listenSuccesWord(recognized, ref) {
    this.props.speecherInstance.onListen = null
  }

  whatAmISaying(phrase, ref) {
    console.log('phrase', phrase);
    phrase = phrase.replace("?", "");
    this.props.speecherInstance.whatAmISaying = null

    this.getCosmoResp(phrase)

    if (ref in this.refs) {
      this.refs[ref].whatAmISaying(phrase)
      this.refs[ref].changeListening(false)
    }
  }

  changeCanSay(){
    console.log('on changeCanSay');
    this.setState({
      cosmoCanSay: false
    })
  }

  render() {
    return (
      <div className="col-xs-12" style={{marginBottom: '2em'}}>
        <div className="row">
          <div className="col-xs-12">
            <Comment
              name={''}
              description={'Presiona el micrófono y haz una pregunta'}
              author={2}
              ref={1}
              triggerListenChange={this.triggerListenChange.bind(this)}
              sendQuestion={this.whatAmISaying.bind(this)}
              index={0}
            />

            <Comment
              name={this.state.cosmoResp}
              description={'cosmo responde:'}
              cosmoCanSay= {this.state.cosmoCanSay}
              changeCanSay= {this.changeCanSay.bind(this)}
              author={1}
              ref={2}
              triggerListenChange={this.triggerListenChange.bind(this)}
              index={1}
            />

          </div>
        </div>
      </div>
    )
  }
}

export default CommentContainer
