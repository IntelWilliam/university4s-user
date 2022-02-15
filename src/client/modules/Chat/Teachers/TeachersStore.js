import FluxStore from 'src/client/FluxStore';
import Constants from 'src/client/Constants/Constants'
import AppDispatcher from 'src/client/dispatcher/AppDispatcher'
import loginUser from 'src/client/modules/Login/'

class TeachersStore extends FluxStore {
  constructor() {
    super()
  }

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getOnline(callback) {
    // se piden los usuarios del sistema
    $.get(Constants.API_LINK + 'users/teachers', (responseData) => {
      console.log('responseData', responseData);
      callback(null, responseData.data.users);
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

  /**
   * Metodo encargado de enviar la informacion una vez se finaliza la sesion
   *
   */
  saveHomework(comments, didHomework, hasHomework, roomId, teacherId, callback) {
      // se piden los usuarios del sistema
    $.post(Constants.API_LINK + 'users/session/homework', {
      comment: comments,
      roomId: roomId,
      didHomework: didHomework,
      hasHomework: hasHomework,
      teacherId: teacherId
    }, () => {
      callback(null);
    }).fail((err) => {
      // console.log(err)
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

  saveTeacherRating(data, callback) {
    // se piden los usuarios del sistema
    $.post(Constants.API_LINK + 'teacher-rating', data, (resp) => {
      console.log('resp', resp);
      callback(null);
    }).fail((err) => {
      // console.log(err)
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

let TeacherStoreInstance = new TeachersStore();

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch (action.actionType) {
    case TeacherConstants.TEACHER_CREATE:
      TeacherStoreInstance.emitChange()
      break;

    case TeacherConstants.TEACHER_UPDATE:
      TeacherStoreInstance.emitChange();
      break;

    case TeacherConstants.TEACHER_DESTROY:
      TeacherStoreInstance.destroy(action.id);
      TeacherStoreInstance.emitChange();
      break;

    default:
      // no op
  }
})

export default TeacherStoreInstance;
