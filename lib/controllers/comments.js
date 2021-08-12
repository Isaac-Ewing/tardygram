const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth.js');
const Comment = require('../models/Comment.js');

module.exports = Router()
  .post('/', ensureAuth, async (req, res, next) => {
    try {
      const comment = await Comment.insert({ ...req.body, comment_by: req.user.username });

      res.send(comment);
    } catch(err) {
      next(err);
    }
  })

  .delete('/:id', ensureAuth, async (req, res, next) => {
    try {
      const comment = await Comment.deleteById(req.params.id);
      
      res.send(comment);
    } catch(err) {
      next(err);
    }
  });
