import express from 'express';
import request from 'request';
import Constants from 'src/server/constants';
import { addChatCosmo } from 'src/server/lib/chatCosmo';

// se crea el nuevo router para almacenar rutas
const router = express.Router();

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', (req, res) => {
  request(
    {
      uri:
        (process.env.API_BASE_CHAT_COSMO || Constants.API_BASE_CHAT_COSMO) +
        'randomStory',
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
router.get('/query/:storyRaw/:story/:uuid', (req, res) => {
  let query = req.query;
  var phrase = query.phrase;
  console.log('phrase', phrase);
  var storyRaw = req.params.storyRaw;
  var story = req.params.story;
  var uuid = req.params.uuid;
  request(
    {
      uri:
        (process.env.API_BASE_CHAT_COSMO || Constants.API_BASE_CHAT_COSMO) +
        'query/' +
        phrase +
        '/?storyQuery=' +
        storyRaw,
      method: 'GET',
    },
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let jsonResponse = JSON.parse(body);
        res.json(jsonResponse);

        let newChatCosmo = {
          story: story.replace(/\./g, '. '),
          storyRaw: JSON.parse(storyRaw),
          phrase: phrase,
          sesionId: uuid,
          cosmoResponse: jsonResponse.data,
        };

        addChatCosmo(newChatCosmo, (err, resp) => {
          if (err) {
            console.log('err addChatCosmo', err);
          }
          console.log('resp newChatCosmo', resp);
        });
      } else if (error) {
        return error;
      } else return body;
    }
  );
});

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/querySTS/:uuid', (req, res) => {
  let query = req.query;
  var phrase = query.phrase;
  var uuid = req.params.uuid;
  request(
    {
      uri: Constants.API_BASE_CHAT_STS + '?q=' + phrase,
      method: 'GET',
    },
    (error, response, body) => {
      if (!error && response.statusCode == 200) {
        // let jsonResponse = JSON.parse(body);
        res.json(body);

        let newChatCosmo = {
          story: '',
          storyRaw: [],
          phrase: phrase,
          sesionId: uuid,
          cosmoResponse: body,
        };

        addChatCosmo(newChatCosmo, (err, resp) => {
          if (err) {
            console.log('err addChatCosmo', err);
          }
          console.log('resp newChatCosmo', resp);
        });
      } else if (error) {
        return error;
      } else return body;
    }
  );
});

// se exporta el nuevo router
export default router;
