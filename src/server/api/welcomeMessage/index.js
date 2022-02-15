import express from 'express'
// import { sendEmail } from 'src/server/lib/welcomeMessage'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este endpoint crea un nuevo registro
 */
router.post('/', (req, res) => {
  let params = req.body.email;
  console.log('params-email:', params);

  let msg = '<img style="width:100%" src="https://image.re-cosmo.com/source/bienvenida_akron/bienvenida1.png"/>' +
      '<img style="width:100%" src="https://image.re-cosmo.com/source/bienvenida_akron/bienvenida2.png"/>' +
      '<img style="width:100%" src="https://image.re-cosmo.com/source/bienvenida_akron/bienvenida3.png"/>';

  let mailOptions = {
    from: 'mail@international.com', // sender address
    to: params, // list of receivers
    subject: '¡Bienvenido a Akron English!', // Subject line
    html: msg, // html body,
  };

  //Se envia el correo
  _smtpTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('error', error);
        return res.json(error)
      }
      return res.json(info)
  });

})

// se exporta el nuevo router
export default router
