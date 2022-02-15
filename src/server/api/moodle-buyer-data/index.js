import express from 'express'
import request from 'request';
import Constants from 'src/server/constants';
import {addUser} from 'src/server/lib/user'
import {validateCode, updateCode, updateCouple} from 'src/server/lib/validateCode'
import {addEvents} from 'src/server/lib/event'


// updateCode(userData.codeId, codeTemp, (err, newCode) => {
//   if (err)
//     return res.status(500).json({error: err})
//   res.json({data: user})
// })
//
// updateCouple(code.userCouple._id, user._id, user.email, user.name, user.lastname, (err, updateResp) => {
//   if (err)
//     console.log('err-updateCouple', err);
//   console.log('updateResp', updateResp);
// })

const router = express.Router()

router.post('/check-exist', (req, res) => {

  var userData = req.body
  
  // validacion codigos akronenglish1
  validateCode(userData.licence, (err, code) => {
    if (err) {
      console.log('err', err);
      return res.send(false)
    }
    
    if (code) {
      if (code.stateCode === false) {
        res.json(code)
      } else {
        res.send(false)
      }
    } else {
      res.send(false)
    }
  })

});

export default router
