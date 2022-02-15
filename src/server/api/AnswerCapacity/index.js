import express from 'express'
import { getAnswerCapacity, addAnswerCapacity } from 'src/server/lib/answerCapacity'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', (req, res) => {
  let query = req.query
  getAnswerCapacity(query, (err, response) => {
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})

/*
 * Este endpoint crea un nuevo registro
 */
router.post('/', (req, res) => {
  let params = req.body
  // console.log('post param ', params);
  addAnswerCapacity(params, (err, answerCapacity) => {
    if (err) return res.status(500).json(err)
    res.json(answerCapacity)
  })
})

// se exporta el nuevo router
export default router
