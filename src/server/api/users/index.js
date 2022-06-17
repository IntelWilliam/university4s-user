import express from 'express';
import { getOnlineUsers, notifyChat } from 'src/server/lib/users';
import { getRoom } from 'src/server/lib/rooms';
import request from 'request';
import Constants from 'src/server/api/constants';
import { addPercepAttention } from 'src/server/lib/PercepAttention';

// se crea el nuevo router para almacenar rutas
const router = express.Router();

router.post('/notify', (req, res) => {
  let data = {
    notifyType: req.body.notifyType,
    notifyNumber: req.body.notifyNumber,
  };

  notifyChat(req.body.userIdDev, data, (err, resp) => {
    if (err) return res.status(500).json(err);
    res.json(resp);
  });
});

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/teachers', (req, res) => {
  getOnlineUsers('teacher', (err, teachers) => {
    if (err) return res.status(500).json(err);
    res.json(teachers);
  });
});

router.post('/login', (req, res) => {
  request(
    {
      uri:
        (process.env.API_BASE_URL_CHAT || Constants.API_BASE_URL_CHAT) +
        'login',
      method: 'POST',
      form: {
        username: req.body.username,
        password: req.body.password,
      },
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
// endpoint encargado de enviar la data de la sesion al servidor de akronenglish1
router.post('/session', (req, res) => {
  if (
    !req.body.roomId &&
    req.body.studentId &&
    req.body.time &&
    req.body.score
  ) {
    return res.json({ status: 'faltan datos' });
  }

  addPercepAttention(req.body, (err, response) => {
    if (err) {
      console.log(err);
      return res.json({ status: 'faltan datos' });
    }
    // console.log('response', response);

    // console.log('la room', req.body.roomId)
    // console.log('la info de sesion', req.body);
    // capturo los ids de los usuarios que estaban en la room
    let usersIds = req.body.roomId.split('-');
    // se busca la room en la que estaba

    // se encuentra el profesor asignado a esa room filtrando por id
    let teacherArray = usersIds.filter((id) => {
      return id != req.body.studentId;
    });
    let teacherId = teacherArray.shift();
    // console.log('el teacher id', teacherId)
    // console.log('API_BASE_URL_CHAT', Constants.API_BASE_URL_CHAT + 'session')
    request(
      {
        uri:
          (process.env.API_BASE_URL_CHAT || Constants.API_BASE_URL_CHAT) +
          'session',
        method: 'POST',
        form: {
          teacherId: teacherId,
          studentId: req.body.studentId,
          time: req.body.time,
          comment: req.body.comment,
          score: req.body.score,
        },
      },
      (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let jsonResponse = JSON.parse(body);
          res.json(jsonResponse);
        } else if (error) {
          console.log('error');
          return error;
        } else return body;
      }
    );
  });
});

// endpoint encargado de enviar la data de la sesion al servidor de akronenglish1
router.post('/session/homework', (req, res) => {
  // capturo los ids de los usuarios que estaban en la room
  // console.log(req.body);
  // console.log('la room de tarea', req.body.roomId)
  let usersIds = req.body.roomId.split('-');
  // se busca la room en la que estaba

  // se encuentra el estudiante en sesion
  let studentArray = usersIds.filter((id) => {
    return id != req.body.teacherId;
  });
  let studentId = studentArray.shift();
  request(
    {
      uri:
        (process.env.API_BASE_URL_CHAT || Constants.API_BASE_URL_CHAT) +
        'homework',
      method: 'POST',
      form: {
        teacherId: req.body.teacherId,
        studentId: studentId,
        hasHomework: req.body.hasHomework,
        didHomework: req.body.didHomework,
        homeworkDescription: req.body.comment,
      },
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
