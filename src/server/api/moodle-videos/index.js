import express from 'express';
import request from 'request';
import Constants from 'src/server/constants';

// se crea el nuevo router para almacenar rutas
const router = express.Router();

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/:id', (req, res) => {
  let id = req.params.id;
  request(
    {
      uri:
        (process.env.API_BASE_URL || Constants.API_BASE_URL) + 'videos/' + id,
      method: 'GET',
    },
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let jsonResponse = JSON.parse(body);
        res.json(jsonResponse);
      } else if (error) {
        return error;
      } else return body;
    }
  );
});

/*
 * Este end point devuelve todos los videos de un level y de una catergoría específica
 */
router.get('/:idLevel/:category', (req, res) => {
  let idLevel = req.params.idLevel;
  let category = req.params.category;
  request(
    {
      uri:
        (process.env.API_BASE_URL || Constants.API_BASE_URL) +
        'videosLevel/' +
        idLevel +
        '/' +
        category,
      method: 'GET',
    },
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let jsonResponse = JSON.parse(body);
        res.json(jsonResponse);
      } else if (error) {
        return error;
      } else return body;
    }
  );
});
// se exporta el nuevo router
export default router;
