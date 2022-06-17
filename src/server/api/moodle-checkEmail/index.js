import express from 'express';
import request from 'request';
import Constants from 'src/server/constants';

// se crea el nuevo router para almacenar rutas
const router = express.Router();

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/:email', (req, res) => {
  let email = req.params.email;
  request(
    {
      uri:
        (process.env.AJAX_BASE_URL || Constants.AJAX_BASE_URL) +
        'check_mail/?TxtEmail=' +
        email,
      method: 'GET',
    },
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let jsonResponse = JSON.parse(body);
        res.json(jsonResponse);
      } else if (error) {
        return res.json(error);
      } else return res.json(body);
    }
  );
});

// se exporta el nuevo router
export default router;
