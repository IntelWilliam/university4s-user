/*
 * LessonsStore
 */

import Constants from 'src/client/Constants/Constants'
import FluxStore from 'src/client/FluxStore';
import loginUser from 'src/client/modules/Login/'

class LevelStore extends FluxStore {
  constructor() {
    super()
  }

  /**
   * Delete a lesson item.
   * @param  {string} id
   */
  destroy(id) {
    // espacio reservado para eliminar un leccion siempre recomendado eliminado logico
  }

  /**
   * Get the entire collection of lessons.
   * @return {object}
   */
  getAll(param, callback) {
    $.ajax({
          method: "GET",
          url: Constants.API_LINK + 'levels/',
          xhrFields: {
            withCredentials: true
          },
          data: param,
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

    /**
     * Unlock the next user section
     * @return {object}
     */
    unlockNextLevel(levelId, callback) {
        $.ajax({
                method: "PUT",
                url: Constants.API_LINK  + 'user/level/'+ levelId,
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

let LevelStoreInstance = new LevelStore();

export default LevelStoreInstance;
