// /exam/:userId/:sectionId/:subLevelId/:examId
//  $userId,$sectionId, $subLevelId, $examId
import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class ExamStore {
    getOne(userId, sectionId, subLevelId, examId,  callback) {
        $.get(Constants.API_LINK + 'moodle-exam/' + userId + '/' + sectionId + '/' + subLevelId + '/'  + examId, (data) => {
            callback(null, data)
        }).fail((err) => {
            // si hay error de autorización se desloguea
            if (err.status == 401) {
                loginUser.logout((resp) => {
                    callback(err)
                })
            } else {
                callback(err)
            }
        })
    }

    updateExam(studentId, examId, tries, result, callback) {
      //siempre hace actualiza el intento, modificar el endpoint (moodle-examUpdate) para guardat una nota nueva.
      $.post(Constants.API_LINK + 'moodle-examUpdate/', {
        studentId: studentId,
        examId: examId,
        tries: tries,
        result: result
      }, (response) => {
        callback(response);
      }).fail((err) => {
        console.log(err)
        callback(err)
      })

    }

}

let ExamStoreInstance = new ExamStore();

export default ExamStoreInstance;
