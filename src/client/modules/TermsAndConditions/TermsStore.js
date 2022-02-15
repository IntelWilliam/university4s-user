import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class TermsStore {

  userAcceptTerms(user, callback) {
    $.post(Constants.API_LINK + 'accept-terms/', user, (data) => {
      // console.log("data",data);
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

let mTermsStore = new TermsStore();
export default mTermsStore;
