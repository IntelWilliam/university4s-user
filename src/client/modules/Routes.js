// modules/routes.js
import React from 'react'
import { Route } from 'react-router'
import Login from 'src/client/modules/Login'
import loginUser from 'src/client/modules/Login/'
import App from 'src/client/modules/App'
import MoodleMain from 'src/client/modules/Moodle/Main'
import Timeline from 'src/client/modules/timeline/timeline'
import Lesson from 'src/client/modules/Lessons/Lesson'
import PracticeLevel from 'src/client/modules/Moodle/Laboratories/Practices/PracticeLevel'
import PracticesLessons from 'src/client/modules/Moodle/Laboratories/Practices/Lessons/PracticesLessons'
import PracticesLesson from 'src/client/modules/Moodle/Laboratories/Practices/Lessons/Lesson/Lesson'
import Exercise from 'src/client/modules/Moodle/Laboratories/Practices/Lessons/Exercises/Exercise'
import PracticeComplete from 'src/client/modules/Moodle/Laboratories/Practices/Lessons/Exercises/ExerciseTypes/PracticeComplete'
import PracticeMark from 'src/client/modules/Moodle/Laboratories/Practices/Lessons/Exercises/ExerciseTypes/PracticeMark'
import PracticeOrder from 'src/client/modules/Moodle/Laboratories/Practices/Lessons/Exercises/ExerciseTypes/PracticeOrder'
import MoodleLessons from 'src/client/modules/Moodle/Lessons/Lessons'
import MoodleLesson from 'src/client/modules/Moodle/Lessons/Lesson/Lesson'
import Home from 'src/client/modules/home/Home'
import CreateAccount from 'src/client/modules/Moodle/CreateAccount/CreateAccount'
import Exams from 'src/client/modules/Moodle/Exams/Exams'
import ExamGrammar from 'src/client/modules/Moodle/Exams/ExamType/ExamGrammar/ExamGrammar'
import ExamReading from 'src/client/modules/Moodle/Exams/ExamType/ExamReading/ExamReading'
import ExamListening from 'src/client/modules/Moodle/Exams/ExamType/ExamListening/ExamListening'

import Video from 'src/client/modules/Moodle/Video/Video'
import VideoCat from 'src/client/modules/Moodle/Video/VideoCat'
import Videos from 'src/client/modules/Moodle/Video/Videos/Videos'
import InquiryBox from 'src/client/modules/Moodle/InquiryBox/InquiryBox'
import BoxChat from 'src/client/modules/Moodle/BoxChat/BoxChat'
import Help from 'src/client/modules/Moodle/Help/Help'
import Simulation from 'src/client/modules/Moodle/Simulation/Simulation'
import SimulationGrammar from 'src/client/modules/Moodle/Simulation/SimulationType/SimulationGrammar/SimulationGrammar'
import SimulationReading from 'src/client/modules/Moodle/Simulation/SimulationType/SimulationReading/SimulationReading'
import SimulationListening from 'src/client/modules/Moodle/Simulation/SimulationType/SimulationListening/SimulationListening'

import VideoChat from 'src/client/modules/Chat/VideoChat'
import VideoChatBuild from 'src/client/modules/ChatBuild/VideoChatBuild'
import Account from 'src/client/modules/Moodle/Account/Account'
import Calendar from 'src/client/modules/Moodle/Calendar/Calendar'

import PdfView from 'src/client/modules/Moodle/PdfView/PdfView'
import ChatCosmo from 'src/client/modules/Moodle/ChatCosmo/ChatCosmo'

import videoTutorial from 'src/client/modules/videoTutorial/videoTutorial'
import TermsAndConditions from 'src/client/modules/TermsAndConditions/TermsAndConditions'
import ValidateTerms from 'src/client/modules/TermsAndConditions/ValidateTerms'
import SwornDeclaration from 'src/client/modules/Moodle/SwornDeclaration/SwornDeclaration'

const USER_AREA = "/user-area/"
const WEB_PRACTICA = "practice-web/"
const PRACTICAS = "practices/"
const PRACTICAS_LECCIONES = "lessons/"
const PRACTICAS_LECCION = "lesson/"
const PRACTICAS_EJERCICIO = "exercise/"
const PRACTICAS_COMPLETAR = "practice-complete/"
const PRACTICAS_MARCAR = "practice-mark/"
const PRACTICAS_ORDENAR = "practice-order/"
const MOODLE = "course/"
const MOODLE_LECCIONES = "lessons/"
const MOODLE_LECCION = "lesson/"
const EXAMS = "exams/"
const GRAMMAR = "grammar/"
const READING = "reading/"
const LISTENING = "listening/"
const VIDEO_CHAT = "video-chat/"
const ACCOUNT = "account/"
const CALENDAR = "calendar/"
const SIMULATION = "simulation/"
const INQUIRYBOX= "inquirybox/"
const BOX_CHAT= "inquirybox/"
const HELP = "help/"
const VIDEO = "video/"
const CATEGORY = "category/"
const VIDEOS = "videos/"
const PDFVIEW = "pdfview/"
const CHAT_COSMO = "chat-cosmo"
const VALIDATE_TERMS = "validate-terms-conditions"
const SWORN_DECLARATION = "declaration"


// funcion que se llama para autorizar la entrada a un estado de la palicacion
function requireAuth(nextState, replace) {

  console.log("requireAuth    ", loginUser.loggedIn());
  if (!loginUser.loggedIn()) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    })
  }else if (!loginUser.acceptTerms()) {
    replace({
      pathname: '/validate-terms-conditions',
    })
  }

}

export default <Route>

    <Route path='/login' component={Login} />
    <Route path='/' component={Home} />
    <Route path='/newaccount' component={CreateAccount} />
    <Route path='/video-tutorial' component={videoTutorial} />
    <Route path='/terms-and-conditions' component={TermsAndConditions} />
    <Route component={ChatCosmo} path={USER_AREA + CHAT_COSMO} />
    <Route component={ValidateTerms} path={VALIDATE_TERMS}/>

    <Route component={ App }>
        <Route component={MoodleMain} path={USER_AREA} onEnter={requireAuth}/>
        <Route component={Account} path={USER_AREA + ACCOUNT} onEnter={requireAuth}/>
        <Route component={PracticeLevel} path={USER_AREA + PRACTICAS} onEnter={requireAuth}/>
        <Route component={PracticesLessons} path={USER_AREA + PRACTICAS + PRACTICAS_LECCIONES} onEnter={requireAuth}/>
        <Route component={PracticesLesson} path={USER_AREA + PRACTICAS + PRACTICAS_LECCIONES + PRACTICAS_LECCION} onEnter={requireAuth}/>
        <Route component={MoodleLessons} path={USER_AREA + MOODLE + MOODLE_LECCIONES} onEnter={requireAuth}/>
        <Route component={MoodleLesson} path={USER_AREA + MOODLE + MOODLE_LECCIONES + MOODLE_LECCION} onEnter={requireAuth}/>
        <Route component={Exercise} path={USER_AREA + PRACTICAS + PRACTICAS_LECCIONES + PRACTICAS_EJERCICIO} onEnter={requireAuth}/>
        <Route component={PracticeComplete} path={USER_AREA + PRACTICAS + PRACTICAS_LECCIONES + PRACTICAS_COMPLETAR} onEnter={requireAuth}/>
        <Route component={PracticeMark} path={USER_AREA + PRACTICAS + PRACTICAS_LECCIONES + PRACTICAS_MARCAR} onEnter={requireAuth}/>
        <Route component={PracticeOrder} path={USER_AREA + PRACTICAS + PRACTICAS_LECCIONES + PRACTICAS_ORDENAR} onEnter={requireAuth}/>
        <Route component={Timeline} path={USER_AREA + WEB_PRACTICA} onEnter={requireAuth}/>
        <Route component={Exams} path={USER_AREA + EXAMS} onEnter={requireAuth}/>
        <Route component={ExamGrammar} path={USER_AREA + EXAMS + GRAMMAR} onEnter={requireAuth}/>
        <Route component={ExamReading} path={USER_AREA + EXAMS + READING} onEnter={requireAuth}/>
        <Route component={ExamListening} path={USER_AREA + EXAMS + LISTENING} onEnter={requireAuth}/>

        <Route component={InquiryBox} path={USER_AREA + INQUIRYBOX + '/old'} onEnter={requireAuth}/>
        <Route component={BoxChat} path={USER_AREA + BOX_CHAT} onEnter={requireAuth}/>
        <Route component={Help} path={USER_AREA + HELP} onEnter={requireAuth}/>
        <Route component={Video} path={USER_AREA + VIDEO} onEnter={requireAuth}/>
        <Route component={VideoCat} path={USER_AREA + VIDEO + CATEGORY} onEnter={requireAuth}/>
        <Route component={Videos} path={USER_AREA + VIDEO + CATEGORY + VIDEOS} onEnter={requireAuth}/>
        <Route component={Simulation} path={USER_AREA + SIMULATION} onEnter={requireAuth}/>
        <Route component={SimulationGrammar} path={USER_AREA + SIMULATION + GRAMMAR} onEnter={requireAuth}/>
        <Route component={SimulationReading} path={USER_AREA + SIMULATION + READING} onEnter={requireAuth}/>
        <Route component={SimulationListening} path={USER_AREA + SIMULATION + LISTENING} onEnter={requireAuth}/>

        <Route component={Lesson} path={USER_AREA + WEB_PRACTICA + "level/:levelId/sub-level/:subLevelId/lesson/:id/levelName/:levelName"} onEnter={requireAuth}/>
        <Route component={Calendar} path={USER_AREA + CALENDAR } onEnter={requireAuth}/>

        <Route component={PdfView} path={USER_AREA + PDFVIEW } onEnter={requireAuth}/>
        <Route component={SwornDeclaration} path={USER_AREA + SWORN_DECLARATION + '/:type' } onEnter={requireAuth}/>
    </Route>
  <Route component={VideoChat} path={USER_AREA + VIDEO_CHAT} onEnter={requireAuth}/>
  <Route component={VideoChatBuild} path={USER_AREA + VIDEO_CHAT + 'test' } onEnter={requireAuth}/>
</Route>
