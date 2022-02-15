import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class VideosStore {
    getByCat(subLevelId, category, callback) {
        $.get(Constants.API_LINK + 'moodle-videos/' + subLevelId + '/' + category, (data) => {
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

let VideosStoreInstance = new VideosStore();

export default VideosStoreInstance;
