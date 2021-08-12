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
  })
  .get('/prolific', async (req, res, next) => {
    try {
      const prolificUsers = await User.getProlificUsers();

      res.send(prolificUsers);
    } catch(error) {
      next(error);
    }
  })
  .get('/leader', async (req, res, next) => {
    try {
      const leadingUsers = await User.getLeadingUsers();

      res.send(leadingUsers);
    } catch(error) {
      next(error);
    }
  })
  .get('/impact', async (req, res, next) => {
    try {
      const impactfulUsers = await User.getImpactfulUsers();

      res.send(impactfulUsers);
    } catch(error) {
      next(error);
    }
  });
