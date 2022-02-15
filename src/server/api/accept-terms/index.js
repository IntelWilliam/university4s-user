import express from 'express'
import {addUserAccept} from "../../lib/acceptTerms";

const router = express.Router()

/*
 * Este endpoint crea un nuevo registro
 */
router.post('/', (req, res) => {
  let params = req.body
  // console.log('post param ', params);
  addUserAccept(params, (err, resp) => {
    if (err) return res.status(500).json(err)
    res.json(resp)
  })
})

export default router
