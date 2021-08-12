const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth.js');
const Comment = require('../models/Comment.js');

module.exports = Router()
  .post('/', ensureAuth, async (req, res, next) => {
    try {
      const post = await Comment.insert({ ...req.body, comment_by: req.user.username });

      res.send(post);
    } catch(err) {
      next(err);
    }
  });
