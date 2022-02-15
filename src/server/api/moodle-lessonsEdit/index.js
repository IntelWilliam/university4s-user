import express from 'express'
import { getMoodleLessonEdit, updateMoodleLessonEdit } from 'src/server/lib/moodle-lessonsEdit'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este endpoint devuelve un registro especifico
 */
router.get('/:id', (req, res) => {
  let id = { _id: req.params.id, _matchExactly: '1' }
  getMoodleLessonEdit(id, (err, response) => {
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})

/*
 * Este endpoint actualiza un registro especifico
 */
router.put('/:id', (req, res) => {
  let params = req.body
  let id = req.params.id
  updateMoodleLessonEdit(id, params, (err, lesson) => {
    if (err) return res.status(500).json(err)
    res.json(lesson)
  })
})

// se exporta el nuevo router
export default router
