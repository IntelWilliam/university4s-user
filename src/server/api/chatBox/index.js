import express from 'express'
import { getChatBox, addChatBox, updateChatBox, removeChatBox } from 'src/server/lib/chatBox'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', (req, res) => {
  let query = req.query
  getChatBox(query, (err, response) => {
    if (err) return res.status(500).json({ error: err })
    res.json(response)
  })
})

/*
 * Este endpoint crea un nuevo registro
 */
router.post('/', (req, res) => {
  let params = req.body
  params.messages = JSON.parse(params.messages)

  // console.log('post param ', params);

  addChatBox(params, (err, chatBox) => {
    if (err){
      console.log('addChatBox err=', err);
      return res.status(500).json(err)
    }
    res.json(chatBox)
  })
})

// /*
//  * Este endpoint devuelve un registro especifico
//  */
// router.get('/:id', (req, res) => {
//   let id = { _id: req.params.id, _matchExactly: '1' }
//   getChatBox(id, (err, response) => {
//     if (err) return res.status(500).json({ error: err })
//     res.json(response)
//   })
// })
//

/*
 * Este endpoint actualiza un registro especifico
 */
router.put('/:id', (req, res) => {
  let params = req.body
  let id = req.params.id

  params.messages = JSON.parse(params.messages)
  // console.log('post param ', params);

  updateChatBox(id, params, (err, chatBox) => {
    if (err){
      console.log('err', err);
      return res.status(500).json(err)
    }
    res.json(chatBox)
  })
})

/*
 * Este endpoint elimina un registro especifico
 */
router.delete('/:id', (req, res) => {
  let id = req.params.id
  removeChatBox(id, (err, info) => {
    if (err) return res.status(500).json(err)
    res.json(info)
  })
})

// se exporta el nuevo router
export default router
