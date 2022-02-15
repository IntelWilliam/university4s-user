/**
 * Dependencies
 */
import UserNotes from 'src/server/models/UserNotes'
/*
 * Esta función crea un nuevo registro
 */
export function createUserNotes({userId, sectionId, subLevelId, examId, totalQuestionsExam, totalQuestionsTrue, score}, callback) {
  UserNotes.create({
    userId,
    sectionId,
    subLevelId,
    examId,
    totalQuestionsExam,
    totalQuestionsTrue,
    score,
  }, (err, userNotes) => {
    if (err) return callback({ status: 500, error: err })
    callback(null, {
      status: 200,
      data: {
      userNotes: userNotes
      }
    })
  })
}
