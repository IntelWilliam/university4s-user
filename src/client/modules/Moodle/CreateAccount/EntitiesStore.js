import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'


class EntitiesStore {

  getAll(params, callback ) {
    // se piden los entidads del sistema
    $.get(Constants.API_LINK + 'entities/', params, (data) => {
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

let EntitiesStoreInstance = new EntitiesStore();
export default EntitiesStoreInstance;
