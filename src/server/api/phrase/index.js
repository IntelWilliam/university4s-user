import express from 'express'
import { getPhrase, addPhrase, updatePhrase, removePhrase, addRelationPhrase, removeRelationPhrase, getRelationPhrase } from 'src/server/lib/phrase'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', (req, res) => {
  let query = req.query
  getPhrase(query, (err, response) => {
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})

/*
 * Este endpoint crea un nuevo registro
 */
router.post('/', (req, res) => {
  let params = req.body
  addPhrase(params, (err, phrase) => {
    if (err) return res.status(500).json(err)
    res.json(phrase)
  })
})

/*
 * Este endpoint devuelve un registro especifico
 */
router.get('/:id', (req, res) => {
  let id = { _id: req.params.id, _matchExactly: '1' }
  getPhrase(id, (err, response) => {
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
  updatePhrase(id, params, (err, phrase) => {
    if (err) return res.status(500).json(err)
    res.json(phrase)
  })
})

/*
 * Este endpoint elimina un registro especifico
 */
router.delete('/:id', (req, res) => {
  let id = req.params.id
  removePhrase(id, (err, info) => {
    if (err) return res.status(500).json(err)
    res.json(info)
  })
})

/*
 * Este endpoint crea un nuevo indice en el arreglo relacionado
 */
router.post('/:id/phrase', (req, res) => {
  let idPhrase = req.body
  addRelationPhrase(idPhrase, (err, info) => {
    if (err) return res.status(500).json(err)
    res.json(info)
  })
})

/*
 * Este endpoint elimina un indice en el arreglo relacionado
 */
router.delete('/:id/phrase', (req, res) => {
  let idPhrase = req.body.idPhrase
  removeRelationPhrase(idPhrase, (err, info) => {
    if (err) return res.status(500).json(err)
    res.json(info)
  })
})

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/:id/phrase', (req, res) => {
  let param = req.query
  let id = req.params.id
  getRelationPhrase(id, param, (err, phraseTranslations) => {
    if (err) return res.status(500).json(err)
    res.json(phraseTranslations)
  })
})

// se exporta el nuevo router
export default router
