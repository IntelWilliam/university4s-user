import React from 'react';
import update from 'react/lib/update';
import LessonStore from 'src/client/modules/Lessons/LessonStore';
import PracticeStore from 'src/client/modules/Practices/PracticeStore';
import SectionStore from 'src/client/modules/Sections/SectionStore';
import PhrasesActions from 'src/client/modules/Phrases/PhrasesActions';
import LessonDetailItem from 'src/client/modules/Lessons/LessonDetailItem';
import PracticeItem from 'src/client/modules/Practices/PracticeItem';
import SectionItem from 'src/client/modules/Sections/SectionItem';
import Footer from 'src/client/modules/layout/footer';
import Constants from 'src/client/Constants/Constants';
import VocabularySectionItem from 'src/client/modules/Sections/VocabularySectionItem';
import SubLevelStore from 'src/client/modules/SubLevels/SubLevelStore';
import LevelStore from 'src/client/modules/Levels/LevelStore';
import GrammarSectionItem from 'src/client/modules/Sections/GrammarSectionItem';
import ConversationSectionItem from 'src/client/modules/Sections/ConversationSectionItem';
import FrontTextsActions from 'src/client/modules/FrontTexts/FrontTextsActions';

export default class Lesson extends React.Component {
  constructor() {
    super();
    this.state = {
      pageTexts: [],
      practiceSelected: null,
      name: '',
      description: '',
      showPractices: true,
      allPractices: [],
      allComments: [],
      allLessons: [],
      currentExercises: [],
      allSections: [],
      allInteractions: [],
      showParentTitle: false,
      commentsFinished: false,
      exercisesFinished: false,
      currentPractice: null,
      currentSection: null,
      parentTitle: '',
      translation: '',
      showCongratulate: '',
      sectionSelected: null,
      showError: '',
      currentCongratulate: 'very-good',
      currentError: 'ordena-oracion',
      isTeacher: false,
      congratulateWords: [
        'very-good',
        'well-done',
        'excellent-job',
        'congratulations',
        'you-could-do-it',
      ],
      user: JSON.parse(localStorage.user),
    };
    // se manda el contexto a los metodos
    this.loadData.bind(this);
    this.hideCongratulate = this.hideCongratulate.bind(this);
    this.hideError = this.hideError.bind(this);
  }

  static get contextTypes() {
    return {
      router: React.PropTypes.object.isRequired,
    };
  }

  loadPageTexts() {
    FrontTextsActions.getTexts('PRACTICE_WEB_LESSON', (err, body) => {
      // si llega un error
      if (err) {
        console.log('error', err);
      } else {
        // console.log('body.texts', body.texts);
        // se setea el mensaje a mostrar
        this.setState({ pageTexts: body.texts });
      }
    });
  }

  // se ejecuta antes de de montar el componente
  componentWillMount() {
    // console.log('lesson web practice');
    // se cargan los datos
    let curUser = JSON.parse(localStorage.user);
    this.setState({
      isTeacher: curUser.role == 'teacher' ? true : false,
    });
    this.loadPageTexts();
    this.loadData();
    this.goTop(0);
  }

  goTop(move) {
    $('html, body').animate({ scrollTop: move }, 'slow');
  }

  loadData() {
    let subLevelId = this.props.params.subLevelId;
    let lessonId = this.props.params.id;

    console.log('subLevelId: ', subLevelId);
    console.log('lessonId: ', lessonId);

    this.getUnlockedLessons(subLevelId, lessonId);
    this.loadLessons(subLevelId);
    this.loadSubLevels();
  }

  // funcion encargada de obtener las funciones desbloqueadas y visualizar si el usuario tiene acceso
  /**
   *
   * @param subLevelId, el subnivel en el que se encuentra el usuario
   * @param lessonId, la lección que se quiere validar que tenga desbloqueada
   */
  getUnlockedLessons(subLevelId, lessonId) {
    // console.log('lessonId', lessonId);
    // si hay usuario en el local storage, sino se debe desbloquear
    if (this.state.user) {
      LessonStore.getUserLessons(
        this.state.user._id,
        subLevelId,
        (err, response) => {
          if (err) {
            return;
          }

          let filteredLesson = [];
          // logica para saber si está bloqueada o desbloqueada una lección
          //freeAccess
          if (!this.state.isTeacher) {
            filteredLesson = response.unlockedLessons.filter(
              (unlockedLesson) => {
                return unlockedLesson == lessonId;
              }
            );
          }
          // si el array no está vacio se encontro que la lección si está desbloqueada
          //freeAccess
          // if (true) {
          if (this.state.isTeacher || filteredLesson.length > 0) {
            // se pide la info de la lección
            this.getLessonInfo(lessonId);
            this.getLessonPractices(lessonId);
          } else {
            this.getLessonInfo(lessonId);
            this.getLessonPractices(lessonId);
            //TODO NO TIENE LA LECCIÓN DESBLOQUEADA
          }
        }
      );
    }
  }

  getLessonInfo(lessonId) {
    // se pide la lección
    LessonStore.getOne(lessonId, (err, response) => {
      if (err) return;
      // se normaliza la respuesta
      var lesson = response.data[0];
      // se obtiene la traducción de la phrase
      PhrasesActions.getPhraseTranslations(
        lesson.phraseId,
        { phrases: lesson.phraseId },
        (err, phraseTranslations) => {
          if (phraseTranslations[0]) {
            this.setState({
              translation: phraseTranslations[0].phrases.phrase,
              parentTitle: phraseTranslations[0].phrases.phrase,
            });
          }
        }
      );
      this.setState({
        name: lesson.name,
        imageUrl: lesson.imageUrl,
        smallImage: lesson.smallImage,
        description: lesson.description,
      });
    });
  }

  /**
   * Metodo encargado de cargar todas las lecciones de un subnivel
   * @param subLevelId
   * @param page
   */
  loadLessons(subLevelId, page) {
    if (!page) {
      page = 1;
    }
    // se inician las variables necesarias para la pagina
    let params = {
      sortType: 1,
      sortField: 'position',
    };

    // se busca si es una busqueda filtrada para un lección
    params['subLevelId'] = subLevelId;
    // suponiendo que cada lección no tenga mas de 100 lecciones
    params['limit'] = 100;

    // pagina que se va a cargar
    params.page = page;
    // se piden todos los usuarios nuevamente
    LessonStore.getAll(params, (err, response) => {
      if (err) return;
      let enabledLessons = response.data.filter((lesson) => {
        return lesson.isEnabled;
      });
      this.setState({
        allLessons: enabledLessons,
      });
    });
  }

  loadSubLevels(page) {
    // si no viene pagina se inicia en 1
    if (!page) {
      page = 1;
    }
    // se inician las variables necesarias para la pagina
    let params = {
      sortType: 1,
      sortField: 'position',
    };

    // se busca si es una busqueda filtrada para un nivel
    params['levelId'] = this.props.params.levelId;
    // suponiendo que cada nivel no tenga mas de 100 subniveles
    params['limit'] = 100;

    // pagina que se va a cargar
    params.page = page;
    // se piden todos los subniveles
    SubLevelStore.getAll(params, (err, response) => {
      if (err) return;
      // se cambia el estado allSubLevels
      // solo se mostraran los niveles habilitados
      let enabledSubLevels = response.data.filter((subLevel) => {
        return subLevel.isEnabled;
      });
      this.setState({
        allSubLevels: enabledSubLevels,
      });
    });
  }

  // Se obtienen las practicas de una lección
  getLessonPractices(lessonId) {
    let params = {
      sortType: 1,
      sortField: 'position',
    };

    params['lessonId'] = lessonId;
    // suponiendo que cada nivel no tenga mas de 100 practicas
    params['limit'] = 100;
    // se piden todos los usuarios nuevamente
    PracticeStore.getAll(params, (err, response) => {
      if (err) return;
      let enabledPractices = response.data.filter((practice) => {
        return practice.isEnabled;
      });
      // se envian todas las practicas para la logica de desbloqueo
      this.unlockPractices(enabledPractices, lessonId, response);
    });
  }

  // metodo que se encarga de obtener las practicas desbloquedas por un usuario y comparar con
  // todas las practicas para desbloquear las que se debe
  unlockPractices(enabledPractices, lessonId, paginationData) {
    PracticeStore.getUserPractices(
      this.state.user._id,
      lessonId,
      (error, practiceResponse) => {
        let practices = [];
        if (practiceResponse) {
          let lastUnlockedIndex = practiceResponse.unlockedPractices.length - 1;
          // logica para saber si está bloqueada o desbloqueada una lección
          practices = enabledPractices.map((practice) => {
            practice.isUnlocked = false;
            practice.isFinished = false;
            practiceResponse.unlockedPractices.filter(
              (unlockedPractice, index) => {
                if (unlockedPractice == practice._id) {
                  if (index == lastUnlockedIndex) {
                    practice.isUnlocked = true;
                  } else {
                    practice.isUnlocked = true;
                    practice.isFinished = true;
                  }
                  return true;
                } else {
                  return false;
                }
              }
            );
            return practice;
          });
        } else {
          practices = enabledPractices.map((practice) => {
            practice.isUnlocked = false;
            practice.isFinished = false;

            return practice;
          });
        }
        // TODO la paginación puede ser incorrecta si hay practicas deshabilitadas
        this.setState({
          allPractices: practices,
          pagination: {
            total: paginationData.total,
            page: paginationData.page,
            pages: paginationData.pages,
          },
        });
      }
    );
  }

  getBounding(temp) {
    let element = document.getElementById('limite');
    let rect = element.getBoundingClientRect();
    if (temp == 'practice') {
      this.goTop(rect.bottom - window.innerHeight + $(window).scrollTop());
    } else {
      this.goTop(rect.bottom + $(window).scrollTop());
    }
  }

  /**
   * metodo que es invocado cuando se da click en un item de practica desbloqueado
   * se encarga de mostrar los datos de la practica previamente cargados
   * @param index
   */
  practiceDetails(index) {
    let practice = this.state.allPractices[index];
    this.setState({
      currentPractice: practice,
    });
    // se obtiene la traducción de la phrase
    PhrasesActions.getPhraseTranslations(
      practice.phraseId,
      { phrases: practice.phraseId },
      (err, phraseTranslations) => {
        if (phraseTranslations[0]) {
          this.setState({
            name: phraseTranslations[0].phrases.phrase,
          });
        }
      }
    );
    this.setState({
      translation: practice.name,
      showParentTitle: true,
      imageUrl: practice.imageUrl,
      description: practice.description,
    });
    this.getSections(practice._id);
    setTimeout(this.getBounding.bind(this, 'practice'), 400);
  }

  getSections(practiceId) {
    let params = {};
    // se filtra por practica
    params['practiceId'] = practiceId;

    // se piden todos los usuarios nuevamente
    SectionStore.getAll(params, (err, response) => {
      if (err) return;

      let enabledSections = response.data.filter((section) => {
        return section.isEnabled;
      });
      // se envian todas las practicas para la logica de desbloqueo
      this.unlockSections(enabledSections, practiceId, response);
    });
  }

  // metodo que se encarga de obtener las secciones desbloquedas por un usuario y comparar con
  // todas las secciones para desbloquear las que se debe
  unlockSections(enabledSections, practiceId, paginationData) {
    SectionStore.getUserSections(
      this.state.user._id,
      practiceId,
      (error, sectionResponse) => {
        let sections = [];
        // logica para saber si está bloqueada o desbloqueada una sección
        if (sectionResponse) {
          let lastUnlockedIndex = sectionResponse.unlockedSections.length - 1;
          // logica para saber si está bloqueada o desbloqueada una lección
          sections = enabledSections.map((section) => {
            section.isUnlocked = false;
            section.isFinished = false;
            sectionResponse.unlockedSections.filter(
              (unlockedSection, index) => {
                if (unlockedSection == section._id) {
                  if (index == lastUnlockedIndex) {
                    section.isUnlocked = true;
                  } else {
                    section.isUnlocked = true;
                    section.isFinished = true;
                  }
                  return true;
                } else {
                  return false;
                }
              }
            );
            return section;
          });
        } else {
          sections = enabledSections.map((section) => {
            section.isUnlocked = false;
            section.isFinished = false;

            return section;
          });
        }
        // TODO la paginación puede ser incorrecta si hay practicas deshabilitadas
        this.setState({
          allSections: sections,
          pagination: {
            total: paginationData.total,
            page: paginationData.page,
            pages: paginationData.pages,
          },
        });
      }
    );
  }
  showPractices() {
    this.setState({
      showPractices: !this.state.showPractices,
    });
  }

  // metodo que es invocado desde las secciones
  pictureComments(pictureComments) {
    this.setState({
      allComments: pictureComments,
    });
  }

  // metodo que es invocado desde las secciones y permite saber las interacciones asociadas a ejercicios
  // para poder posteriormente cargarlas
  currentExercises(currentExercises) {
    if (currentExercises.length > 0) {
      this.setState({
        currentExercises: currentExercises,
      });
    }
  }

  // metodo que es invocado desde las secciones y permite saber las interacciones ya sean de ejercicios o
  // comentarios para ser enviada a la seccion si es de tipo grammar
  currentInteractions(currentInteractions) {
    // console.log('currentInteractions', currentInteractions);

    this.setState({
      allInteractions: currentInteractions,
    });
  }

  commentsFinished() {
    this.setState(
      { commentsFinished: true },
      (() => {
        this.checkIsAllFinished();
      }).bind(this)
    );
  }

  // aqui simplemente se actualiza el estado a que ya terminaron los ejercicios ya que el
  // componente exerciseItem es el encargado de validar que ya acabaron todos los ejercicios
  exercisesFinished() {
    this.setState(
      { exercisesFinished: true },
      (() => {
        this.checkIsAllFinished();
      }).bind(this)
    );
  }

  checkIsAllFinished() {
    if (this.state.currentSection.name == Constants.SECTION.VOCABULARY) {
      if (this.state.commentsFinished && this.state.exercisesFinished) {
        this.unlockNextSection();
      }
    } else if (
      (this.state.currentSection.name == Constants.SECTION.GRAMMAR ||
        this.state.currentSection.name == Constants.SECTION.PRONUNCIATION ||
        this.state.currentSection.name == Constants.SECTION.CONVERSATION) &&
      this.state.exercisesFinished
    ) {
      this.unlockNextSection();
    }
  }

  unlockNextSection() {
    console.log('unlockNextSection');
    // se envia la practica y la seccion a ser desbloqueada
    let currentSectionIndex = this.state.allSections.indexOf(
      this.state.currentSection
    );
    console.log('currentSectionIndex', currentSectionIndex);
    console.log(
      'this.state.allSections.length - 1',
      this.state.allSections.length - 1
    );
    if (currentSectionIndex == this.state.allSections.length - 1) {
      this.unlockNextPractice();
    } else {
      SectionStore.unlockNextSection(
        this.state.currentPractice._id,
        this.state.currentSection._id,
        (err, response) => {
          if (err) console.log(err);
          // se busca el indice de la sección que se terminó
          // se compara si la sección es la ultima es por que se debe desbloquear la siguiente practica
          this.setState(
            update(this.state, {
              allSections: {
                [currentSectionIndex + 1]: {
                  isUnlocked: {
                    $set: true,
                  },
                },
                [currentSectionIndex]: {
                  isFinished: {
                    $set: true,
                  },
                  isUnlocked: {
                    $set: false,
                  },
                },
              },
              commentsFinished: {
                $set: false,
              },
              exercisesFinished: {
                $set: false,
              },
            }),
            (() => {
              this.refs[currentSectionIndex + 1].loadInteractions();
              this.goTop(0);
            }).bind(this)
          );
          // solo si finalizó la practica this.loadData();
        }
      );
    }
  }

  unlockNextPractice() {
    console.log('unlockNextPractice');
    // se busca el indice de la sección que se terminó
    let currentPracticeIndex = this.state.allPractices.indexOf(
      this.state.currentPractice
    );
    // se compara si la sección es la ultima es por que se debe desbloquear la siguiente practica
    console.log('currentPracticeIndex', currentPracticeIndex);
    console.log(
      'this.state.allPractices.length - 1',
      this.state.allPractices.length - 1
    );
    if (currentPracticeIndex == this.state.allPractices.length - 1) {
      this.unlockNextLesson();
    } else {
      // se envia la practica y la seccion a ser desbloqueada
      console.log(
        'this.state.currentPractice._id',
        this.state.currentPractice._id
      );
      console.log('this.props.params.id', this.props.params.id);
      PracticeStore.unlockNextPractice(
        this.state.currentPractice._id,
        this.props.params.id,
        (err, response) => {
          if (err) console.log(err);
          this.setState(
            update(this.state, {
              allPractices: {
                [currentPracticeIndex + 1]: {
                  isUnlocked: {
                    $set: true,
                  },
                },
                [currentPracticeIndex]: {
                  isFinished: {
                    $set: true,
                  },
                  isUnlocked: {
                    $set: true,
                  },
                },
              },
              commentsFinished: {
                $set: false,
              },
              exercisesFinished: {
                $set: false,
              },
              allSections: {
                $set: [],
              },
              allComments: {
                $set: [],
              },
              allInteractions: {
                $set: [],
              },
              currentExercises: {
                $set: [],
              },
              currentSection: {
                $set: null,
              },
              name: {
                $set: 'Congratulations!',
              },
              description: {
                $set: `has completado exitosamente la práctica ${
                  this.state.allPractices[currentPracticeIndex].name
                } continua con la practica ${
                  this.state.allPractices[currentPracticeIndex + 1].name
                }`,
              },
              translation: {
                $set: 'Felicitaciones!',
              },
            }),
            (() => {
              this.goTop(0);
            }).bind(this)
          );
          // solo si finalizó la practica this.loadData();
        }
      );
    }
  }

  unlockNextLesson() {
    console.log('unlockNextLesson');
    let lastLessonId =
      this.state.allLessons[this.state.allLessons.length - 1]._id;
    let currentLessonId = this.props.params.id;
    // se compara si la sección es la ultima es por que se debe desbloquear la siguiente practica
    console.log('currentLessonId', currentLessonId);
    console.log('lastLessonId', lastLessonId);
    if (currentLessonId == lastLessonId) {
      this.unlockNextSubLevel();
    } else {
      // se envia la practica y la seccion a ser desbloqueada
      LessonStore.unlockNextLesson(
        this.props.params.subLevelId,
        currentLessonId,
        (err, response) => {
          if (err) console.log(err);
          // se redirecciona al usuario a la pagina principal
          this.context.router.push('/user-area/practice-web/');
        }
      );
    }
  }

  unlockNextSubLevel() {
    console.log('unlockNextSubLevel');
    let lastSubLevelId =
      this.state.allSubLevels[this.state.allSubLevels.length - 1]._id;
    let currentSubLevelId = this.props.params.subLevelId;
    console.log('lastSubLevelId', lastSubLevelId);
    console.log('currentSubLevelId', currentSubLevelId);
    // se compara si la sección es la ultima es por que se debe desbloquear la siguiente practica
    if (lastSubLevelId == currentSubLevelId) {
      this.unlockNextLevel();
    } else {
      // se envia la practica y la seccion a ser desbloqueada
      SubLevelStore.unlockNextSubLevel(
        this.props.params.levelId,
        currentSubLevelId,
        (err, response) => {
          if (err) console.log(err);
          // se redirecciona al usuario a la pagina principal
          //this.context.router.push('/');
        }
      );
    }
  }

  unlockNextLevel() {
    console.log('unlockNextLevel');
    // se envia la practica y la seccion a ser desbloqueada
    LevelStore.unlockNextLevel(this.props.params.levelId, (err, response) => {
      if (err) console.log(err);
      // se redirecciona al usuario a la pagina principal
      this.context.router.push('/user-area/practice-web/');
    });
  }

  sectionSelected(index) {
    //
    // console.log('index', index);
    let section = this.state.allSections[index];
    this.setState({
      sectionSelected: index,
      currentSection: section,
    });
    setTimeout(this.getBounding.bind(this), 400);
  }

  toCongratulate() {
    let currentCongratulate =
      this.state.congratulateWords[
        Math.floor(Math.random() * this.state.congratulateWords.length)
      ];
    this.setState({
      currentCongratulate: currentCongratulate,
      showCongratulate: 'show-congratulate',
      showError: '',
    });
    setTimeout(this.hideCongratulate, 3000);
  }

  hideCongratulate() {
    this.setState({
      showCongratulate: '',
    });
  }

  toError(text) {
    this.setState({
      currentError: text,
      showError: 'show-congratulate',
      showCongratulate: '',
    });
    setTimeout(this.hideError, 3000);
  }

  hideError() {
    this.setState({
      showError: '',
    });
  }

  practiceSelected(select) {
    // console.log('select', select);
    this.setState({
      practiceSelected: select,
      sectionSelected: null,
    });
  }

  // secuencia para armar las interacciones de conversacion [N interaccion, learner, cosmo]

  // sec1
  // 1		c
  // 1	a
  // 2		c
  // 2	a
  // 1		c
  // 2	a
  // 1	a
  // 2		c
  // 1	a
  // 2	a

  // sec2
  // 0		c
  // 1	a
  // 2		c
  // 3	a
  // 4		c
  // 5	a

  // sec3
  // 0	a
  // 1	a
  // 2	a
  // 3	a
  // 4	a
  // 5	a

  // secuencia final
  // sec1[0,1]
  // sec1[2,3]
  // sec1[4,5]
  // sec2[todas]
  // sec3[todas estudiante] repite 2 vces
  // sec3[todas estudiante]

  // createInteractions - conversation
  createInteractions() {
    let commentInteraction = [];

    // Se filtran las interacciones de tipo comentario
    for (let interaction of this.state.allInteractions) {
      if (
        interaction.interactionType == 1 ||
        interaction.interactionType == 2
      ) {
        commentInteraction.push(interaction);
      }
    }

    let newInteractions = [];

    // deben haber almenos 2 interacciones de tipo comentario para generar la conversacion
    if (commentInteraction.length >= 2) {
      // se genera la primera la primera secuencia para cada par de interacciones
      for (var index = 0; index < commentInteraction.length; ) {
        // se verifica que exista la posicion actual y la proxima parapoder enviar un par de interacciones (index, index+1)
        if (commentInteraction[index + 1] != null) {
          newInteractions = this.sequence1(
            JSON.parse(JSON.stringify(commentInteraction[index])),
            JSON.parse(JSON.stringify(commentInteraction[index + 1])),
            newInteractions
          );
        } else {
          break;
        }
        index += 2;
      }

      // se genera la secuencia dos
      newInteractions = this.sequence2(newInteractions, commentInteraction);
      newInteractions = this.sequence3(newInteractions, commentInteraction);
    }

    return newInteractions;
  }

  newObjConst(interaction, author, type) {
    this.author = author;
    this.interactionType = type;
    this.name = interaction.name;

    this.description = author == 1 ? 'Cosmo dice:' : 'Alumno dice:';

    if (interaction.castell) this.castell = interaction.castell;

    this.phraseId = interaction.phraseId;
    this.position = 999;
    this.sectionId = interaction.sectionId;
  }

  sequence1(index1, index2, newCurrent) {
    // newObjConst(interaction, author, type, position)

    // autor 1 - cosmo, autor 2 - estudiante

    // 1		c
    // 1	a
    var temp1 = new this.newObjConst(index1, 1, 2);
    var temp2 = new this.newObjConst(index1, 2, 3);

    temp1.reactionId = temp2;
    newCurrent.push(temp1);

    // 2		c
    // 2	a
    temp1 = new this.newObjConst(index2, 1, 2);
    temp2 = new this.newObjConst(index2, 2, 3);

    temp1.reactionId = temp2;
    newCurrent.push(temp1);

    // 1		c
    // 2	a
    temp1 = new this.newObjConst(index1, 1, 2);
    temp2 = new this.newObjConst(index2, 2, 3);

    temp1.reactionId = temp2;
    newCurrent.push(temp1);

    // 1	a
    // 2		c
    temp1 = new this.newObjConst(index1, 2, 2);
    temp2 = new this.newObjConst(index2, 1, 3);

    temp1.reactionId = temp2;
    newCurrent.push(temp1);

    // 1	a
    // 2	a
    temp1 = new this.newObjConst(index1, 2, 1);
    newCurrent.push(temp1);
    temp2 = new this.newObjConst(index2, 2, 1);
    newCurrent.push(temp2);

    return newCurrent;
  }

  sequence2(newCurrent, allComments) {
    for (var index = 0; index < allComments.length; ) {
      if (allComments[index + 1] != null) {
        let temp1 = new this.newObjConst(allComments[index], 1, 2);
        let temp2 = new this.newObjConst(allComments[index + 1], 2, 3);

        temp1.reactionId = temp2;
        newCurrent.push(temp1);
      }
      index += 2;
    }
    return newCurrent;
  }

  sequence3(newCurrent, allComments) {
    for (var index = 0; index < allComments.length; index++) {
      let temp1 = new this.newObjConst(allComments[index], 2, 1);
      newCurrent.push(temp1);
    }

    return newCurrent;
  }

  render() {
    if (this.state.allSections.length >= 4) {
      if (this.state.allSections[2].name == 'Pronunciation') {
        var pronunciationId = this.state.allSections[2]._id;
      }
    }

    let classRowgo = this.state.showPractices ? 'rowgo active' : 'rowgo';
    return (
      <div style={{ background: '#F6F7F7' }}>
        <div className='col-xs-12 header-image-container'>
          <div className='row'>
            <div className='container'>
              <div className='col-xs-12 col-md-6 presentation-lesson'>
                <div className='row'>
                  <div className='col-xs-12 front'>
                    <LessonDetailItem
                      levelName={this.props.params.levelName}
                      pageTexts={this.state.pageTexts}
                      showParentTitle={this.state.showParentTitle}
                      parentTitle={this.state.parentTitle}
                      name={this.state.name}
                      description={this.state.description}
                      translation={this.state.translation}
                    />
                    <div className='row'>
                      <div className='col-xs-12 col-md-4'>
                        <div className='row'>
                          <div
                            className='col-xs-12 front-flex mousePoint'
                            onClick={this.showPractices.bind(this)}
                          >
                            <div className='practices'>
                              {this.state.pageTexts[2]}
                            </div>
                            {/* <div className="practices">Practices</div> */}
                            <div className={classRowgo}>
                              <img src='/images/rowgo.png' />
                            </div>
                          </div>
                        </div>
                      </div>
                      {(() => {
                        if (this.state.showPractices) {
                          return (
                            <div className='col-xs-12 col-md'>
                              <div className='row'>
                                {this.state.allPractices.map(
                                  (practice, index) => {
                                    return (
                                      <PracticeItem
                                        pageTexts={this.state.pageTexts}
                                        isTeacher={this.state.isTeacher}
                                        key={index}
                                        practiceIndex={index + 1}
                                        description={practice.description}
                                        onPracticeClicked={this.practiceDetails.bind(
                                          this,
                                          index
                                        )}
                                        practiceSelected={this.practiceSelected.bind(
                                          this
                                        )}
                                        itemSelected={
                                          this.state.practiceSelected
                                        }
                                        isUnlocked={practice.isUnlocked}
                                        name={practice.name}
                                        id={practice._id}
                                        isEnabled={practice.isEnabled}
                                      />
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-xs-12 section-container'>
              <div className='row' id='limite'>
                {this.state.allSections.map((section, index) => {
                  let changeId = section._id;

                  {
                    /*para cargar las interacciones de pronunciacion en conversacion*/
                  }
                  if (section.name == 'Conversation' && pronunciationId) {
                    changeId = pronunciationId;
                  }

                  return (
                    <SectionItem
                      pageTexts={this.state.pageTexts}
                      key={index}
                      number={index}
                      isTeacher={this.state.isTeacher}
                      description={section.description}
                      name={section.name}
                      ref={index}
                      pictureComments={this.pictureComments.bind(this)}
                      currentExercises={this.currentExercises.bind(this)}
                      currentInteractions={this.currentInteractions.bind(this)}
                      onSectionClick={this.sectionSelected.bind(this, index)}
                      sectionSelected={this.state.sectionSelected}
                      isFinished={section.isFinished}
                      isUnlocked={section.isUnlocked}
                      id={changeId}
                      isEnabled={section.isEnabled}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        {(() => {
          if (this.state.currentSection) {
            if (
              this.state.currentSection.name == Constants.SECTION.VOCABULARY
            ) {
              console.log(
                'this.state.allComments VOCABULARY',
                this.state.allComments
              );
              return (
                <VocabularySectionItem
                  allComments={this.state.allComments}
                  commentsFinished={this.commentsFinished.bind(this)}
                  currentExercises={this.state.currentExercises}
                  toCongratulate={this.toCongratulate.bind(this)}
                  showFailMessage={this.toError.bind(this)}
                  exercisesFinished={this.exercisesFinished.bind(this)}
                  pageTexts={this.state.pageTexts}
                />
              );
            } else if (
              this.state.currentSection.name == Constants.SECTION.GRAMMAR ||
              this.state.currentSection.name == Constants.SECTION.PRONUNCIATION
            ) {
              return (
                <GrammarSectionItem
                  allInteractions={this.state.allInteractions}
                  toCongratulate={this.toCongratulate.bind(this)}
                  showFailMessage={this.toError.bind(this)}
                  exercisesFinished={this.exercisesFinished.bind(this)}
                  pageTexts={this.state.pageTexts}
                />
              );
            } else if (
              this.state.currentSection.name == Constants.SECTION.CONVERSATION
            ) {
              let newInteractions = this.createInteractions();
              {
                /*let newInteractions = this.state.allInteractions*/
              }
              console.log('newInteractions', newInteractions);
              return (
                <ConversationSectionItem
                  allInteractions={newInteractions}
                  showFailMessage={this.toError.bind(this)}
                  toCongratulate={this.toCongratulate.bind(this)}
                  exercisesFinished={this.exercisesFinished.bind(this)}
                />
              );
            }
          }
        })()}

        {this.state.currentSection && (
          <div
            className='col-xs-12 action-container'
            style={{ paddingRight: '3rem' }}
          >
            <button
              className='solution-button mousePoint back-button'
              onClick={this.unlockNextSection.bind(this)}
            >
              Pasar al siguiente ejercicio
            </button>
          </div>
        )}

        <Footer />
        <div className={'to-congratulate ' + this.state.showCongratulate}>
          <div className='col-xs-12 congrat-image'>
            <img
              className='to-congratulate-img'
              src={'/images/' + this.state.currentCongratulate + '.png'}
            />
          </div>
        </div>
        <div className={'to-congratulate ' + this.state.showError}>
          <div className='col-xs-12 congrat-image'>
            <img
              className='to-congratulate-img'
              src={'/images/' + this.state.currentError + '.png'}
            />
          </div>
        </div>
      </div>
    );
  }
}
