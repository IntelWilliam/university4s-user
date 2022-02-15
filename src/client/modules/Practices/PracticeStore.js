/*
 * LessonsStore
 */

import Constants from 'src/client/Constants/Constants'
import FluxStore from 'src/client/FluxStore';
import loginUser from 'src/client/modules/Login/'


class PracticeStore extends FluxStore {
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
   * Get the entire collection of subLevels.
   * @return {object}
   */
  getAll(param, callback) {
    $.ajax({
          method: "GET",
          url: Constants.API_LINK + 'practices/',
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
     * Get the entire collection of user lessons.
     * @return {object}
     */
    getUserPractices(userId, lessonId, callback) {

        $.ajax({
                method: "GET",
                url: Constants.API_LINK  + 'user/' + userId + '/lesson/'  + lessonId,
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

    /**
     * Unlock the next user section
     * @return {object}
     */
    unlockNextPractice(practiceId, lessonId, callback) {
        $.ajax({
                method: "PUT",
                url: Constants.API_LINK  + 'user/lesson/'  + lessonId + '/practice/'+practiceId,
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

let PracticeStoreInstance = new PracticeStore();

export default PracticeStoreInstance;
