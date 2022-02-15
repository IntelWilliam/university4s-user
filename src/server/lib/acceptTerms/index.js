import {default as User} from "../../models/User";

export function addUserAccept(params, callback) {

  console.log("params", params);

  let email = params.email
  User.findOne({ 'email': email }, (err, User) => {
    if (err)
      return console.log(err);
    if (User) {

      // Acepta los terminos y condiciones
      User.acceptTerms = true
      User.save( () =>{})

      return callback(null, "ok")

    } else {
      return callback("not found")
    }

  })
}