import React from 'react'
import ExerciseItem from 'src/client/modules/Exercises/ExerciseItem'
import ExerciseDescription from 'src/client/modules/Exercises/ExerciseDescription'
import InteractionsConstants from 'src/client/Constants/InteractionsConstants'
import CommentContainer from 'src/client/modules/Interactions/CommentContainer'
import Constants from 'src/client/Constants/Constants'
import Speecher from 'src/client/modules/Speecher/Speecher'

class GrammarSectionItem extends React.Component {
  constructor() {
    super()
    this.state = {
      comments: [],
      currentIndex: 0,
      // aunque sea uno se va a dejar como un arreglo ya que el componente
      // exerciseItem espera un arreglo con esto no hay que hacr tantos cambios
      currentExercise: [],
      hasMoreComments: true,
      section: Constants.SECTION_ID.GRAMMAR,
      exerciseFinished: [],
      commentsFinished: false
    }
    this.loadCommentsUntilFindExercise.bind(this)
  }

  // se ejecuta antes de de montar el componente
  componentWillMount() {
    this.speecherInstance = new Speecher()

    // se cargan los datos
    this.loadCommentsUntilFindExercise()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.allInteractions[0]) {
      if (nextProps.allInteractions[0] != this.props.allInteractions[0]) {
        this.setState({
          comments: [],
          currentIndex: 0,
          currentExercise: [],
          exerciseFinished: [],
          commentsFinished: false,
          hasMoreComments: true
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.allInteractions[0]) {
      if (prevProps.allInteractions[0] != this.props.allInteractions[0]) {
        this.loadCommentsUntilFindExercise()
      }
    }
  }

  goTo(element) {
    $("html, body").animate({
      scrollTop: $(element).position().top
    }, "slow");

    // console.log("$(element).position().top", $(element));
  }


  changeListeningOthers(commenContainerIndex){
    for (var comment in this.refs) {
      if (this.refs.hasOwnProperty(comment)) {
        if(comment.includes('comment') ){
          if(comment != 'comment'+commenContainerIndex)
          this.refs[comment].changeListeningAll()
        }
        // console.log('this.refs.hasOwnProperty(comment)', this.refs.hasOwnProperty(comment));
      }
    }
  }

  // funcion encargada de cargar los comentarios asociados a un ejercicio
  // se cargan todos los comentarios antes de llegar a un ejercicio
  loadCommentsUntilFindExercise() {
    // si ya se finalizaron todas las interacciones se llama al componente padre para que llame a la
    // siguiente seccion

    let allInteractions = this.props.allInteractions;
    let comments = [];
    let currentExercise = [];
    let allComments = [];
    let allCurrentExercise = [];
    for (let i = 0; i < allInteractions.length; i++) {
      // for (let i = index; i < allInteractions.length; i++) {
      if (allInteractions[i].interactionType == InteractionsConstants.IMAGE_COMMENT ||
        allInteractions[i].interactionType == InteractionsConstants.COMMENT ||
        allInteractions[i].interactionType == InteractionsConstants.WORD_DESCRIPTION) {
          comments.push(allInteractions[i])
        } else {
          currentExercise.push(allInteractions[i])

          allComments.push(comments)
          allCurrentExercise.push(currentExercise)
          comments = []
          currentExercise = []
        }
      }

      this.setState({
        // currentIndex: i + 1,
        comments: allComments,
        // hasMoreComments: hasMoreComments,
        currentExercise: allCurrentExercise
      })
    }

    loadExerciseDescription(exercise, number, index) {
      // this.refs.exercises.loadExerciseDescription(exercise, number)
      this.refs['exercises' + index].loadExerciseDescription(exercise, index + 1)
    }


    // aqui simplemente se actualiza el estado a que ya terminaron los ejercicios
    exercisesFinished(execiseId) {
      let temp = this.state.exerciseFinished;

      // se guarda en exerciseFinished el id de los ejercicios terminados
      if (temp.indexOf(execiseId) < 0) {
        temp.push(execiseId)
        this.setState({
          exerciseFinished: temp
        }, (() => {
          this.checkIsAllFinished();
        }).bind(this));
      }

      if (this.state.exerciseFinished.length < this.state.currentExercise.length) {
        // si no es el ultimo ejercicio se lleva al siguiente.
        if (execiseId + 1 < this.state.currentExercise.length) {
          let goId = '#exercise-' + (execiseId + 1)
          this.goTo(goId)
        }else{
          //  si es el ultimo ejercicio se verifica que esten terminados todos
          for (var i = 0; i < this.state.currentExercise.length -1 ; i++) {
            if(temp.indexOf(i) < 0){
              let goId = '#exercise-' + (i)
              this.goTo(goId)
              swal({
                title: this.props.pageTexts[36],
                text: this.props.pageTexts[37],
                // title: "Termina todo!",
                // text: "Debes terminar todos los ejercicios.",
                timer: 3000,
                showConfirmButton: false
              });
              break;
            }
          }
        }

      }
    }

    commentsFinished() {
    }

    checkIsAllFinished() {
      if (this.state.exerciseFinished.length == this.state.currentExercise.length) {
        this.props.exercisesFinished.call(null);
      }
    }

    render() {
      return (
        <div className="container" style={{
          marginBottom: '2em'
        }}>

        {this.state.comments.map((comment, index) => {
          // console.log('comment', comment);
          if(true){

          return (
            <div key={index} id={"exercise-" + index} className="col-xs-12">
              <div className="row">
                <ExerciseDescription ref={"exercises" + index}
                  pageTexts={this.props.pageTexts} />
                  <div className="col-xs-12 col-md-6">
                    <div className="row">
                      <CommentContainer ref={"comment" + index}
                        speecherInstance = {this.speecherInstance}
                        commentIndex={index}
                        allComments={comment}
                        section={this.state.section}
                        changeListeningOthers={this.changeListeningOthers.bind(this)}
                        commentsFinished={this.commentsFinished.bind(this)} />
                      </div>
                    </div>
                    <div className="col-xs-12 col-md-6">
                      <div className="row">
                        {(() => {
                          if (this.state.currentExercise.length > 0) {
                            return (
                              <div className="col-xs-12 col-md">
                                <div className="row">
                                  <ExerciseItem
                                    exercises={this.state.currentExercise[index]}
                                    number={index}
                                    exerciseDescription={this.loadExerciseDescription.bind(this)}
                                    toCongratulate={this.props.toCongratulate.bind(this)}
                                    showFailMessage={this.props.showFailMessage}
                                    exercisesFinished={this.exercisesFinished.bind(this)} />
                                  </div>
                                </div>
                              )
                            }
                          })()}
                        </div>
                      </div>

                    </div>

                  </div>
                )
              }

              })}

            </div>
          )
        }
      }

      export default GrammarSectionItem
