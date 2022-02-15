import React from 'react'
import ExerciseItem from 'src/client/modules/Exercises/ExerciseItem'
import ExerciseDescription from 'src/client/modules/Exercises/ExerciseDescription'
import CommentContainer from 'src/client/modules/Interactions/CommentContainer'
import Constants from 'src/client/Constants/Constants'
import Speecher from 'src/client/modules/Speecher/Speecher'

class VocabularySectionItem extends React.Component {
    constructor() {
        super()
        this.slider
        this.state = {
            section: Constants.SECTION_ID.VOCABULARY
        }
    }

    // se ejecuta antes de de montar el componente
    componentWillMount() {
      this.speecherInstance = new Speecher()
    }



    loadExerciseDescription(exercise, number) {
       this.refs.exercises.loadExerciseDescription(exercise, number)
    }

    render() {
        return (
            <div className="container" style={{    paddingBottom: '3em'}}>
                <div className="col-xs-12">
                    <div className="row">
                        <ExerciseDescription number="1"
                                             name={this.props.pageTexts[9]}
                                             translation={this.props.pageTexts[10]}
                                             description={this.props.pageTexts[11]}/>
                                             {/* name="Escuchar y pronunciar todas las palabras."
                                             translation="Listen and pronounce all the words."
                                             description="En este ejercicio deberás seguir los siguientes pasos:
1. Haz click en el ícono de audio.
2. Escucha la palabra en inglés (puedes seleccionar una velocidad lenta o normal).
3. Haz click en el ícono del micrófono y pronuncia la palabra según lo escuchado.
4. Si la pronunciación es correcta, puedes proseguir con la siguiente palabra.
5. Si la pronunciación no es la correcta, tendrás que repetir nuevamente para continuar."/> */}
                        <CommentContainer allComments={this.props.allComments}
                                          section={this.state.section}
                                          speecherInstance = {this.speecherInstance}
                                          commentsFinished={this.props.commentsFinished}/>

                        <ExerciseDescription ref="exercises"
                        pageTexts={this.props.pageTexts}/>
                        <div className="col-xs-12">
                            <div className="row">
                                {(() => {
                                    if(this.props.currentExercises.length > 0) {
                                        return (
                                            <div className="col-xs-12 col-md">
                                                <div className="row">
                                                    <div className="col-xs-12 col-md-6">
                                                        <div className="row">
                                                            <ExerciseItem exercises={this.props.currentExercises}
                                                                          exerciseDescription={this.loadExerciseDescription.bind(this)}
                                                                          toCongratulate={this.props.toCongratulate.bind(this)}
                                                                          showFailMessage={this.props.showFailMessage}
                                                                          exercisesFinished={this.props.exercisesFinished}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default VocabularySectionItem
