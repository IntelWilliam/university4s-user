import express from 'express';
import request from 'request';
import Constants from 'src/server/constants';

const router = express.Router();

router.post('', (req, res) => {
  request(
    {
      uri: (process.env.API_BASE_URL || Constants.API_BASE_URL) + 'pass_update',
      method: 'POST',
      form: {
        userEmail: req.body.userEmail,
        currentPass: req.body.currentPass,
        newPass: req.body.newPass,
      },
    },
    (error, response, body) => {
      let jsonResponse = JSON.parse(body);
      if (error || jsonResponse.status === false)
        return res.status(500).json(jsonResponse);
      res.json(jsonResponse);
    }
  );
});

export default router;
