// type 1, 2 , 3 - “Fill”, “Choose” & “Unscramble”
// /practice_detail/:lessonId?type=:typeNumber&number=:number ("number = atributo llamado “order”")
import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class PracticeDetailStore {
    getOne(lessonId, type, exerId,  callback) {
        $.get(Constants.API_LINK + 'moodle-practiceByType/' + lessonId + '/type/' + type + '/code/' + exerId, (data) => {
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

let PracticeDetailStoreInstance = new PracticeDetailStore();

export default PracticeDetailStoreInstance;
