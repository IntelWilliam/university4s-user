import express from 'express'
import fs from 'fs'
import { sendConsult } from 'src/server/lib/incident'
import { uploadFile } from 'src/server/shared/fileUploader'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este endpoint envia un formulario con o sin archivo adjunto al buzón de consultas
 */
router.post('/', (req, res) => {
  uploadFile(req, res, (error, result) => {
    if (error)
      return res.status(500).json({ error: error })

    sendConsult(result, (err, response) => {
      if (err) {
        if (err['file']) { //Se pregunta si existe el archivo para eliminarlo
          fs.unlink(err['file'], (err) => {});
        }
        return res.status(500).json(err)
      }
      if (response['file']) { //Se pregunta si existe el archivo para eliminarlo
        fs.unlink(response['file'], (err) => {});
      }
      res.json({ 'ok': 'request sent' })
    })
  })

})

// se exporta el nuevo router
export default router
