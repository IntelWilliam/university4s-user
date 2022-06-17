import express from 'express';
import request from 'request';
import Constants from 'src/server/constants';

// se crea el nuevo router para almacenar rutas
const router = express.Router();

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/get-countries', (req, res) => {
  request(
    {
      uri:
        (process.env.API_BASE_URL || Constants.API_BASE_URL) + 'get_countries',
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
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/get-states', (req, res) => {
  if (!req.query.a01Codigo) {
    return res.json({ status: 'faltan datos' });
  }
  request(
    {
      uri:
        (process.env.API_BASE_URL || Constants.API_BASE_URL) +
        'get_states/' +
        '?a01Codigo=' +
        req.query.a01Codigo,
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
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/get-provinces', (req, res) => {
  if (!req.query.a02Codigo) {
    return res.json({ status: 'faltan datos' });
  }
  request(
    {
      uri:
        (process.env.API_BASE_URL || Constants.API_BASE_URL) +
        'get_provinces/' +
        '?a02Codigo=' +
        req.query.a02Codigo,
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
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/get-cities', (req, res) => {
  if (!req.query.a03Codigo) {
    return res.json({ status: 'faltan datos' });
  }
  request(
    {
      uri:
        (process.env.API_BASE_URL || Constants.API_BASE_URL) +
        'get_cities/' +
        '?a03Codigo=' +
        req.query.a03Codigo,
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
