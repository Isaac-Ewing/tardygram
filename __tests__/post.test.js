const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Post = require('../lib/models/Post');

jest.mock('../lib/middleware/ensure-auth.js', () => (req, res, next) => {
  req.user = {
    username: 'test_user',
    avatar_url: 'http://example.com/image.png'
  };
  next();
});

describe('tardygram routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a post via POST', async () => {
    const user = await User.insert({ github_login: 'test_user', github_avatar_url: 'http://example.com/image.png' });
    const postInfo = { photo_url: 'http://example.com/photo.jpg', caption: 'Hahaha, so #relatable', tags: ['relatable', 'cool', 'influencer'] };

    const res = await request(app).post('/api/v1/posts').send(postInfo);

    expect(res.body).toEqual({ id: '1', ...postInfo, username: user.github_login });
  });

});
