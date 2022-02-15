// type 1, 2 , 3 - “Fill”, “Choose” & “Unscramble”
// /practice_type_by_lesson/:lessonId?type=:number
import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class ExerciseStore {
    getAll(id, type, callback) {
        $.get(Constants.API_LINK + 'moodle-practiceByType/' + id + '/type/' + type, (data) => {
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
}

let ExerciseStoreInstance = new ExerciseStore();

export default ExerciseStoreInstance;
