import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class BoxChatStore {

    SendForm(data, cb) {
        // se hace el post para iniciar session
        $.ajax({
            url: Constants.API_LINK + 'consult/',
            type: 'POST',
            processData: false, // important
            contentType: false, // important
            data: data
        }).done(function(body) {
            cb(null, body)
        }).fail((err) => {
            console.log('err', err)
            // si falla la peticion se envia el error
            cb(err)
        });
    }


    /**
     * Get the one subLevel.
     * @return {object}
     */
    getMessages(param, callback) {
      // se piden los nivels del sistema
      // console.log('param', param);
      $.get(Constants.API_LINK + 'chat-box/', param,  (data) => {
        callback(null, data)
        // console.log('data', data);
      }).fail((err) => {
        // si hay error de autorización se desloguea
        if (err.status == 401) {
          loginUser.logout((resp) => {
            console.log('resp', resp);
            callback(err)
          })
        } else {
          callback(err)
        }
      })
    }

    /**
     * Get the one subLevel.
     * @return {object}
     */
    createMenssage(param, callback) {
      // se piden los nivels del sistema
      console.log('param', param);
      $.post(Constants.API_LINK + 'chat-box/', param,  (data) => {
        // console.log('data', data);
        callback(null, data)
      }).fail((err) => {
        // si hay error de autorización se desloguea
        if (err.status == 401) {
          loginUser.logout((resp) => {
            console.log('resp', resp);

            callback(err)
          })
        } else {
          callback(err)
        }
      })
    }

    /**
     * Get the one subLevel.
     * @return {object}
     */
    updateMessages(id, param, callback) {
      // se piden los nivels del sistema
      // console.log('param', param);
      $.ajax({
          url: Constants.API_LINK + 'chat-box/' + id,
          data: param,
          type: 'PUT',
          success: (body) => {
              // si no es error se responde con el body que envia el server
              callback(null, body)
          }
      }).fail((err) => {
          // si hay error de autorización se desloguea
          if (err.status == 401) {
              loginUser.logout((resp) => {
                console.log('resp', resp);

                  callback(err)
              })
          } else {
              callback(err)
          }
      })

    }


}

let BoxChatStoreInstance = new BoxChatStore();

export default BoxChatStoreInstance;
