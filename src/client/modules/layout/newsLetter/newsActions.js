/*
 * Esta clase permite difinir las acciones o el controlador
 */
import Constants from 'src/client/Constants/Constants'

class NewsLetterActions {

  /**
   * @param  {JSON} emai
   */
  create(emai, callback) {
    // espacio reservado para crear un usuario
    $.post(Constants.API_LINK + 'newsletter/', emai, (body) => {
      // si no es error se responde con el body que envia el server
      callback(null, body)

    }).fail((err) => {
        callback(err)
    })

  }

}
let NewsLetterActionsInstance = new NewsLetterActions();
export default NewsLetterActionsInstance;
