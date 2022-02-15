import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class ChatCosmoStore {
  /**
  * Get the one subLevel.
  * @return {object}
  */
  getCosmoResp( phrase, storyRaw, story, uuid, callback) {
    // se piden los nivels del sistema
    // console.log('param', param);

    $.get(Constants.API_LINK + 'chat-cosmo/query/'+ JSON.stringify(storyRaw) + '/' + story + '/' + uuid + '/?phrase=' + phrase , (data) => {
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
  getSTSResp(phrase, uuid ,callback) {
    // se piden los nivels del sistema
    // console.log('param', param);

    $.get(Constants.API_LINK + 'chat-cosmo/querySTS/' + uuid + '/?phrase=' + phrase, (data) => {
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
  getTopic( callback) {
    // se piden los nivels del sistema
    // console.log('param', param);
    $.get(Constants.API_LINK + 'chat-cosmo', (data) => {
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


}

let ChatCosmoStoreInstance = new ChatCosmoStore();

export default ChatCosmoStoreInstance;
