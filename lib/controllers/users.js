const { Router } = require('express');
const User = require('../models/User.js');

module.exports = Router()
  .get('/popular', async (req, res, next) => {
    try {
      const popularUsers = await User.getPopularUsers();

      res.send(popularUsers);
    } catch(error) {
      next(error);
    }
  });
