import FluxStore from 'src/client/FluxStore';
import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class StudentStore extends FluxStore {
  constructor() {
    super()
  }


  /**
   * Metodo encargado de enviar la informacion una vez se finaliza la sesion
   *
   */
  addNotify(data, callback) {
    // se piden los usuarios del sistema
    $.post(Constants.API_LINK + 'users/notify', data, () => {
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

  /**
   * Metodo encargado de enviar la informacion una vez se finaliza la sesion
   *
   */
  setSessionData(data, callback) {
    // se piden los usuarios del sistema
    $.post(Constants.API_LINK + 'users/session', data, () => {
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

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  getChats(data, callback) {
    // se piden los usuarios del sistema
    $.get(Constants.API_LINK + 'chats', data, (response) => {
      callback(null, response.data);
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
   * Get the entire collection of TODOs.
   * @return {object}
   */
  loadOffLineUsersChat(query, callback) {
    // se piden los usuarios del sistema
    $.get(Constants.API_LINK + 'chats-off-line', query,  (response) => {
      // console.log('response loadOffLineUsersChat', response);
      callback(null, response.data);
    }).fail((err) => {
      // callback(err)
      if (err.status == 401) {
        console.log('err loadOffLineUsersChat 401', err);
        callback(err)
        //
        loginUser.logout((resp) => {
          console.log('err loginUser.logout', err);
        })
      } else {
        console.log('err loadOffLineUsersChat', err);
        callback(err)
      }
    })
  }

}

let StudentStoreInstance = new StudentStore();


export default StudentStoreInstance;
