const { Router } = require('express');
const jwt = require('jsonwebtoken');
const ensureAuth = require('../middleware/ensure-auth.js');
const UserService = require('../services/UserService.js');

const SINGLE_DAY = 1000 * 60 * 60 * 24;

module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=read:user`);
  })
  .get('/login/callback', async (req, res, next) => {
    try {
      const user = await UserService.create(req.query.code);
      const userJWT = jwt.sign(user.toJSON(), process.env.APP_SECRET, { expiresIn: '24h' });
      res.cookie('session', userJWT, { httpOnly: true, maxAge: SINGLE_DAY });
      res.redirect('/api/v1/auth/verify');
    } catch(error) {
      next(error);
    }
  })
  .get('/verify', ensureAuth, (req, res) => {
    res.send(req.user);
  });
