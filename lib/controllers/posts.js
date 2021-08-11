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
  })
  .get('/:id', async (req, res, next) => {
    try {
      const post = await Post.getById(req.params.id);

      res.send(post);
    } catch(err) {
      next(err);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const posts = await Post.getAll();

      res.send(posts);
    } catch(err) {
      next(err);
    }
  })
  .patch('/:id', ensureAuth, async (req, res, next) => {
    try {
      const post = await Post.updateById(req.params.id, req.body);

      res.send(post);
    } catch(err) {
      next(err);
    }
  })
  .delete('/:id', ensureAuth, async (req, res, next) => {
    try {
      const post = await Post.deleteById(req.params.id);

      res.send(post);
    } catch(err) {
      next(err);
    }
  });
