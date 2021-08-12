const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Comment = require('../lib/models/Comment');
const Post = require('../lib/models/Post.js');

jest.mock('../lib/middleware/ensure-auth.js', () => (req, res, next) => {
  req.user = {
    username: 'test_user',
    avatar_url: 'http://example.com/image.png'
  };
  next();
});

describe('bonus routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('10 most popular users', async () => {
    for(let i = 0; i < 11; i++) {
      const user = await User.insert({ github_login: `user${i + 1}`, github_avatar_url: 'http://example.com/image.png' });
      const postName = `post${i + 1}`;
      await Post.insert({ photo_url: 'http://example.com/photo3.jpg', caption: `haha, this is post ${postName}`, tags: ['relatable', 'cool', 'influencer'], username: user.github_login });
    }

    for(let i = 0; i < 10; i++) {
      const postIndex = i + 1;
      await Comment.insert({ 
        comment: 'groovy',
        comment_by: `user${postIndex}`,
        post: postIndex
      });
    }

    for(let i = 0; i < 5; i++) {
      const postIndex = i + 1;
      await Comment.insert({ 
        comment: 'groovy',
        comment_by: `user${postIndex}`,
        post: postIndex
      });
    }

    for(let i = 0; i < 2; i++) {
      const postIndex = i + 1;
      await Comment.insert({ 
        comment: 'groovy',
        comment_by: `user${postIndex}`,
        post: postIndex
      });
    }

    const res = await request(app).get('/api/v1/users/popular');

    expect(res.body.length).toEqual(10);
    expect(res.body).toEqual([
      { github_login: 'user1', rank: '1' },
      { github_login: 'user2', rank: '1' },
      { github_login: 'user4', rank: '3' },
      { github_login: 'user3', rank: '3' },
      { github_login: 'user5', rank: '3' },
      { github_login: 'user9', rank: '6' },
      { github_login: 'user6', rank: '6' },
      { github_login: 'user10', rank: '6' },
      { github_login: 'user7', rank: '6' },
      { github_login: 'user8', rank: '6' }
    ]);
  });

  it('10 highest posting users', async () => {
    for(let i = 0; i < 11; i++) {
      const user = await User.insert({ github_login: `user${i + 1}`, github_avatar_url: 'http://example.com/image.png' });
      const postName = `post${i + 1}`;
      await Post.insert({ photo_url: 'http://example.com/photo3.jpg', caption: `haha, this is post ${postName}`, tags: ['relatable', 'cool', 'influencer'], username: user.github_login });
    }

    for(let i = 0; i < 10; i++) {
      const postName = i + 1;
      await Post.insert({ photo_url: 'http://example.com/photo3.jpg', caption: `haha, this is post ${postName}`, tags: ['relatable', 'cool', 'influencer'], username: `user${i + 1}` });
    }

    for(let i = 0; i < 5; i++) {
      const postName = i + 1;
      await Post.insert({ photo_url: 'http://example.com/photo3.jpg', caption: `haha, this is post ${postName}`, tags: ['relatable', 'cool', 'influencer'], username: `user${i + 1}` });
    }

    for(let i = 0; i < 2; i++) {
      const postName = i + 1;
      await Post.insert({ photo_url: 'http://example.com/photo3.jpg', caption: `haha, this is post ${postName}`, tags: ['relatable', 'cool', 'influencer'], username: `user${i + 1}` });
    }

    const res = await request(app).get('/api/v1/users/prolific');
    
    expect(res.body.length).toEqual(10);
    expect(res.body).toEqual([
      { github_login: 'user1', rank: '1' },
      { github_login: 'user2', rank: '1' },
      { github_login: 'user4', rank: '3' },
      { github_login: 'user3', rank: '3' },
      { github_login: 'user5', rank: '3' },
      { github_login: 'user9', rank: '6' },
      { github_login: 'user6', rank: '6' },
      { github_login: 'user10', rank: '6' },
      { github_login: 'user7', rank: '6' },
      { github_login: 'user8', rank: '6' }
    ]);
  });

  it('10 most commenting users', async () => {
    for(let i = 0; i < 11; i++) {
      const user = await User.insert({ github_login: `user${i + 1}`, github_avatar_url: 'http://example.com/image.png' });
      const postName = `post${i + 1}`;
      await Post.insert({ photo_url: 'http://example.com/photo3.jpg', caption: `haha, this is post ${postName}`, tags: ['relatable', 'cool', 'influencer'], username: user.github_login });
    }

    for(let i = 0; i < 10; i++) {
      const postIndex = i + 1;
      await Comment.insert({ 
        comment: 'groovy',
        comment_by: `user${postIndex}`,
        post: postIndex
      });
    }

    for(let i = 0; i < 5; i++) {
      const postIndex = i + 1;
      await Comment.insert({ 
        comment: 'groovy',
        comment_by: `user${postIndex}`,
        post: postIndex
      });
    }

    for(let i = 0; i < 2; i++) {
      const postIndex = i + 1;
      await Comment.insert({ 
        comment: 'groovy',
        comment_by: `user${postIndex}`,
        post: postIndex
      });
    }

    const res = await request(app).get('/api/v1/users/leader');
    
    expect(res.body.length).toEqual(10);
    expect(res.body).toEqual([
      { github_login: 'user1', rank: '1' },
      { github_login: 'user2', rank: '1' },
      { github_login: 'user4', rank: '3' },
      { github_login: 'user3', rank: '3' },
      { github_login: 'user5', rank: '3' },
      { github_login: 'user9', rank: '6' },
      { github_login: 'user6', rank: '6' },
      { github_login: 'user10', rank: '6' },
      { github_login: 'user7', rank: '6' },
      { github_login: 'user8', rank: '6' }
    ]);
  });
  
  it('Top 10 highest users by comment avg per post', async () => {
    for(let i = 0; i < 11; i++) {
      const user = await User.insert({ github_login: `user${i + 1}`, github_avatar_url: 'http://example.com/image.png' });
      const postName = `post${i + 1}`;
      await Post.insert({ photo_url: 'http://example.com/photo3.jpg', caption: `haha, this is post ${postName}`, tags: ['relatable', 'cool', 'influencer'], username: user.github_login });
    }

    for(let i = 0; i < 10; i++) {
      const postIndex = i + 1;
      await Comment.insert({ 
        comment: 'groovy',
        comment_by: `user${postIndex}`,
        post: postIndex
      });
    }

    for(let i = 0; i < 5; i++) {
      const postIndex = i + 1;
      await Comment.insert({ 
        comment: 'groovy',
        comment_by: `user${postIndex}`,
        post: postIndex
      });
    }

    for(let i = 0; i < 2; i++) {
      const postIndex = i + 1;
      await Comment.insert({ 
        comment: 'groovy',
        comment_by: `user${postIndex}`,
        post: postIndex
      });
    }

    const res = await request(app).get('/api/v1/users/impact');
    
    expect(res.body.length).toEqual(10);
    expect(res.body).toEqual([
      { username: 'user2', count: '3' },
      { username: 'user1', count: '3' },
      { username: 'user3', count: '2' },
      { username: 'user5', count: '2' },
      { username: 'user4', count: '2' },
      { username: 'user6', count: '1' },
      { username: 'user8', count: '1' },
      { username: 'user9', count: '1' },
      { username: 'user10', count: '1' },
      { username: 'user7', count: '1' }
    ]);
  });
});
