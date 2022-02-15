import Constants from 'src/client/Constants/Constants'

class WelcomeMessageStore {

  SendWelcomeEmail(email, callback) {
    console.log('user email:', email);
    $.post(Constants.API_LINK + 'welcome-message/', email, (body) => {
      // si no es error se responde con el body que envia el server
      callback(null, body)

    }).fail((err) => {
      console.log("error WelcomeMessageStore.SendWelcomeEmail");
      callback(err)
    })
  }

  // SendForm(email, cb) {
  //   console.log('user email:', email);
  //   $.ajax({
  //     url: Constants.API_LINK + 'welcome-message/',
  //     type: 'POST',
  //     processData: false, // important
  //     contentType: false, // important
  //     data: data
  //   }).done(function(body) {
  //     cb(null, body)
  //   }).fail((err) => {
  //     console.log('err', err)
  //     // si falla la peticion se envia el error
  //     cb(err)
  //   });
  // }
}

let WelcomeMessageStoreInstance = new WelcomeMessageStore();

export default WelcomeMessageStoreInstance;
