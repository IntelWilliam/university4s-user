import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class AnswerCapacityStore {

  create(data, callback) {
    $.post(Constants.API_LINK + 'answer-capacity', data , (body) => {
      callback(null, body);
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

let AnswerCapacityStoreInstance = new AnswerCapacityStore();

export default AnswerCapacityStoreInstance;
