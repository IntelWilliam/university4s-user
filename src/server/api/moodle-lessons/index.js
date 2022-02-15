import express from 'express'
import request from 'request';
import Constants from 'src/server/constants';
import { getAllLinks } from 'src/server/lib/lesson'


// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/:id', (req, res) => {
    let id = req.params.id;
    request({
        uri: Constants.API_BASE_URL + 'lessons/' + id,
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

/*
 * Este end point devuelve todos los link de las practicas
 */
router.post('/link-all-practice', (req, res) => {
  getAllLinks((err, resp)=>{
    if(err){
      console.log('err', err);
      return res.json(err)
    }
    console.log('resp', resp);
    return res.json(resp);

  })
})

// se exporta el nuevo router
export default router
