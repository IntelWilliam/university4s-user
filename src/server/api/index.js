import express from 'express'
import path from 'path'
import language from 'src/server/api/language'
import user from 'src/server/api/user'

import moodleUser from 'src/server/api/moodle-user'
import moodleExam from 'src/server/api/moodle-exam'
import moodleSimulation from 'src/server/api/moodle-simulation'
import moodleExamUpdate from 'src/server/api/moodle-examUpdate'
import moodlePassUpdate from 'src/server/api/moodle-passUpdate'
import moodleLevels from 'src/server/api/moodle-levels'
import moodleHelp from 'src/server/api/moodle-help'
import moodleUnlock from 'src/server/api/moodle-unlock'
import moodleVideos from 'src/server/api/moodle-videos'
import moodleSubLevels from 'src/server/api/moodle-sublevels'
import moodlePracticeByType from 'src/server/api/moodle-PracticeByType'
import moodleLessons from 'src/server/api/moodle-lessons'
import moodleLessonsEdit from 'src/server/api/moodle-lessonsEdit'
import moodleEntry from 'src/server/api/moodle-entry'
import moodleSection from 'src/server/api/moodle-section'
import moodleLocation from 'src/server/api/moodle-location'
import moodleCheckEmail from 'src/server/api/moodle-checkEmail'
import moodleNewAccount from 'src/server/api/moodle-newAccount'
import moodleBuyerData from 'src/server/api/moodle-buyer-data'
import exams from 'src/server/api/exam'

import teacherRating from 'src/server/api/TeacherRating'

import audioBook from 'src/server/api/audio-book'

import webPracticeUnlock from 'src/server/api/webPracticeUnlock'
import newsLetter from 'src/server/api/newsLetter'
import passRecovery from 'src/server/api/passRecovery'
import level from 'src/server/api/level'
import sublevel from 'src/server/api/sublevel'
import lesson from 'src/server/api/lesson'
import section from 'src/server/api/section'
import interaction from 'src/server/api/interaction'
import phrase from 'src/server/api/phrase'
import word from 'src/server/api/word'
import practice from 'src/server/api/practice'
import userData from 'src/server/api/userdata'
import exercise from 'src/server/api/exercise'
import driveApi from 'src/server/api/driveApi'
import room from 'src/server/api/rooms'
import userChat from 'src/server/api/users'
import chat from 'src/server/api/chats'
import board from 'src/server/api/boards'
import labAccess from 'src/server/api/lab-access'

import answerCapacity from 'src/server/api/AnswerCapacity'
import chatBox from 'src/server/api/chatBox'
import chatCosmo from 'src/server/api/chatCosmo'

import event from 'src/server/api/event'
import consult from 'src/server/api/consult'
import entities from 'src/server/api/entities'

import frontTexts from 'src/server/api/front-texts'

import uploadFileChat from 'src/server/api/uploadFileChat'

import newUserFromDev from 'src/server/api/newUserFromDev'
import newReportFromDev from 'src/server/api/newReportFromDev'
import testEndP from 'src/server/api/testEndP'
import chatsOffLine from 'src/server/api/chatsOffLine'

import acceptTerms from 'src/server/api/accept-terms'
import userNotes from 'src/server/api/userNotes'

import incident from 'src/server/api/incident'
import userIncident from 'src/server/api/userIncident'
import uploadFileIncident from 'src/server/api/uploadFileIncident'
import welcomeMessage from 'src/server/api/welcomeMessage'
import watsapMessage from 'src/server/api/watsapMessage'

// import accountCreation from 'src/server/api/account-creation'


// se crea el nuevo router para almacenar rutas
const router = express.Router()

router.use('/audios-books', audioBook)
router.use('/moodle-newAccount', moodleNewAccount)
router.use('/moodle-buyer-data', moodleBuyerData)

// verifica si el email ya existe en DEV
router.use('/moodle-checkEmail', moodleCheckEmail)

// recibe peticiones de dev
router.use('/webpractice-unlock', webPracticeUnlock)

router.use('/newsletter', newsLetter)

router.use('/pass-recovery', passRecovery)

router.use('/front-texts', frontTexts)

router.use('/upload-file-chat', uploadFileChat)

router.use('/new-user-from-dev', newUserFromDev)

router.use('/new-report-from-dev', newReportFromDev)

router.use('/testEndP', testEndP)
router.use('/entities', entities)
router.use('/videos', express.static(path.join("/mnt", "akron-volume", "Finales-Akron"), {fallthrough: false}))
router.use('/new-books-curse', express.static(path.join("/mnt", "akron-volume", "Nuevos_Libros_Curso"), {fallthrough: false}))
// router.use('/new-books-curse', express.static(path.join("/Users", "stbanlol", "Documents", "libros"), {fallthrough: false}))
router.use('/event', event)
router.use('/moodle-lessons', moodleLessons)
router.use('/moodle-location', moodleLocation)
router.use('/chat-cosmo', chatCosmo)
router.use('/incident', incident)
router.use('/userIncident', userIncident)
router.use('/upload-file-incident', uploadFileIncident)
router.use('/file-chat', express.static(path.join("/mnt", "akron-volume", "uploads_chat" ) , {fallthrough: false}))
router.use('/welcome-message', welcomeMessage)


// router.use('/account-creation', accountCreation)

// se valida que el usuario esté loguaedo, si no se responde con 401
// router.use((req, res, next) => {
//   if (req.user === undefined)
//     return res.status(401).send('Unauthorized')
//   next()
// })

router.use('/privados/videos', express.static(path.join("/mnt", "akron-volume", "Finales-Akron"), {fallthrough: false}))
router.use('/accept-terms', acceptTerms)
router.use('/chats-off-line', chatsOffLine)
router.use('/consult', consult)
router.use('/moodle-unlock', moodleUnlock)
router.use('/user', userData)
router.use('/examaudio', express.static(path.join("/var", "www", "html", "dev.ibceducacion.com", "public", "uploads", 'exams')))
router.use('/simulationaudio', express.static(path.join("/var", "www", "html", "dev.ibceducacion.com", "public", "uploads", 'simulators')))
router.use('/pdf-solution', express.static(path.join("/mnt", "akron-volume", "pdf_solucionario" ) , {fallthrough: false}))
router.use('/languages', language)
router.use('/userAccount', user)
router.use('/levels', level)
router.use('/subLevels', sublevel)
router.use('/lessons', lesson)
router.use('/sections', section)
router.use('/interactions', interaction)
router.use('/phrases', phrase)
router.use('/words', word)
router.use('/practices', practice)
router.use('/exercises', exercise)
router.use('/exams', exams)
router.use('/moodle-levels', moodleLevels)
router.use('/moodle-help', moodleHelp)
router.use('/moodle-practiceByType', moodlePracticeByType)
router.use('/moodle-user', moodleUser)
router.use('/moodle-exam', moodleExam)
router.use('/moodle-simulation', moodleSimulation)
router.use('/moodle-examUpdate', moodleExamUpdate)
router.use('/moodle-passUpdate', moodlePassUpdate)
router.use('/moodle-sublevels', moodleSubLevels)
router.use('/moodle-videos', moodleVideos)
router.use('/moodle-lessonsEdit', moodleLessonsEdit)
router.use('/moodle-entries', moodleEntry)
router.use('/moodle-sections', moodleSection)
router.use('/driveApi', driveApi)
router.use('/rooms', room)
router.use('/users', userChat)
router.use('/chats', chat)
router.use('/boards', board)
router.use('/lab-access', labAccess)
router.use('/answer-capacity', answerCapacity)
router.use('/chat-box', chatBox)
router.use('/teacher-rating', teacherRating)
router.use('/userNotes', userNotes)
router.use('/watsap', watsapMessage )

// se exporta el nuevo router
export default router
