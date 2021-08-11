const pool = require('../utils/pool.js');

module.exports = class User {
  github_login;
  github_avatar_url;

  constructor(row) {
    this.github_login = row.github_login;
    this.github_avatar_url = row.github_avatar_url;
  }

  static async insert({ github_avatar_url, github_login }) {
    const { rows } = await pool.query('INSERT INTO users (github_avatar_url, github_login) VALUES ($1, $2) RETURNING *', [github_avatar_url, github_login]
    );
    return new User(rows[0]);
  }

  static async findByLogin(github_login) {
    const { rows } = await pool.query('SELECT * FROM users WHERE github_login = $1', [github_login]);
    if(!rows[0]) {
      return null;
    } else {
      return new User(rows[0]);
    }
  }

  toJSON() {
    return {
      github_login: this.github_login,
      github_avatar_url: this.github_avatar_url,
    };
  }
};
