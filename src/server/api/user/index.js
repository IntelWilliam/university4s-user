import express from 'express'
import fs from 'fs'
// import _ from 'lodash'
import {
  getUser,
  countUsers,
  addUser,
  updateUser,
  removeUser,
  addRelationLanguage,
  removeRelationLanguage
} from 'src/server/lib/user'
import {uploadSingleFile} from 'src/server/shared/fileUploader'
import {EXTERNAL_BASE_PATH, FILES} from 'src/server/constants'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point devuelve todos los registros de esta entidad que coincidan con la query enviada
 */
router.get('/', (req, res) => {
  // if (req.user.role != 'admin') return res.status(401).send('Unauthorized')
  // se obtienen los parametros del request
  let query = req.query

  // se obtiene los usuarios de la base de datos
  getUser(query, (err, response) => {
    // se verifica si hay algun error
    if (err)
      return res.status(500).json({error: err})
    res.json(response)
  })
})

/*
 * Este endpoint crea un nuevo registro
 */
router.post('/', (req, res) => {
  // debugger
  let params = req.body
  addUser(params, (err, user) => {
    if (err)
      return res.status(500).json({error: err})
    res.json({data: user})
  })
})

/*
 * Este endpoint devuelve un registro especifico
 */
router.get('/:id', (req, res) => {
  let id = {
    _id: req.params.id,
    _matchExactly: '1'
  }
  getUser(id, (err, response) => {
    if (err)
      return res.status(500).json({error: err})
    res.json(response)
  })
})

/*
 * Este endpoint actualiza un registro especifico
 */
router.put('/:id', (req, res) => {
  let params = req.body
  let id = req.params.id
  updateUser(id, params, (err, user) => {
    if (err)
      return res.status(500).json({error: err})
    res.json({data: user})
  })
})

/*
 * Este endpoint elimina un registro especifico
 */
router.delete('/:id', (req, res) => {
  let id = req.params.id
  removeUser(id, (err, info) => {
    if (err)
      return res.status(500).json({error: err})
    res.json({data: info})
  })
})

/*
 * Este endpoint crea un nuevo indice en el arreglo relacionado
 */
router.put('/:id/language', (req, res) => {
  let idLanguage = req.body.idLanguage
  let id = req.params.id
  addRelationLanguage(id, idLanguage, (err, info) => {
    if (err)
      return res.status(500).json({error: err})
    res.json({data: info})
  })
})

/*
 * Este endpoint elimina un indice en el arreglo relacionado
 */
router.delete('/:id/language', (req, res) => {
  let idLanguage = req.body.idLanguage
  let id = req.params.id
  removeRelationLanguage(id, idLanguage, (err, info) => {
    if (err)
      return res.status(500).json({error: err})
    res.json({data: info})
  })
})

/*
 * Este endpoint permite subir una imagen al servidor
 */
router.post('/photo', (req, res) => {
  // se sube la foto al server
  fs.unlink(_rootPath + EXTERNAL_BASE_PATH + req.user.profileImg, (err) => {
    if (err)
      console.log('fs.unlink', err);
  });

  uploadSingleFile(req, res, 'userPhoto', (err, result) => {
    if (err)
      return res.status(500).json({error: err})
    res.json({data: result.data.publicFilePath})
  });

})

// se exporta el nuevo router
export default router
