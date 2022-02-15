import {default as User} from 'src/server/models/User'
import { sendPass } from 'src/server/lib/consult'
import uniqid from 'uniqid'
import {shaEncryp} from 'src/server/util/util'
import request from 'request';
import Constants from 'src/server/constants';


/*
* Esta función permite devolver todos los registros que coincidan con la query enviada
*/
export function findSendEmail(emailUser, callback) {
  User.findOne({  'email': emailUser }, function(err, User) {
    if (err){
      // console.log("error findSendEmail");
      return callback(err);
    }
    if (User) {
      newPassGen(emailUser, (err, response) => {
        if (err){
          // console.log("error newPassGen", err);
          return callback(err);
        }
        return callback(null, response)
      })

      // return callback(null, User)
    } else {
      return callback(err)
    }

  })
}

export function sendPassword(emailUser,newpass,  callback) {
  sendPass(emailUser,newpass, (err, response) => {
    if (err) {
      // console.log("err sendPass");
      console.log('err', err);
      return callback(true)
    }
    // console.log('response', response);
    return callback({ 'ok': 'request sent' })
  })
}

export function newPassDev(emailUser, newpass, callback) {
  request({
    uri: Constants.API_BASE_URL + 'pass_reset',
    method: "POST",
    form: {
      userEmail: emailUser,
      newPass: newpass
    }
  }, (error, response, body) => {
    if (error) {
      return callback(true)
    }
    // console.log('body', body);

    sendPassword(emailUser, newpass, (err, response) => {
      if (err){
        console.log("error sendPassword", err);
        return callback(err);
      }
      return callback(null, response)
    })
  });
}

export function newPassGen(emailUser, callback) {
  let newUser = {}
  newUser['salt'] = uniqid()
  var newpass = Math.floor((Math.random() * 10000000000) + 1)
  // console.log("newpass", newpass);
  newUser['password'] = shaEncryp(newUser['salt'] + newpass)

  User.findOneAndUpdate({ email: emailUser },{salt: newUser['salt'], password: newUser['password']}, {upsert: false, }, (err, user) => {
    if (err) {
      // console.log("err User.findOneAndUpdate");
      return callback(err)
    }

    // Se envia el correo con la nueva contraseña
    // console.log("newpass", newpass);
    newPassDev(emailUser, newpass, (err, response) => {
      if (err){
        // console.log("error newPassDev", err);
        return callback(err);
      }
      return callback(null, response)
    })

    // console.log("user", user);
    return callback({ 'ok': 'modify ok' })
  })
}
