import { default as Code } from 'src/server/models/Code'
import { default as User } from 'src/server/models/User'
import { Types } from 'mongoose'
import { removeCodeType } from "../../util/util";

/*
 * Esta función permite devolver todos los registros que coincidan con la query enviada
 */

export function validateCode(codeId, callback) {
  Code.findOne({
    'codeId': codeId
  }, (err, code) => {
    if (err)
      return console.log(err);

    if (code) {

      // 15022018-1        (10)
      // var coupleCode = code.codeId.substring(0, 10);
      // var coupleCode = code.codeId.substring(0, code.codeId.length - 1);
      // si es beneficiario se busca el titular y viceversa (B o B2)
      // if (code.codeId[code.codeId.length - 1] == 'B' || code.codeId[code.codeId.length - 2] == 'B') {
      //   coupleCode = coupleCode + 'T'
      // } else if (code.codeId[code.codeId.length - 1] == 'T') {
      //   coupleCode = coupleCode + 'B'
      // }

      findCouple(code.codeId, (err, couple) => {
        // findCouple(coupleCode, (err, couple) => {
        if (err) {
          // console.log('findCouple', err)
          return callback(err)
        }

        var codeEdit = JSON.parse(JSON.stringify(code))

        if (couple.length > 0) {

          couple.forEach((element) => {
            if (element.stateCode == true) {
              // code['userCouple'] = element.userId
              // code['coupleDetail'] = element

              let couple = JSON.parse(JSON.stringify(element.userId))

              // couple.titularId = "titularId"
              // couple.titularName = "titularName"
              // couple.direction = "direction"
              // couple.phone = "phone"
              // couple.homePhone = "homePhone"

              // couple.department = "department"

              //si se encuentra un "couple" se agrega.
              codeEdit['userCouple'] = couple
              return;
            }
          })

          return callback(null, codeEdit)
        } else {
          return callback(null, code)
        }

      })

    } else {
      return callback("not found")
    }
  })
}

export function findCouple(code, cb) {
  let coupleCode = removeCodeType(code);
  // var coupleCode = code.substring(0, 10);

  // Se buscan pares de licencia excluyendo la misma licencia
  Code.find({$and: [{codeId: {$ne: code}}, {codeId: {$regex: coupleCode + ".*"}}]}).populate('userId').exec((err, coupleFound) => {
    // Code.find({'codeId': {$regex : coupleCode + ".*"}}).populate('userId').exec((err, coupleFound) => {
    if (err) {
      console.log(err);
      return cb(err)
    }
    return cb(null, coupleFound)
  })
}

export function updateCouple(userUpdateId, userId, userEmail, name, lastname, callback) {
  let idref = Types.ObjectId(userUpdateId);
  User.update({
    '_id': idref
  }, {
    $set: {
      coupleId: userId,
      coupleName: name,
      coupleLastName: lastname,
      coupleEmail: userEmail,
    }
  }, function (err, userUpdate) {
    if (err)
      return console.log(err);

    if (userUpdate) {
      return callback(null, userUpdate)
    } else {
      return callback(null, false)
    }
  })
}

//actualiza la informacion del comprador en los usuarios de las otras licencias
export function updateCoupleBuyerData(user, callback) {
  // Se buscan pares de licencia excluyendo la misma licencia

  Code.findOne({userId: user._id}).exec((err, code) => {
    // Code.find({'codeId': {$regex : coupleCode + ".*"}}).populate('userId').exec((err, coupleFound) => {
    if (err) {
      console.log(err);
      return callback(err)
    }

    if (code) {
      let coupleCode = removeCodeType(code);
      // var coupleCode = code.codeId.substring(0, 10);
      // Se buscan pares de licencia excluyendo la misma licencia
      Code.find({$and: [{codeId: {$ne: code.codeId}}, {codeId: {$regex: coupleCode + ".*"}}]}).exec((err, coupleFound) => {
        // Code.find({'codeId': {$regex : coupleCode + ".*"}}).populate('userId').exec((err, coupleFound) => {
        if (err) {
          console.log(err);
          return callback(err)
        }

        // console.log("\ncoupleFound", coupleFound);
        const buyerData = {
          titularId: user.titularId,
          titularName: user.titularName,
          direction: user.direction,
          phone: user.phone,
          homePhone: user.homePhone,

          titularCountry: user.titularCountry,
          titularState: user.titularState,
          titularProvince: user.titularProvince,
          titularCity: user.titularCity
        }

        coupleFound.forEach((element) => {
          User.findByIdAndUpdate(element.userId, {$set: buyerData}, {upsert: true, new: true}, (err, userNew) => {
            console.log("\nuserNew", userNew);
          })
        })
      })
    } else {
      callback('User hasn\'t code')
    }


  })
}


export function updateCode(codeId, data, callback) {
// export function updateCode(codeId, userId, userEmail, name, callback) {
  Code.update({
    'codeId': codeId
  }, {
    $set: data

    // {
    //     stateCode: true,
    //     userId: userId,
    //     userEmail: userEmail,
    //     userName: name,
    //     useCode: new Date()
    // }
  }, (err, codeUpdate) => {
    if (err)
      return console.log(err);

    if (codeUpdate) {
      return callback(null, codeUpdate)
    } else {
      return callback(null, false)
    }

  })
}
