const { Router } = require('express');
const jwt = require('jsonwebtoken');
const ensureAuth = require('../middleware/ensure-auth.js');

module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=read:user`);
  })
  .get('/login/callback', async (req, res, next) => {
    try {
      
    } catch(error) {
        
    }
  });
