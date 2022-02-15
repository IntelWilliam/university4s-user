import React from 'react'
import CommentImageItem from 'src/client/modules/Interactions/CommentImage/CommentImageItem'
import SimpleComment from 'src/client/modules/Interactions/SimpleComment/SimpleComment'
import Comment from 'src/client/modules/Interactions/ActionReactionComment/Comment'
// import Speecher from 'src/client/modules/Speecher/Speecher'
import Constants from 'src/client/Constants/Constants'

class CommentContainer extends React.Component {
  // TODO este componente se va a reestructurar para que cargue los comentarios de cualquier sección
  constructor() {
    super()
    this.slider

    this.state = {
      sayNext: false,
      tryNumber: 1,
      currentWord: null,
      phraseInProgress: true
    }
    // se manda el contexto a los metodos
    this.listenSuccesWord = this.listenSuccesWord.bind(this)
    this.whatAmISaying = this.whatAmISaying.bind(this)
    this.checkIfCommentsFinished.bind(this)
  }

  // se ejecuta antes de de montar el componente
  componentWillMount() {
    // se instancia la clase
    // this.speecherInstance = new Speecher()
    // this.speecherInstance.onListen = this.listenSuccesWord.bind(this)
    // this.speecherInstance.whatAmISaying = this.whatAmISaying.bind(this)

  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.allComments[0] && this.props.allComments[0]) {

      // if (nextProps.allComments[0]._id != this.props.allComments[0]._id ||
      //     nextProps.allComments[0].interactionType != this.props.allComments[0].interactionType ||
      //     nextProps.allComments[0].name != this.props.allComments[0].name)
      if (nextProps.allComments != this.props.allComments)
      {

        this.setState({
          sayNext: false,
          phraseInProgress: true
        }, () => {
          for (let index in this.refs) {
            this.refs[index].restartState()
          }
        })
      }
    }
  }


  componentDidMount() {
    this.slider = $(".comments-slider").slick({
      variableWidth: true,
      slidesToShow: 1,
      centerMode: false,
      infinite: false
    });
  }

  triggerListenChange(word, ref) {
    // this.speecherInstance = new Speecher()
    this.props.speecherInstance.onListen = this.listenSuccesWord.bind(this)
    this.props.speecherInstance.whatAmISaying = this.whatAmISaying.bind(this)

    // establece el listening en false de los otros CommentContainer
    if(this.props.section == Constants.SECTION_ID.GRAMMAR ){
      this.props.changeListeningOthers.call(null, this.props.commentIndex)
    }

    var outString = word.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

    // elimina los espacios repetidos
    outString = outString.replace(/\s+/g,' ')

    this.props.speecherInstance.speechRecognition(outString, ref)

    // si la palabra cambia se reinician los intentos
    if(this.state.currentWord != word){
      this.setState({
        tryNumber: 1,
        currentWord: word
      })
    }

    for (let index in this.refs) {
      if (index != ref) {
        this.refs[index].changeListening(false)
      }
    }
  }

  changeListeningAll(){
    for (let index in this.refs) {
        this.refs[index].changeListening(false)
    }
  }

  listenSuccesWord(recognized, ref) {

    // this.speecherInstance = null
    // this.speecherInstance.onListen = null
    // this.speecherInstance.whatAmISaying = null

    if(recognized){
      this.setState({
        tryNumber: 1,
      })
    }
    if (ref in this.refs) {

      if (this.state.tryNumber >= 2) {
        this.setState({
          tryNumber: 1,
        })
        recognized = true
      } else {
        this.setState({
          tryNumber: this.state.tryNumber + 1
        })
      }
      this.refs[ref].listenWord(recognized)
    }
    this.props.speecherInstance.onListen = null

  }

  whatAmISaying(phrase, ref) {

    this.props.speecherInstance.whatAmISaying = null
    if (ref in this.refs) {
      this.refs[ref].whatAmISaying(phrase)
      this.refs[ref].changeListening(false)
    }
  }

  checkIfCommentsFinished() {
    let isFinished = true;
    for (let index in this.refs) {
      // se verifican las refs para comprabar si el estado del ejercicio ya es finalizado
      let hasEnded = this.refs[index].isFinished()
      if (!hasEnded) {
        isFinished = false;
        break;
      }
    }
    if (isFinished) {
      this.props.commentsFinished.call(null)
    }
  }

  onPhrasePronunciationEnded() {
    this.setState({
      phraseInProgress: false,
      sayNext: true
    })
  }

  render() {
    return (
      <div className="col-xs-12" style={{marginBottom: '2em'}}>
        <div className="row">
          {(() => {
            if(this.props.section == Constants.SECTION_ID.VOCABULARY) {
              return (
                <div className="col-xs-12 comments-slider-container">
                  <div className="comments-slider">
                    {this.props.allComments.map((comment, index) => {
                      return  <CommentImageItem
                        key={index}
                        phraseId={comment.phraseId}
                        name={comment.name}
                        castell={comment.castell}
                        checkFinished={this.checkIfCommentsFinished.bind(this)}
                        imageUrl={comment.imageUrl}
                        ref={index + 1}
                        triggerListenChange={this.triggerListenChange.bind(this)}
                        index={index}/>
                      })}
                    </div>
                  </div>
                )
              } else if(this.props.section == Constants.SECTION_ID.GRAMMAR) {
                return (
                  <div className="col-xs-12">
                    {this.props.allComments.map((comment, index) => {
                      let commentImage = null;

                      if(comment.imageUrl){
                        commentImage = comment.imageUrl
                      }

                      let wordDesc = [];

                      if(comment.wordDesc){
                        wordDesc = comment.wordDesc
                      }

                      return  <SimpleComment
                        key={index}
                        name={comment.name}
                        castell={comment.castell}
                        description={comment.description}
                        phraseId={comment.phraseId}
                        commentImage = {commentImage}
                        wordDesc = {wordDesc}
                        checkFinished={this.checkIfCommentsFinished.bind(this)}
                        ref={index + 1}
                        triggerListenChange={this.triggerListenChange.bind(this)}
                        index={index}/>
                      })}

                    </div>
                  )
                } else if(this.props.section == Constants.SECTION_ID.CONVERSATION) {
                  return (
                    <div className="col-xs-12">
                      {this.props.allComments.map((comment, index) => {
                        return  <Comment
                          key={index}
                          name={comment.name}
                          castell={comment.castell}
                          description={comment.description}
                          author={comment.author}
                          phraseId={comment.phraseId}
                          checkFinished={this.checkIfCommentsFinished.bind(this)}
                          phraseEnded={this.onPhrasePronunciationEnded.bind(this)}
                          phraseInProgress={this.state.phraseInProgress}
                          ref={index + 1}
                          canSayNext={this.state.sayNext}
                          triggerListenChange={this.triggerListenChange.bind(this)}
                          index={index}/>
                        })}
                      </div>
                    )
                  }
                })()}
              </div>
            </div>
          )
        }
      }

      export default CommentContainer
