// /exam/:userId/:sectionId/:subLevelId/:examId
//  $userId,$sectionId, $subLevelId, $examId
import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class SimulationStore {
    getOne( sectionId, subLevelId, callback) {
        $.get(Constants.API_LINK + 'moodle-simulation/' + sectionId + '/' + subLevelId , (data) => {
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

let SimulationStoreInstance = new SimulationStore();

export default SimulationStoreInstance;
