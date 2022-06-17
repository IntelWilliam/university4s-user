import express from 'express';
import request from 'request';
import Constants from 'src/server/constants';

// se crea el nuevo router para almacenar rutas
const router = express.Router();
/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/:userId/:sectionId/:subLevelId/:examId', (req, res) => {
  let userId = req.params.userId;
  let sectionId = req.params.sectionId;
  let subLevelId = req.params.subLevelId;
  let examId = req.params.examId;
  request(
    {
      uri:
        (process.env.API_BASE_URL || Constants.API_BASE_URL) +
        'exam/' +
        userId +
        '/' +
        sectionId +
        '/' +
        subLevelId +
        '/' +
        examId,
      method: 'GET',
    },
    (error, response, body) => {
      console.log('ERROR', error);
      //console.log('RESPONSE', response);
      console.log('BODY', body);
      if (!error && response.statusCode == 200) {
        let jsonResponse = JSON.parse(body);
        res.json(jsonResponse);
      } else if (error) {
        return error;
      }
    }
  );
});

// se exporta el nuevo router
export default router;
