
import express from 'express'
import { uploadFileChat} from 'src/server/shared/fileUploader'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este endpoint permite subir una imagen al servidor
 */
router.post('/', (req, res) => {
    // se sube la foto al server
    uploadFileChat(req, res, 'file', (err, result) => {
        if (err)
            return res.status(500).json({error: err})
        res.json({result})
    });

})

// se exporta el nuevo router
export default router
