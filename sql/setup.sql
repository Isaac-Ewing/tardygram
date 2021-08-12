DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS posts cascade;
DROP TABLE IF EXISTS comments cascade;

CREATE TABLE users (
    github_login TEXT NOT NULL PRIMARY KEY,
    github_avatar_url TEXT NOT NULL
);

CREATE TABLE posts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    photo_url TEXT NOT NULL,
    caption TEXT NOT NULL,
    tags TEXT [],
    username TEXT REFERENCES users(github_login)
);

CREATE TABLE comments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    comment_by TEXT REFERENCES users(github_login),
    post INT REFERENCES posts(id),
    comment TEXT NOT NULL
);
