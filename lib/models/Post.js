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

  static async getById(id) {

    const { rows } = await pool.query('SELECT posts.id, caption, photo_url, tags, comments, username FROM posts LEFT JOIN users ON posts.username = users.github_login LEFT JOIN comments ON posts.id = comments.post WHERE posts.id=$1', [id]);

    return new Post(rows[0]);
  }

  static async getAll() {

    const { rows } = await pool.query('SELECT posts.id, caption, photo_url, tags, comments, username FROM posts LEFT JOIN users ON posts.username = users.github_login LEFT JOIN comments ON posts.id = comments.post ');

    return rows.map((row) => new Post(row));
  }

  static async updateById(id, { caption }) {
    const existingPost = await Post.getById(id);
    const newCaption = caption ?? existingPost.caption;
    const { rows } = await pool.query('UPDATE posts SET caption=$1 WHERE id=$2 RETURNING *', [newCaption, id]);

    return new Post(rows[0]);
  }

  static async deleteById(id) {

    const { rows } = await pool.query('DELETE FROM posts WHERE id=$1 RETURNING *', [id]);

    return new Post(rows[0]);
  }

  static async getTopTenPosts() {

    const { rows } = await pool.query(`
    SELECT 
    posts.id, caption, photo_url, tags, username, 
    RANK() OVER(ORDER BY COUNT(comments.post) DESC) 
    FROM posts  
    LEFT JOIN comments 
    ON posts.id = comments.post 
    GROUP BY posts.id 
    LIMIT 10 `);

    return rows;
  }
};
