const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/middleware/ensure-auth.js', () => (req, res, next) => {
  req.user = {
    username: 'test_user',
    avatar_url: 'http://example.com/image.png'
  };
  next();
});

describe('tardygram auth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('returns user information from github', async () => {
    const res = await request(app).get('/api/v1/auth/verify');
    expect(res.body).toEqual({
      username: 'test_user',
      avatar_url: 'http://example.com/image.png'
    })
  });
});
