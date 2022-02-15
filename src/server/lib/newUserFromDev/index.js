import { addUser } from 'src/server/lib/user'

export function newUserFromDev (params,  callback){

  // let newUser = params

  let newUser = {
    userIdDev: params.userIdDev,
    role: "learner",
    status: 1,
    username: params.a06Email,
    email: params.a06Email,
    name: params.a06Nombres,
    lastname: params.a06Apellidos,
    // la clave se guarda en md5
    password: params.a06Clave
  }

  console.log('newUserFromDev - newUser',  newUser);

  addUser(newUser, (err, user) => {
    if (err){
      console.log('newUserFromDev - err', err);
      return callback(err);
    }
    console.log('newUserFromDev - user', user);
    return callback (null, user)
  })

}
