import express from 'express'
import request from 'request';
import Constants from 'src/server/constants';

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', (req, res) => {
    request({
        uri: Constants.API_BASE_URL + 'getHelp',
        method: "GET"
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
          let jsonResponse = JSON.parse(body);
          res.json(jsonResponse)
      } else if(error){
          return error
      } else return body
    });
})

// se exporta el nuevo router
export default router
