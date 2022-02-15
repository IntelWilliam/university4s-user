import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class CheckEmailStore {
    checkOne(email, callback) {
        $.get(Constants.API_LINK + 'moodle-checkEmail/' + email, (data) => {
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

let CheckEmailStoreInstance = new CheckEmailStore();

export default CheckEmailStoreInstance;
