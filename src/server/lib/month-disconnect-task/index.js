import { default as User } from 'src/server/models/User'
import { mailMonthDisconnectTemplate } from 'src/server/util/mailTemplate'

export function verifyUsersSendEmail() {

  // Fecha actual menos un mes (Busca alumnos con mas de un mes sin conectarce)
  let date = new Date();
  date.setMonth(date.getMonth() - 1);
  const query = {
    lastConection:
      {"$lt": date},
    isMonthDisconnectNotify:{
      $ni: true
    },
    role: "learner"
  }

  User.find(query, 'name lastname email username lastConection', function (err, docs) {
    let toEmail = []
    let batchEmail = {};
    docs.forEach((element) => {
      toEmail.push(element.email)
      batchEmail[element.email] = {name: element.name + ' ' + element.lastname};
    })

    // let toEmail = [
    //   // 'gaviriastban@gmail.com',
    //   'juangalalz93@gmail.com'
    // ]
    // let batchEmail = {};
    // batchEmail['gaviriastban@gmail.com'] = {"name": 'egaviria'};
    // batchEmail['juangalalz93@gmail.com'] = {"name": 'Juan carlos'};

    let msg = '<h3>Recuerda ingresar a nuestra plataforma Akronenglish1</h3> <p>%recipient.name% Hace mas de 1 mes no ingresas a nuestra plataforma: </p><a href="https://www.akronenglish1.com/login" target="_blank">Ingresa aquí.</a> '
    let htmlView = mailMonthDisconnectTemplate(msg, 'cid:image001.png')

    console.log('htmlView', htmlView);

    let data = {
      from: ' Akronenglish1 <info@re-bilingual.com>',
      to: toEmail,
      'recipient-variables': batchEmail,
      subject: 'Akronenglish1',
      html: htmlView,
      inline: "src/server/img/image001.png"
    };

    _mailgun.messages().send(data, (error, body) => {
      if (error) {
        console.log('error', error);
      } else {
        console.log('success notifications email', body);

        //
        User.update(query, {$set: {isMonthDisconnectNotify: true}}, (err, tank) => {
          if (err) {
            console.log('err', err);
          }
          console.log('tank', tank);
        })
      }

    });
  })
}