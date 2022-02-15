import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class SubLevelsStore {
    getOne(id, callback) {
        $.get(Constants.API_LINK + 'moodle-sublevels/' + id, (data) => {
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

let SubLevelsStoreInstance = new SubLevelsStore();

export default SubLevelsStoreInstance;
