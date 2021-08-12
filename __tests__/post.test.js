const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Post = require('../lib/models/Post');
const Comment = require('../lib/models/Comment');

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

  it('gets a post by id via GET', async () => {
    const user = await User.insert({ github_login: 'test_user', github_avatar_url: 'http://example.com/image.png' });
    const post = await Post.insert({ photo_url: 'http://example.com/photo.jpg', caption: 'Hahaha, so #relatable', tags: ['relatable', 'cool', 'influencer'], username: user.github_login });

    const res = await request(app).get(`/api/v1/posts/${post.id}`);

    expect(res.body).toEqual({ ...post });
  });

  it('gets all posts via GET', async () => {
    const user = await User.insert({ github_login: 'test_user', github_avatar_url: 'http://example.com/image.png' });
    const post1 = await Post.insert({ photo_url: 'http://example.com/photo1.jpg', caption: 'Hahaha, so #relatable', tags: ['relatable', 'cool', 'influencer'], username: user.github_login });
    const post2 = await Post.insert({ photo_url: 'http://example.com/photo2.jpg', caption: 'Hahaha, so #cool', tags: ['relatable', 'cool', 'influencer'], username: user.github_login });
    const post3 = await Post.insert({ photo_url: 'http://example.com/photo3.jpg', caption: 'Hahaha, so #jelly', tags: ['relatable', 'cool', 'influencer'], username: user.github_login });

    const res = await request(app).get('/api/v1/posts');

    expect(res.body).toEqual([{ ...post2 }, { ...post1 }, { ...post3 }]);
  });

  it('updates a post by id via PATCH', async () => {
    const user = await User.insert({ github_login: 'test_user', github_avatar_url: 'http://example.com/image.png' });
    const post = await Post.insert({ photo_url: 'http://example.com/photo.jpg', caption: 'Hahaha, so #relatable', tags: ['relatable', 'cool', 'influencer'], username: user.github_login });

    const res = await request(app)
      .patch(`/api/v1/posts/${post.id}`)
      .send({ caption: 'Nevermind, I do not relate to this anymore #unrelatable' });

    expect(res.body).toEqual({ 
      ...post,
      caption: 'Nevermind, I do not relate to this anymore #unrelatable'
    });
  });

  it('deletes a post by id via DELETE', async () => {
    const user = await User.insert({ github_login: 'test_user', github_avatar_url: 'http://example.com/image.png' });
    const post = await Post.insert({ photo_url: 'http://example.com/photo.jpg', caption: 'Hahaha, so #relatable', tags: ['relatable', 'cool', 'influencer'], username: user.github_login });

    const res = await request(app)
      .delete(`/api/v1/posts/${post.id}`);
      

    expect(res.body).toEqual({ ...post });
  });

  it('gets top 10 posts ranked by number of comments', async () => {
    const user = await User.insert({ github_login: 'test_user', github_avatar_url: 'http://example.com/image.png' });
    const post1 = await Post.insert({ photo_url: 'http://example.com/photo1.jpg', caption: 'Hahaha, so #relatable', tags: ['relatable', 'cool', 'influencer'], username: user.github_login });
    await Comment.insert({ 
      comment: 'groovy',
      comment_by: user.id,
      post: post1.id
    });
    await Comment.insert({ 
      comment: ' very groovy',
      comment_by: user.id,
      post: post1.id
    });
    await Comment.insert({ 
      comment: 'super groovy',
      comment_by: user.id,
      post: post1.id
    });
    const post2 = await Post.insert({ photo_url: 'http://example.com/photo2.jpg', caption: 'Hahaha, so #cool', tags: ['relatable', 'cool', 'influencer'], username: user.github_login });
    await Comment.insert({ 
      comment: 'bleh',
      comment_by: user.id,
      post: post2.id
    });
    await Comment.insert({ 
      comment: ' meh',
      comment_by: user.id,
      post: post2.id
    });

    const post3 = await Post.insert({ photo_url: 'http://example.com/photo3.jpg', caption: 'Hahaha, so #jelly', tags: ['relatable', 'cool', 'influencer'], username: user.github_login });
    await Comment.insert({ 
      comment: 'help me',
      comment_by: user.id,
      post: post3.id
    });

    for(let i = 0; i < 7; i++) {
      const postName = `post${i + 4}`;
      await Post.insert({ photo_url: 'http://example.com/photo3.jpg', caption: `haha, this is post ${postName}`, tags: ['relatable', 'cool', 'influencer'], username: user.github_login });
    }

    const res = await request(app).get('/api/v1/posts/popular');
    
    expect(res.body.length).toEqual(10);
    expect([res.body[0], res.body[1], res.body[2]]).toEqual([{ ...post1, rank: '1' }, { ...post2, rank: '2' }, { ...post3, rank: '3' }]);
  });
});
