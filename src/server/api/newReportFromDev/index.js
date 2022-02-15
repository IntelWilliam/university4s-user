import express from 'express'
import { accessPlatform, accessLaboratory, approveDifficult } from 'src/server/lib/newReportFromDev'

// se crea el nuevo router para almacenar rutas
const router = express.Router()

/*
 * Este end point agrega un dato
 */
router.post('/access-platform', (req, res) => {
  let params = req.body
  console.log('access-platform - /', params);
  accessPlatform(params, (err, resp) => {
    if (err) return res.status(500).json(err)
    res.json(resp)
  })
})

/*
* Este end point agrega un dato
 */
router.post('/access-laboratory', (req, res) => {
  let params = req.body
  console.log('access-laboratory - /', params);
  accessLaboratory(params, (err, resp) => {
    if (err) return res.status(500).json(err)
    res.json(resp)
  })
})

/*
* Este end point agrega un dato
 */
router.post('/approve-difficult', (req, res) => {
  let params = req.body
  console.log('approve-difficult - /', params);
  approveDifficult(params, (err, resp) => {
    if (err) return res.status(500).json(err)
    res.json(resp)
  })
})


// se exporta el nuevo router
export default router
