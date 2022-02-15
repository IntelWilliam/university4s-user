import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class LessonsStore {
    getOne(id, callback) {
        $.get(Constants.API_LINK + 'moodle-lessons/' + id, (data) => {
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

    getImage(id, callback) {
      $.get(Constants.API_LINK + 'moodle-lessonsEdit/' + id, (data) => {
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

let LessonsStoreInstance = new LessonsStore();

export default LessonsStoreInstance;
