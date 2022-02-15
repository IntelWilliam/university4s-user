import Constants from 'src/client/Constants/Constants'

class CreateAccountStore {
  addAccess(data, cb) {
    $.ajax({
      url: Constants.API_LINK + 'lab-access/',
      type: 'POST',
      dataType: 'json',
      data: data,
    }).done(function(body) {
      cb(null, body)
    }).fail((err) => {
      console.log('err', err)
      // si falla la peticion se envia el error
      cb(err)
    });
  }
}

let PracticeStoreInstance = new CreateAccountStore();

export default PracticeStoreInstance;
