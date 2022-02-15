import React from 'react'
import Constants from 'src/client/Constants/Constants'


class ExerciseDescription extends React.Component {

    constructor() {
        super()
        this.state = {
            name: null,
            translation: null,
            description: null,
            number: null
        }
    }

    loadExerciseDescription(exercise, number) {
        let exerciseData = {
            number: number,
            name: "",
            translation: "",
            description: ""
        }

        switch(exercise.exerciseType) {

            case Constants.EXERCISE.WORD_IMAGE:
                exerciseData.name = this.props.pageTexts[12];
                exerciseData.translation = this.props.pageTexts[13];
                exerciseData.description = this.props.pageTexts[14];
                // exerciseData.name = "Arrastrar palabra con la imagen correcta.";
                // exerciseData.translation = "Drag the word to the right image.";
                // exerciseData.description = `En este ejercicio deberás seguir los siguientes pasos:
                // 1. Haz click en el ícono de audio.
                // 2. Escucha la palabra en inglés (puedes seleccionar una velocidad lenta o normal).
                // 3. Identifica la imagen que pertenece a la palabra escuchada.
                // 4. Arrastra la palabra hacia la imagen.
                // 5. Si la palabra es la correcta, puedes continuar.
                // 6. Si la palabra no es la correcta, deberás volver a hacerlo.`
                break;
            case Constants.EXERCISE.ORDER_WORDS:
                exerciseData.name = this.props.pageTexts[15];
                exerciseData.translation = this.props.pageTexts[16];
                exerciseData.description = this.props.pageTexts[17];
//                 exerciseData.name = "Ordenar frase o palabras.";
//                 exerciseData.translation = "Order the letters or words.";
//                 exerciseData.description = `En este ejercicio deberás seguir los siguientes pasos:
// 1. Haz click en el ícono de audio.
// 2. Escucha la frase en inglés (puedes seleccionar una velocidad lenta o normal).
// 3. Selecciona cada palabra o letra en orden para formar la frase o palabra escuchada.
// 4. Si el orden es el correcto, puedes continuar.
// 5. Si el orden no es el correcto, deberás volver a intentarlo.`;
                break;
            case Constants.EXERCISE.CORRECT_TRANSLATION:
                exerciseData.name = this.props.pageTexts[18];
                exerciseData.translation = this.props.pageTexts[19];
                exerciseData.description = this.props.pageTexts[20]
//                 exerciseData.name = "Seleccionar la traducción correcta";
//                 exerciseData.translation = "Select the right translation";
//                 exerciseData.description = `En este ejercicio deberás seguir los siguientes pasos:
// 1. Haz click en el ícono de audio.
// 2. Escucha la palabra o frase en inglés ( puedes seleccionar una velocidad lento o normal)
// 3. Selecciona  la  traducción de la palabra o frase presentada.
// 4. Si la traducción escogida es la correcta, puedes continuar.
// 5. Si la traducción  escrita no es la correcta, deberás volver a intentarlo.`
                break;


            case Constants.EXERCISE.CORRECT_ANSWER:
                exerciseData.name = this.props.pageTexts[21];
                exerciseData.translation = this.props.pageTexts[22];
                exerciseData.description = this.props.pageTexts[23]
//                 exerciseData.name = "Escuchar y seleccionar la respuesta correcta.";
//                 exerciseData.translation = "Listen and select the right answer.";
//                 exerciseData.description = `En este ejercicio deberás seguir los siguientes pasos:
// 1. Haz click en el ícono de audio.
// 2. Escucha la palabra o frase en inglés (puedes seleccionar una velocidad lenta o normal).
// 3. Selecciona la respuesta de la palabra o frase presentada.
// 4. Si la respuesta escogida es la correcta, puedes continuar.
// 5. Si la respuesta escogida no es la correcta, deberás volver a intentarlo.`
                break;


            case Constants.EXERCISE.MISSING_WORD:
                exerciseData.name = this.props.pageTexts[24];
                exerciseData.translation = this.props.pageTexts[25];
                exerciseData.description = this.props.pageTexts[26];
//                 exerciseData.name = "Escuchar y completar.";
//                 exerciseData.translation = "Listen and complete.";
//                 exerciseData.description = ` En este ejercicio deberás seguir los siguientes pasos:
// 1. Haz click en el ícono de audio.
// 2. Escucha la frase en inglés (puedes seleccionar una velocidad lenta o normal).
// 3. Escribe la palabra que falta para completar la oración.
// 4. Si la palabra es correcta, puedes continuar.
// 5. Si la palabra no es correcta, deberás volver a intentarlo.`;
                break;
            case Constants.EXERCISE.ERASE_WORD:
                exerciseData.name = this.props.pageTexts[27];
                exerciseData.translation = this.props.pageTexts[28];
                exerciseData.description = this.props.pageTexts[29];
//                 exerciseData.name = "Seleccionar y ordenar sólo las palabras o letras adecuadas para armar la frase correcta.";
//                 exerciseData.translation = "Select and sort only the right words to match the right phrase.";
//                 exerciseData.description = `En este ejercicio deberás seguir los siguientes pasos:
// 1. Haz click en el ícono de audio.
// 2. Escucha la frase o palabra en inglés (puedes seleccionar una velocidad lenta o normal).
// 3. Selecciona cada palabra o letra en orden para formar la frase escuchada.
// 4. Omite las palabras o letras que no son necesarias para la oración.
// 5. Si el orden es el correcto, puedes continuar.
// 6. Si el orden no es el correcto, deberás volver a intentarlo.`;
                break;
            case Constants.EXERCISE.TRANSLATE_WORD:
                exerciseData.name = this.props.pageTexts[30];
                exerciseData.translation = this.props.pageTexts[31];
                exerciseData.description = this.props.pageTexts[32];
//                 exerciseData.name = "Escribe la traducción correcta.";
//                 exerciseData.translation = "Write the right translation.";
//                 exerciseData.description = `En este ejercicio deberás seguir los siguientes pasos:
// 1. Haz click en el ícono de audio.
// 2. Escucha la palabra o frase en inglés (puedes seleccionar una velocidad lenta o normal).
// 3. Escribe la traducción de la palabra o frase escuchada.
// 4. Haz click en el botón de enviar.
// 5. Si la traducción escrita es la correcta, puedes continuar.
// 6. Si la traducción escrita no es la correcta, deberás volver a intentarlo.`;
                break;
            case Constants.EXERCISE.LISTEN_WRITE:
                exerciseData.name = this.props.pageTexts[33];
                exerciseData.translation = this.props.pageTexts[34];
                exerciseData.description = this.props.pageTexts[35]
//                 exerciseData.name = "Escuchar y escribir";
//                 exerciseData.translation = "Listen and write";
//                 exerciseData.description = `En este ejercicio deberás seguir los siguientes pasos:
// 1. Haz click en el ícono de audio.
// 2. Escucha la palabra en inglés ( puedes seleccionar una velocidad lento o normal)
// 3.  Escribe la  palabra en inglés escuchada.
// 4. Haz click en enviar para la corrección correspondiente.
// 5. Si la palabra escrita es la correcta, puedes continuar.
// 6. Si la palabra escrita no es la correcta, deberás volver a hacerlo. `
                break;
        }
        this.setState({
            number:exerciseData.number,
            name: exerciseData.name,
            translation: exerciseData.translation,
            description: exerciseData.description
        })
    }

    render() {
        let propsDescription = this.props.description ? this.props.description.split("\n"): [""]
        let description = this.state.description ? this.state.description.split("\n") : propsDescription
        return (
            <div className="col-xs-12">
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="exercise-border"><span>&nbsp;</span></div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="info-exercise-container">
                                <div className="number-exercise"><span>{this.state.number || this.props.number}</span></div>
                                <div className="title-container">
                                    <span className="title-exercise">{this.state.name || this.props.name}</span>
                                    <span className="sub-title-exercise">{this.state.translation || this.props.translation}</span>
                                    <span className="description-exercise"> {description.map((paragraph, index) => {
                                        return <div key={index}>{paragraph}</div>;
                                    })}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="exercise-border-dotted"><span>&nbsp;</span></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ExerciseDescription
