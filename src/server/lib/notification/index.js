import {
  default as Constants,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET_KEY,
} from 'src/server/constants';
import { default as User } from 'src/server/models/User';
import { default as Event } from 'src/server/models/Event';
import FB from 'fb';
/**
 * Esta función consultar todos los usuarios que tienen eventos está semana y notificar vía facebook
 */
export function getUsersWithEvents() {
  let dateNow = new Date();
  let dateFirst = new Date(
    dateNow.getFullYear(),
    dateNow.getMonth(),
    dateNow.getDate(),
    0,
    0,
    0
  );
  let dateSecond = new Date(
    dateNow.getFullYear(),
    dateNow.getMonth(),
    dateNow.getDate() + 6,
    23,
    59,
    59
  );

  let query = [
    { $match: { date: { $gte: dateFirst, $lte: dateSecond } } },
    { $group: { _id: '$userId' } },
  ];

  Event.aggregate(query).exec((err, result) => {
    if (result) {
      User.populate(
        result,
        { path: '_id', select: 'name lastname email facebookId' },
        (error, users) => {
          sendRequestFacebook(users);
        }
      );
    }
  });
}

export function sendRequestFacebook(users) {
  FB.api(
    'oauth/access_token',
    {
      client_id: FACEBOOK_APP_ID,
      client_secret: FACEBOOK_APP_SECRET_KEY,
      grant_type: 'client_credentials',
    },
    (res) => {
      if (!res || res.error) {
        console.log(!res ? 'error occurred with accessToken' : res.error);
        return;
      }
      let accessToken = res.access_token;
      sendNotificationFacebook(users, accessToken);
    }
  );
}

export function sendNotificationFacebook(users, accessToken) {
  let message = 'mira los eventos que tienes esta semana';
  let batch = [];
  let batchEmail = {};
  let toEmail = [];
  for (let user in users) {
    let facebookId = users[user]['_id']['facebookId'];
    let email = users[user]['_id']['email'];
    let name = users[user]['_id']['name'];

    if (facebookId) {
      //Se pregunta si tiene FacebookId
      let url = {
        method: 'post',
        relative_url: facebookId + '/notifications',
        body: 'template=' + name + ' ' + message,
      };
      batch.push(url);
      if (batch.length == 50) {
        //Límite de notificaciones en un solo request (50)
        sendBatchNotificationFacebook(batch, accessToken);
        batch = [];
      }
    }
    if (email) {
      //Se pregunta si tiene email para enviar correo electrónico
      toEmail.push(email);
      batchEmail[email] = { name: name };
      if (toEmail.length == 1000) {
        sendBatchNotificationEmail(toEmail, batchEmail);
        batchEmail = {};
        toEmail = [];
      }
    }
  }
  if (batch.length > 0) {
    sendBatchNotificationFacebook(batch, accessToken);
  }
  if (toEmail.length > 0) {
    sendBatchNotificationEmail(toEmail, batchEmail);
  }
}

export function sendBatchNotificationFacebook(batch, accessToken) {
  FB.setAccessToken(accessToken);
  FB.api('', 'post', { batch }, (res) => {
    if (!res || res.error) {
      console.log(!res ? 'error occurred in notification' : res.error);
      return;
    }
    console.log('success notifications facebook');
  });
}

export function sendBatchNotificationEmail(toEmail, batchEmail) {
  let data = {
    from: ' Akronenglish1 <info@re-bilingual.com>',
    to: toEmail,
    'recipient-variables': batchEmail,
    subject: 'Cronograma semanal',
    html:
      '<h1>Tareas</h1> <p>%recipient.name% mira los eventos que tienes esta semana</p><a href="https://' +
      (process.env.DOMAIN || Constants.DOMAIN) +
      Constants.URL_EVENTS +
      '" target="_blank">Ingresa a tus eventos aquí.</a> ',
  };
  _mailgun.messages().send(data, (error, body) => {
    console.log('success notifications email');
  });
}
