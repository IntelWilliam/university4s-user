import express from 'express'
import Constants from 'src/client/Constants/Constants'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

router.post('/', (req, res) => {
  let dataUsers = req.body

  dataUsers.forEach(data => {

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

    console.log('jsonData > ' + JSON.stringify(jsonData));

    $.post(Constants.API_LINK + 'moodle-newAccount', jsonData, (body) => {
      callback(null, body);
    }).fail((err) => {
      console.log(err)
      callback(err)
    })

  })
  res.json(dataUsers)
})


export default router
