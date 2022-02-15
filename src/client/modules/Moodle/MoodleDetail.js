import React from 'react'
import NavigationItem from 'src/client/modules/Moodle/NavigationItem'
import {Link} from 'react-router'

export default class MoodleDetail extends React.Component {

  render() {

    let tittleClass = 'lesson-title';
    if(this.props.borderTittle){
      tittleClass = 'lesson-title border-boot-title'
    }

    return (
      <div>
            <div className="header-navigation col-xs-12">
                <div className="row">
                  {this.props.navigation.map((page, index) => {
                      return  <NavigationItem
                          key={index}
                          index={index}
                          name={page.name}
                          url={page.url}
                      />
                  })}
                </div>
            </div>
            <span className={tittleClass}>{this.props.title}</span>
            <span className="lesson-subtitle">{this.props.translation}</span>

            {(() => {
                if (this.props.headerType == 'PracticeLesson') {
                    return (
                      <div className="lesson-description">
                        <p>{this.props.pageTexts[3]}</p>

                        <ol>
                          <li>{this.props.pageTexts[4]}</li>
                          <li>{this.props.pageTexts[5]}</li>
                          <li>{this.props.pageTexts[6]}</li>
                          <li>{this.props.pageTexts[7]}</li>
                        </ol>

                        <p>{this.props.pageTexts[8]}</p>
                        <p>{this.props.pageTexts[9]}</p>
                        <p>{this.props.pageTexts[10]}</p>
                        {/* <p>Antes de ingresar a los simuladores y/o laboratorios de práctica asegúrate de:</p>

                        <ol>
                          <li>Haber leído el objetivo de la lección en el libro y fijar una meta de aprendizaje.</li>
                          <li>Haber revisado cuidadosamente las explicaciones y/o información que aparece en cada lección de tu libro virtual o físico.</li>
                          <li>Resolver los ejercicios de cada lección. Si tienes dudas, revisa nuevamente las indicaciones o realiza las consultas respectivas al tutor en línea.</li>
                          <li>Haz un clic en “solución” para visualizar las respuestas correctas de los ejercicios.</li>
                        </ol>

                        <p>Recomendamos ingresar al laboratorio de prácticas al día siguiente de haber concluido la lección en tu libro. De este modo, los ejercicios te ayudarán a reforzar y evaluar lo aprendido.</p>
                        <p>Recuerda el objetivo de la lección y responde la siguiente pregunta: ¿Puedo hacerlo? Si la respuesta es afirmativa, pasa a la siguiente lección.</p>
                        <p>De lo contrario, identifica el problema, revisa la lección nuevamente y resuelve más ejercicios. Si las dudas persisten, busca la asesoría del tutor online o manda tus preguntas a través del buzón de consultas.</p> */}

                      </div>
                    )
                } else if (this.props.headerType == 'PracticeExercise'){
                    return (
                      <div className="lesson-description">
                        <p> {this.props.pageTexts[3]}</p>

                        <ol>
                          <li>{this.props.pageTexts[4]}</li>
                          <li>{this.props.pageTexts[5]}</li>
                          <li>{this.props.pageTexts[6]}</li>
                        </ol>

                        <p>{this.props.pageTexts[7]}</p>
                        {/* <p>Antes de ingresar a los simuladores y/o laboratorios de práctica asegúrate de:</p>

                        <ol>
                          <li>Leer las frases cuidadosamente.</li>
                          <li>Revisar las alternativas que se proponen.</li>
                          <li>Seleccionar la(s) palabra(s) que mejor completa(n) cada oración.</li>
                        </ol>

                        <p>Recuerda leer la información sobre la lección en el lado derecho de tu pantalla.</p> */}
                      </div>
                        )
                }else if (this.props.headerType == 'notas'){
                    return (
                      <div className="lesson-description row">

                        <div className="col-xs-1">
                          <img src="/images/Calificaciones_important.png"></img>
                        </div>
                        <div className="col-xs-11">
                          <span>{this.props.pageTexts[3]}</span>
                          {/* <span>Identifica el tipo de examen que vas a dar. Puede ser el de Gramática, comprensión auditiva o comprensión de lectura y al darle click tendrás acceso a los exámenes.</span> */}
                        </div>


                      </div>
                        )
                }else if (this.props.headerType == 'account'){
                    return (
                      <div className="lesson-description">
                        <p>{this.props.pageTexts[3]} <span className="bold">{this.props.pageTexts[4]} </span></p>
                        <p>{this.props.pageTexts[5]} <span className="bold">{this.props.pageTexts[6]} </span> {this.props.pageTexts[7]}</p>
                        <p>{this.props.pageTexts[8]} <span className="bold">{this.props.pageTexts[9]} </span> {this.props.pageTexts[10]}</p>
                        {/* <p>Nuestra institución requiere que tus datos sean correctos, en especial el <span className="bold">correo electrónico. </span></p>
                        <p>Tu <span className="bold">correo electrónico </span> es su nombre de usuario.</p>
                        <p>En caso de que el alumno sea menor de edad y no cuente o recuerde con el <span className="bold">Documento de identificación, </span> registrar el del titular (la persona que paga el curso).</p> */}
                      </div>
                        )
                }else if (this.props.headerType == 'consultas'){
                    return (
                      <div className="lesson-description">
                        <p className="bold">{this.props.pageTexts[3]}</p>
                        <p>{this.props.pageTexts[4]}</p>
                        <p><span className="bold">{this.props.pageTexts[5]} </span> {this.props.pageTexts[6]}</p>
                        <p><span className="bold">{this.props.pageTexts[7]} </span> {this.props.pageTexts[8]}</p>
                        <p><span className="bold">{this.props.pageTexts[9]} </span></p>
                        {/* <p className="bold">Instrucciones</p>
                        <p>Estimado alumno, por favor seleccione en el cuadro de tipo consulta, qué consulta desea realizar y contàctese con nosotros. Si necesita ayuda en la descarga de algùn archivo, video o audios.</p>
                        <p><span className="bold">Consulta administrativa: </span> Si Ud tuviera preguntas sobre sus pagos, descuentos, evìos de certificados,solicitud de constancias de estudio o reserva de exàmenes orales.</p>
                        <p><span className="bold">Consulta de contenidos: </span> Si Ud tuviera una pregunta sobre los libros en lìnea, pràcticas o laboratorios.</p>
                        <p><span className="bold">¡Muchas gracias! </span></p> */}
                      </div>
                        )
                } else {
                    return (
                      <span className="lesson-description">{this.props.description}</span>
                    )
                }
            })()}

            {(() => {
                if (this.props.nextButton) {
                    return (

                      <Link to={this.props.nextButton}>
                          <button className="next-button solution-button mousePoint" type="submit">{this.props.pageTexts[6]}</button>
                          {/* <button className="next-button solution-button mousePoint" type="submit">Siguiente ejercicio</button> */}
                      </Link>

                    )
                }
            })()}


        </div>
    )
  }
}
