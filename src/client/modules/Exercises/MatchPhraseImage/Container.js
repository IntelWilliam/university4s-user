import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import { shuffle } from 'src/client/Util/Randomize'
import HTML5Backend from 'react-dnd-html5-backend';
import Dustbin from 'src/client/modules/Exercises/MatchPhraseImage/Dustbin';
import Box from 'src/client/modules/Exercises/MatchPhraseImage/Box';
import update from 'react/lib/update';
import { caseDescription } from 'src/client/Util/Capitalize'

@DragDropContext(HTML5Backend)
export default class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exercise: this.props.exercise,
            dustbins: [],
            boxes: [],
            droppedBoxNames: []
        };

        // se manda el contexto a los metodos
        this.loadData.bind(this)
    }
    // se ejecuta antes de de montar el componente
    componentDidUpdate() {
        // se cargan los datos
        let currentExercise = this.props.exercise;
        if(currentExercise != this.state.exercise) {
            this.setState({
                exercise: currentExercise
            })
            this.loadData(currentExercise)
        }
    }

    // se ejecuta antes de de montar el componente
    componentWillMount() {
        // se cargan los datos
        this.loadData(this.state.exercise)
    }

    loadData(exercise) {
        let dustbins = [];
        let boxes = [];

        exercise.phrasesAndPictures.map((phraseAndPicture) => {
            dustbins.push({
                accepts: phraseAndPicture._id,
                image: phraseAndPicture.imageUrl,
                lastDroppedItem: null
            })
            boxes.push({
                name: phraseAndPicture.phrase,
                phraseId: phraseAndPicture.phraseId,
                type: phraseAndPicture._id
            })
        })

        boxes = shuffle(boxes);
        dustbins = shuffle(dustbins);

        this.setState({
            boxes: boxes,
            dustbins: dustbins
        })

    }

    isDropped(boxName) {
        return this.state.droppedBoxNames.indexOf(boxName) > -1;
    }

    render() {
        const { boxes, dustbins } = this.state;

        return (
            <div className="row">
                <div className="col-xs-12" style={{color: '#1959dc'}}>
                  {caseDescription(this.props.exercise.description)}
                </div>
                {dustbins.map(({ accepts, image, lastDroppedItem }, index) =>
                    <div className="col-xs-12"  key={index} >
                        <div className="row exercise-container">
                             <Dustbin accepts={accepts}
                                     image={image}
                                     lastDroppedItem={lastDroppedItem}
                                     onDrop={(item) => this.handleDrop(index, item)}
                                     key={index} />
                             <div className="col-xs-3 col-sm-3 text-to-say-container" >
                                  <Box name={boxes[index].name}
                                       type={boxes[index].type}
                                       phraseId={boxes[index].phraseId}
                                       showFailMessage={this.props.showFailMessage}
                                       isDropped={this.isDropped(boxes[index].name)}
                                       key={index} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    handleDrop(index, item) {
        const { name } = item;

        this.setState(update(this.state, {
            dustbins: {
                [index]: {
                    lastDroppedItem: {
                        $set: item
                    }
                }
            },
            droppedBoxNames: name ? {
                $push: [name]
            } : {}
        }));
        this.checkIfFinished();
    }

    checkIfFinished() {
        let finishedItems = this.state.dustbins.filter((item) => {
            return item.lastDroppedItem != null;
        })

        if(finishedItems.length == this.state.dustbins.length) {
            this.props.loadNext.call(null)
        } else {
        }
    }
}
