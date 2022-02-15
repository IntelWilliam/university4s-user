import express from 'express'
import request from 'request';
// import Constants from 'src/server/constants';

const router = express.Router()

router.post('', (req, res) => {
    request({
        uri: 'https://dev.akronenglish1.com/admin/students/notes/do_new/',
        method: "POST",
        form: {
            TxtExam: req.body.examId,
            TxtTry: req.body.tries,
            TxtNote: req.body.result,
            TxtUserID: req.body.studentId,
            // TxtExamID y TxtExamID se envian si la nota se va a actualizar, de lo contrario van en 0
            // Siempre se actualiza, cuando el estudiante ingresa al examen la nota se crea en 0
            TxtExamID: req.body.TxtExamID ? req.body.TxtExamID : req.body.examId,
            TxtTryID: req.body.TxtTryID ? req.body.TxtTryID : req.body.tries,
            //  re-autenticate debe ser true
            "re-autenticate": 1
        },
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }, (error, response, body) => {
        if (error) return res.status(500).json(error)
        res.json(body)
    });
});

export default router
