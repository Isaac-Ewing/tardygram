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

describe('tardygram routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a post via POST', async () => {
    const postInfo = { photo_url: 'http://example.com/photo.jpg', caption: 'Hahaha, so #relatable', tags: ['relatable', 'cool', 'influencer'], username: 'test_user' };

    const res = await request(app).post('/api/v1/posts').send(postInfo);

    expect(res.body).toEqual({ id: '1', ...postInfo });
  });
});
