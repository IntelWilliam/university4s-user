import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class LessonStore {
    getSections(param, callback) {
        $.get(Constants.API_LINK + 'moodle-sections/', param, (data) => {
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

    getEntries(param, callback) {
          // se piden los nivels del sistema
          $.get(Constants.API_LINK + 'moodle-entries/', param, (data) => {
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

let LessonStoreInstance = new LessonStore();

export default LessonStoreInstance;
