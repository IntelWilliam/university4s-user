import Constants from 'src/client/Constants/Constants'

class CreateAccountStore {

  create(data, callback) {

    let jsonData = {
      name: data.name,
      lastname: data.lastname,
      documentID: data.documentID,
      password: data.password,
      email: data.email,
      direction: data.direction,
      phone: data.phone,
      homePhone: data.homePhone,
      facebookId: data.facebookId,
      codeId: data.codeId.trim(),

      titularId: data.titularId,
      titularName: data.titularName,
      titularLastName: data.titularLastName,

      titularCountry: data.titularCountry,
      titularState: data.titularState,
      titularProvince: data.titularProvince,
      titularCity: data.titularCity,
    }

    if (data['entityCode'] && data['entityName']) {
      jsonData.entityCode = data['entityCode']
      jsonData.entityName = data['entityName']
    }


    $.post(Constants.API_LINK + 'moodle-newAccount', jsonData, (body) => {
      callback(null, body);
    }).fail((err) => {
      console.log(err)
      callback(err)
    })
  }

  checkBuyerDataExist(licence, callback) {
    $.post(Constants.API_LINK + 'moodle-buyer-data' + '/check-exist', {licence}, (body) => {

      // console.log("body", body);

      callback(null, body);
    }).fail((err) => {
      console.log(err)
      callback(err)
    })
  }

}

let CreateAccountStoreInstance = new CreateAccountStore();

export default CreateAccountStoreInstance;
