import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class helpStore {
    getOne(callback) {
        $.get(Constants.API_LINK + 'moodle-help/', (data) => {
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

let helpStoreInstance = new helpStore();

export default helpStoreInstance;
