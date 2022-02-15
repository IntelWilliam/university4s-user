import React from 'react'
import ExerciseDescription from 'src/client/modules/Exercises/ExerciseDescription'
import CommentContainer from 'src/client/modules/Interactions/CommentContainer'
import Constants from 'src/client/Constants/Constants'
import Speecher from 'src/client/modules/Speecher/Speecher'

class ConversationSectionItem extends React.Component {
    constructor() {
        super()
        this.state = {
            comments: [],
            currentIndex: 0,
            section: Constants.SECTION_ID.CONVERSATION,
            commentsFinished: false
        }
        this.loadPair.bind(this)
    }

    // se ejecuta antes de de montar el componente
    componentWillMount() {
        // se cargan los datos
        this.loadPair()
        this.speecherInstance = new Speecher()
    }

    // funcion encargada de cargar las interacciones, se cargan por pares

    loadPair() {
        let index = this.state.currentIndex;
        /* si ya se finalizaron todas las interacciones se llama al componente padre para que llame a la
         siguiente seccion/ practica según corresponda */
        if (index >= this.props.allInteractions.length) {
            this.props.exercisesFinished.call(null);
        } else {
            // se carga desde la interacción actúal
            let allInteractions = this.props.allInteractions;
            let comments = [];
            /* flag que sirve de ayuda para saber si ya están los dos comentarios sencillos para
             cargar mas */
            let flag = 0;
            for (let i = index; i < allInteractions.length; i++) {
                // si no tiene reacción es un comentario sencillo
                if (allInteractions[i].reactionId == null) {
                    flag++;
                    comments.push(allInteractions[i])
                    if (flag == 2) {
                        // se cambia el indice a i + 1 para que en la proxima iteración empiece a verificar
                        // desde la siguiente interacción
                        index = i + 1;
                        break;
                    }
                } else {
                    // se verifica primero si en comments ya hay algún comentario para no cargar el acción
                    // reacción, solo el comentario.
                    if (flag == 1) {
                        index = i;
                        break;
                    }
                    // es acción reacción
                    index = i + 1;
                    comments.push(allInteractions[i])
                    comments.push(allInteractions[i].reactionId)
                    break;
                }
            }
            this.setState({
                currentIndex: index,
                comments: comments
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.allInteractions[0]) {
            if (nextProps.allInteractions[0] != this.props.allInteractions[0]) {
                this.setState({
                    comments: [],
                    currentIndex: 0,
                    commentsFinished: false
                });
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.allInteractions[0]) {
            if (prevProps.allInteractions[0] != this.props.allInteractions[0]) {
                this.loadPair()
            }
        }
    }


    loadExerciseDescription(exercise, number) {
      console.log('exercises: ', exercises)
        this.refs.exercises.loadExerciseDescription(exercise, number)
    }

    commentsFinished() {
        this.loadPair();
    }

    render() {
        return (
            <div className="container">
                <div className="col-xs-12">
                    <div className="row">
                        <ExerciseDescription ref="exercises" />
                        <div className="col-xs-12">
                            <div className="row">
                                <CommentContainer allComments={this.state.comments}
                                    section={this.state.section}
                                    speecherInstance = {this.speecherInstance}
                                    toCongratulate={this.props.toCongratulate.bind(this)}
                                    showFailMessage={this.props.showFailMessage}
                                    commentsFinished={this.commentsFinished.bind(this)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ConversationSectionItem
