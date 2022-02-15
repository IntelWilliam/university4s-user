/*
 * Esta clase permite difinir las acciones o el controlador
 */

import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class PhrasesActions {


    /**
     * Get the entire collection of Phrases.
     * @return {object}
     */
    getPhraseTranslations(id, phraseTranslation, callback) {

        $.ajax({
                method: "GET",
                url: Constants.API_LINK + 'phrases/' + id + '/phrase', phraseTranslation,
                xhrFields: {
                    withCredentials: true
                }
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
let PhrasesActionsInstance = new PhrasesActions();
export default PhrasesActionsInstance;
