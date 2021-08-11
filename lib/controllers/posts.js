const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth.js');
const Post = require('../models/Post.js');

module.exports = Router()
  .post('/', ensureAuth, async (req, res, next) => {
    try {
      const post = await Post.insert({ ...req.body, username: req.user.username });

      res.send(post);
    } catch(err) {
      next(err);
    }
  });
