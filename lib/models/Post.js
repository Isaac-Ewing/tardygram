const pool = require('../utils/pool.js');

module.exports = class Post {
  id;
  photo_url;
  caption;
  tags;
  username;

  constructor(row) {
    this.id = row.id;
    this.photo_url = row.photo_url;
    this.caption = row.caption;
    this.tags = row.tags;
    this.username = row.username;
  }

  static async insert({ photo_url, caption, tags, username }) {
    const { rows } = await pool.query('INSERT INTO posts (photo_url, caption, tags, username) VALUES ($1, $2, $3, $4) RETURNING *', [photo_url, caption, tags, username]);

    return new Post(rows[0]);
  }
};
