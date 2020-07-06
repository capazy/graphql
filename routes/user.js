const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/user', async (req, res) => {
  try {
    const token = await jwt.sign(
      { userId: req.user.id, email: req.user },
      'jwtsecretkey',
      {
        expiresIn: '24h',
      }
    );
    const result = {
      auth: { userId: req.user.id, token, tokenExp: 24 },
      user: req.user,
    };
    return res.send(result);
  } catch (error) {
    console.log(error);
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
