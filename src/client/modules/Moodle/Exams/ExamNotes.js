import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class ExamNotes {
  getOne(userId, sectionId, subLevelId, examId, totalQuestionsExam, totalQuestionsTrue, score,  callback) {
    $.post(
      Constants.API_LINK + 'userNotes',
      {userId, sectionId, subLevelId, examId, totalQuestionsExam, totalQuestionsTrue, score},
      (data) => {
        callback(null, data);
      }
    ).fail((err) => {
      if (err.status == 401) {
        loginUser.logout((resp) => {
          callback(err)
        })
      } else {
        callback(err)
      }
    })
  }
}

let ExamNotesInstance = new ExamNotes();

export default ExamNotesInstance;
