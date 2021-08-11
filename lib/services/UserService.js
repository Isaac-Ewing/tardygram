const User = require('../models/User.js');
const { exchangeCodeForToken, getUserProfile } = require('../utils/github.js');

module.exports = class UserService {
  static async create(code) {
    const token = await exchangeCodeForToken(code);
    const profile = await getUserProfile(token);
    const user = await User.findByLogin(profile.login);

    if(!user) {
      return User.insert({
        github_login: profile.login,
        github_avatar_url: profile.avatar_url
      });
    } else {
      return user;
    }
  }
};
