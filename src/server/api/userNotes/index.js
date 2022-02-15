import express from 'express'
import {createUserNotes} from 'src/server/lib/userNotes'

// se crea el nuevo router para almacenar rutas
const router = express.Router()
router.post('/', (req, res) => {
  const {body} = req
  const {userId, sectionId, subLevelId, examId, totalQuestionsExam, totalQuestionsTrue, score} = body;
  console.log('userId: ', userId);
  const invalidData = userId == null || sectionId == null || subLevelId == null ||
  examId == null || totalQuestionsExam == null || totalQuestionsTrue == null ||score ==  null;
  // res.json(req.body);
  if (invalidData) {
    return res.status(500).json({error: 'Wrong Data'});
  } else {
    createUserNotes(
      body,
      (err, userNotes) => {
        if (err) return res.status(500).json(err)
        res.json(userNotes)
      }
    )
  }
});

export default router
