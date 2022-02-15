/*
 * InteractionsStore
 */
import Constants from 'src/client/Constants/Constants'
import FluxStore from 'src/client/FluxStore';
import loginUser from 'src/client/modules/Login/'


class InteractionStore extends FluxStore {
    constructor() {
        super()
    }

    /**
     * Get the entire collection of interactions.
     * @return {object}
     */
    getAll(param, callback) {
        $.ajax({
                method: "GET",
                url: Constants.API_LINK + 'interactions/',
                xhrFields: {
                    withCredentials: true
                },
                data: param
            })
            .done(function( body ) {
                callback(null, body)
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

let InteractionStoreInstance = new InteractionStore();

export default InteractionStoreInstance;
