import express from 'express';
import request from 'request';
import Constants from 'src/server/constants';

// se crea el nuevo router para almacenar rutas
const router = express.Router();
/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/:id/type/:type', (req, res) => {
  let id = req.params.id;
  let type = req.params.type;
  request(
    {
      uri:
        (process.env.API_BASE_URL || Constants.API_BASE_URL) +
        'practice_type_by_lesson/' +
        id +
        '?type=' +
        type,
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

router.get('/:id/type/:type/code/:code', (req, res) => {
  let id = req.params.id;
  let type = req.params.type;
  let code = req.params.code;
  request(
    {
      uri:
        (process.env.API_BASE_URL || Constants.API_BASE_URL) +
        'practice_detail/' +
        id +
        '?type=' +
        type +
        '&number=' +
        code,
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
