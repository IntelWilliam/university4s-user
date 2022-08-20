import React from 'react';
import ExercisesStore from 'src/client/modules/Exercises/ExercisesStore';
import Container from 'src/client/modules/Exercises/MatchPhraseImage/Container';
import OrderWordContainer from 'src/client/modules/Exercises/OrderWord/OrderWordContainer';
import RightTranslationContainer from 'src/client/modules/Exercises/RightTranslation/RightTranslationContainer';
import EraseWordContainer from 'src/client/modules/Exercises/EraseWrong/EraseWordContainer';
import TranslateContainer from 'src/client/modules/Exercises/Translate/TranslateContainer';
import ListenCompleteContainer from 'src/client/modules/Exercises/ListenComplete/ListenCompleteContainer';
import ListenWriteContainer from 'src/client/modules/Exercises/ListenWrite/ListenWriteContainer';
import CorrectAnswerContainer from 'src/client/modules/Exercises/CorrectAnswer/CorrectAnswerContainer';
import Constants from 'src/client/Constants/Constants';

class ExerciseItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentExercise: null,
      user: JSON.parse(localStorage.user),
      currentIndex: 0,
      exerciseNumber: this.props.number || 2,
    };
    // se manda el contexto a los metodos
    this.loadData.bind(this);
  }

  // se ejecuta antes de de montar el componente
  componentWillMount() {
    // se cargan los datos
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.exercises.length == 1) {
      if (this.props.exercises[0]._id != null) {
        if (this.props.exercises[0]._id != nextProps.exercises[0]._id) {
          let exerciseNumber = parseInt(this.state.exerciseNumber) + 1;
          this.setState(
            {
              exerciseNumber: exerciseNumber,
            },
            (() => {
              this.loadExercise(nextProps.exercises[0]._id);
            }).bind(this)
          );
        }
      }
    }
  }

  loadData() {
    // se carga el primer ejercicio
    if (this.props.exercises.length > 0) {
      // se obtiene del arreglo de interacciones el interaction id
      this.loadExercise(this.props.exercises[0]._id);
    }
  }

  loadNext() {
    this.props.toCongratulate.call(null);
    let currentExercise = this.state.currentExercise;
    let exercises = this.props.exercises;
    if (currentExercise != null) {
      let currentIndex = this.state.currentIndex + 1;
      let exerciseNumber = parseInt(this.state.exerciseNumber) + 1;
      if (exercises[currentIndex] != undefined) {
        this.setState(
          {
            currentIndex: currentIndex,
            exerciseNumber: exerciseNumber,
          },
          (() => {
            this.loadExercise(exercises[currentIndex]._id);
          }).bind(this)
        );
      } else {
        // se finalizaron los ejercicios de la sección
        this.props.exercisesFinished.call(null, this.props.number);
      }
    }
  }

  // function encargada de cargar un ejercicio dado su interactionId
  loadExercise(interactionId) {
    // se inician las variables necesarias para la pagina
    let params = {
      sortType: 1,
      sortField: 'createdAt',
    };
    params['interactionId'] = interactionId;
    params['limit'] = 1;

    // pagina que se va a cargar
    params.page = 1;
    ExercisesStore.getAll(params, (error, exercise) => {
      if (error) {
      } else {
        let exerciseData = exercise.data[0];
        this.setState({
          currentExercise: exerciseData,
        });
        this.props.exerciseDescription.call(
          null,
          exerciseData,
          this.state.exerciseNumber,
          this.props.number
        );
      }
    });
  }

  render() {
    return (
      <div className='col-xs-12'>
        {(() => {
          if (this.state.currentExercise) {
            if (
              this.state.currentExercise.exerciseType ==
              Constants.EXERCISE.WORD_IMAGE
            ) {
              return (
                <Container
                  exercise={this.state.currentExercise}
                  showFailMessage={this.props.showFailMessage}
                  loadNext={this.loadNext.bind(this)}
                />
              );
            } else if (
              this.state.currentExercise.exerciseType ==
              Constants.EXERCISE.ORDER_WORDS
            ) {
              return (
                <OrderWordContainer
                  exercise={this.state.currentExercise}
                  showFailMessage={this.props.showFailMessage}
                  loadNext={this.loadNext.bind(this)}
                />
              );
            } else if (
              this.state.currentExercise.exerciseType ==
              Constants.EXERCISE.CORRECT_TRANSLATION
            ) {
              return (
                <RightTranslationContainer
                  exercise={this.state.currentExercise}
                  showFailMessage={this.props.showFailMessage}
                  loadNext={this.loadNext.bind(this)}
                />
              );
            } else if (
              this.state.currentExercise.exerciseType ==
              Constants.EXERCISE.MISSING_WORD
            ) {
              console.log(
                'this.state.currentExercise',
                this.state.currentExercise
              );
              return (
                <ListenCompleteContainer
                  exercise={this.state.currentExercise}
                  showFailMessage={this.props.showFailMessage}
                  loadNext={this.loadNext.bind(this)}
                />
              );
            } else if (
              this.state.currentExercise.exerciseType ==
              Constants.EXERCISE.ERASE_WORD
            ) {
              return (
                <EraseWordContainer
                  exercise={this.state.currentExercise}
                  showFailMessage={this.props.showFailMessage}
                  loadNext={this.loadNext.bind(this)}
                />
              );
            } else if (
              this.state.currentExercise.exerciseType ==
              Constants.EXERCISE.TRANSLATE_WORD
            ) {
              return (
                <TranslateContainer
                  exercise={this.state.currentExercise}
                  showFailMessage={this.props.showFailMessage}
                  loadNext={this.loadNext.bind(this)}
                />
              );
            } else if (
              this.state.currentExercise.exerciseType ==
              Constants.EXERCISE.LISTEN_WRITE
            ) {
              return (
                <ListenWriteContainer
                  exercise={this.state.currentExercise}
                  showFailMessage={this.props.showFailMessage}
                  loadNext={this.loadNext.bind(this)}
                />
              );
            } else if (
              this.state.currentExercise.exerciseType ==
              Constants.EXERCISE.CORRECT_ANSWER
            ) {
              return (
                <CorrectAnswerContainer
                  exercise={this.state.currentExercise}
                  showFailMessage={this.props.showFailMessage}
                  loadNext={this.loadNext.bind(this)}
                />
              );
            }
          }
        })()}
      </div>
    );
  }
}

export default ExerciseItem;
