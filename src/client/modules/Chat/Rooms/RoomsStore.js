import FluxStore from 'src/client/FluxStore';
import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class RoomsStore extends FluxStore {
    constructor() {
        super()
    }


    /**
     * Get the entire collection of TODOs.
     * @return {object}
     */
    getTeacherCalls(callback) {
        // se piden los usuarios del sistema
        $.get(Constants.API_LINK + 'rooms/', (responseData) => {
            callback(null,responseData.data.rooms);
        }).fail((err) => {

                // callback(err)

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

let RoomStoreInstance = new RoomsStore();


export default RoomStoreInstance;
