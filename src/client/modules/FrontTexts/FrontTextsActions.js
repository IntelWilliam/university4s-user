import Constants from 'src/client/Constants/Constants'
import loginUser from 'src/client/modules/Login/'

class FrontTextsActions  {
  getTexts(name, callback) {
    // se hace un put
    $.ajax({
      url: Constants.API_LINK + 'front-texts/' + name,
      type: 'GET',
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

}
let FrontTextsActionsInstance = new FrontTextsActions();
export default FrontTextsActionsInstance;
