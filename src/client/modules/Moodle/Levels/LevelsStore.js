import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class LevelsStore {
    getAll(callback) {
        $.get(Constants.API_LINK + 'moodle-levels/', (data) => {
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

let LevelsStoreInstance = new LevelsStore();

export default LevelsStoreInstance;
