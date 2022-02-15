/*
 * UserStore
 */

import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'


class UserStore  {
  /**
   * Get the one subLevel.
   * @return {object}
   */
  getOne(id, callback) {
    // se piden los nivels del sistema
    $.get(Constants.API_LINK + 'moodle-user/' + id, (data) => {
      callback(null, data)
      // console.log('data', data);
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

let UserStoreInstance = new UserStore();

export default UserStoreInstance;
