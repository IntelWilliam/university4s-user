/*
 * LessonsStore
 */

import Constants from 'src/client/Constants/Constants'
import FluxStore from 'src/client/FluxStore';
import loginUser from 'src/client/modules/Login/'


class LessonStore extends FluxStore {
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
          url: Constants.API_LINK + 'lessons/',
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
  getUserLessons(userId, subLevelId, callback) {
    $.ajax({
          method: "GET",
          url: Constants.API_LINK  + 'user/' + userId + '/sub-level/'  + subLevelId,
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
   * Get the one lesson.
   * @return {object}
   */
  getOne(id, callback) {

    $.ajax({
          method: "GET",
          url: Constants.API_LINK + 'lessons/' + id,
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
     * Unlock the next user lesson
     * @return {object}
     */
    unlockNextLesson(subLevelId, lessonId, callback) {
        $.ajax({
                method: "PUT",
                url: Constants.API_LINK  + 'user/sub-level/'  + subLevelId + '/lesson/'+lessonId,
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

let LessonStoreInstance = new LessonStore();

export default LessonStoreInstance;
