import express from 'express';
import request from 'request';
import Constants from 'src/server/constants';
import { addUser } from 'src/server/lib/user';
import {
  validateCode,
  updateCode,
  updateCouple,
} from 'src/server/lib/validateCode';
import { addEventsBooks } from 'src/server/lib/event';

const router = express.Router();

router.post('', (req, res) => {
  var userData = req.body;

  // validacion codigos akronenglish1
  validateCode(userData.codeId, (err, code) => {
    if (err) {
      console.log('err', err);
      return res.send(false);
    }
    if (code) {
      // console.log('\ncode', code);
      if (code.stateCode === false) {
        let form = {
          name: userData.name,
          lastname: userData.lastname,
          password: userData.password,
          email: userData.email,
          direction: userData.direction,
          phone: userData.phone,
          homePhone: userData.homePhone,
        };
        // console.log("\nform to dev", form);

        // crea usuario en dev
        request(
          {
            uri:
              (process.env.API_BASE_URL || Constants.API_BASE_URL) +
              'newAccount',
            method: 'POST',
            form: {
              name: userData.name,
              lastname: userData.lastname,
              password: userData.password,
              email: userData.email,
              direction: userData.direction,
              phone: userData.phone,
              homePhone: userData.homePhone,
            },
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
          (error, response, body) => {
            console.log('error', 'body newAccount -> : ', error, body);

            if (error) {
              console.log('error moodle-newAccount', error);
              return error;
            }

            // res.json(JSON.parse(body))
            let temp = JSON.parse(body);

            let params = userData;
            //
            params['userIdDev'] = parseInt(temp.idDev);
            params['status'] = true;
            params['role'] = 'learner';
            params['username'] = params.email.slice(
              0,
              params.email.indexOf('@')
            );

            //  T = accountLevel= 1  B = accountLevel =2
            let userCode = userData.codeId;

            // si el codigo tiene asociada una entidad se le da prioridad, respecto a la que eligio el usuario
            if ('entityCode' in code && 'entityName' in code) {
              // console.log('code.entityCode');
              params['entityCode'] = code.entityCode;
              params['entityName'] = code.entityName;
            } else if ('entityCode' in userData && 'entityName' in userData) {
              // console.log('userData.entityCode && userData.entityName');
              params['entityCode'] = userData.entityCode;
              params['entityName'] = userData.entityName;
            }

            // se guarda la informacion del beneficiario o titular
            if (code.userCouple) {
              // console.log('\nif code.userCouple ->', code.userCouple);
              params['coupleId'] = code.userCouple._id;
              params['coupleName'] = code.userCouple.name;
              params['coupleLastName'] = code.userCouple.lastname;
              params['coupleEmail'] = code.userCouple.email;
            }

            params['accountLevel'] =
              userCode[userCode.length - 1] == 'T'
                ? 1
                : userCode[userCode.length - 1] == 'B' ||
                  userCode[userCode.length - 2] == 'B'
                ? 2
                : 0;

            // crea usuario en mongo
            addUser(params, (err, user) => {
              if (err) return res.status(500).json({ error: err });

              if (code.userCouple) {
                updateCouple(
                  code.userCouple._id,
                  user._id,
                  user.email,
                  user.name,
                  user.lastname,
                  (err, updateResp) => {
                    if (err) console.log('err-updateCouple', err);
                    console.log('updateResp', updateResp);
                  }
                );
              }

              let date = userData.date;
              addEventsBooks(null, user._id, (err, response) => {
                // addEvents(date, user._id, (err, response) => {
                if (err) return res.status(500).json(err);

                // actualiza el codigo statusCode: true

                let codeTemp = {
                  stateCode: true,
                  userId: user._id,
                  userEmail: user.email,
                  userName: user.name,
                  useCode: new Date(),
                };

                if (params['entityCode'] && params['entityName']) {
                  codeTemp.entityCode = params['entityCode'];
                  codeTemp.entityName = params['entityName'];
                }

                updateCode(userData.codeId, codeTemp, (err, newCode) => {
                  if (err) return res.status(500).json({ error: err });
                  res.json({ data: user });
                });
              });
            });
          }
        );
      } else {
        res.send(false);
      }
    } else {
      res.send(false);
    }
  });
});

export default router;
