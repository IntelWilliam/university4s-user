import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class accountStore {
  getOne(id, callback) {
    $.get(Constants.API_LINK + 'userAccount/' + id, (data) => {
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

  update(id, user, callback) {
    // se hace un put
    $.ajax({
      url: Constants.API_LINK + 'userAccount/' + id,
      data: user,
      type: 'PUT',
      success: (body) => {
        // si no es error se responde con el body que envia el server
        callback(null, body)
      }
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

  uploadImage(data, cb) {
    // se hace el post para iniciar session
    $.ajax({
      url: Constants.API_LINK + 'userAccount/photo/',
      type: 'POST',
      processData: false, // important
      contentType: false, // important
      data: data
    }).done(function (body) {
      cb(null, body)
    }).fail((err) => {
      console.log('err', err)
      // si falla la peticion se envia el error
      cb(err)
    });
  }

  updatePass(data, cb) {
    $.ajax({
      url: Constants.API_LINK + 'moodle-passUpdate/',
      type: 'POST',
      dataType: 'json',
      data: data,
    }).done(function (body) {
      cb(null, body)
    }).fail((err) => {
      console.log('err', err)
      // si falla la peticion se envia el error
      cb(err)
    });
  }

}

let accountStoreInstance = new accountStore();

export default accountStoreInstance;
