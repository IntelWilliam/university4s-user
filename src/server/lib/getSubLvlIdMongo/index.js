import {default as User, UserKeys} from 'src/server/models/User'

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */
export function getSubLvlIdMongo(userDevId, callback) {
    User.findOne({
        'userIdDev': userDevId
    }, function(err, User) {
        if (err)
            return console.log(err);

        if (User) {
            return callback(null, User)
        } else {
            return callback("not found", null)
        }

    })
}
