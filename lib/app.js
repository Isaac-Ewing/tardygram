const express = require('express');
const app = express();
app.use(express.static(`${__dirname}/../public`));

app.use(express.json());
app.use(require('cookie-parser')());

app.use('/api/v1/auth', require('./controllers/auth.js'));
app.use('/api/v1/posts', require('./controllers/posts.js'));
app.use('/api/v1/comments', require('./controllers/comments.js'));
app.use('/api/v1/users', require('./controllers/users.js'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
