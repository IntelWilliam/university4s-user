import express from 'express'
import { getWord, addWord, updateWord, removeWord, addRelationWord, removeRelationWord, getRelationWord } from 'src/server/lib/word'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', (req, res) => {
  let query = req.query
  getWord(query, (err, response) => {
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})

/*
 * Este endpoint crea un nuevo registro
 */
router.post('/', (req, res) => {
  let params = req.body
  addWord(params, (err, word) => {
    if (err) return res.status(500).json(err)
    res.json(word)
  })
})

/*
 * Este endpoint devuelve un registro especifico
 */
router.get('/:id', (req, res) => {
  let id = { _id: req.params.id, _matchExactly: '1' }
  getWord(id, (err, response) => {
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
  updateWord(id, params, (err, word) => {
    if (err) return res.status(500).json(err)
    res.json(word)
  })
})

/*
 * Este endpoint elimina un registro especifico
 */
router.delete('/:id', (req, res) => {
  let id = req.params.id
  removeWord(id, (err, info) => {
    if (err) return res.status(500).json(err)
    res.json(info)
  })
})

/*
 * Este endpoint crea un nuevo indice en el arreglo relacionado
 */
router.post('/:id/word', (req, res) => {
  let idWord = req.body
  addRelationWord(idWord, (err, info) => {
    if (err) return res.status(500).json(err)
    res.json(info)
  })
})

/*
 * Este endpoint elimina un indice en el arreglo relacionado
 */
router.delete('/:id/word', (req, res) => {
  let idWord = req.body.idWord
  removeRelationWord(idWord, (err, info) => {
    if (err) return res.status(500).json(err)
    res.json(info)
  })
})

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/:id/word', (req, res) => {
  let param = req.query
  let id = req.params.id
  getRelationWord(id, param, (err, wordTranslations) => {
    if (err) return res.status(500).json(err)
    res.json(wordTranslations)
  })
})

// se exporta el nuevo router
export default router
