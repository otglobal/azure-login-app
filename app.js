const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Simple in-memory user store (not suitable for production)
const users = {
  admin: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4' // SHA256 hash of "1234"
};

app.get('/', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form action="/login" method="post">
      <input type="text" name="username" placeholder="Username" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <input type="submit" value="Login">
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

  if (users[username] && users[username] === hashedPassword) {
    res.send('Login successful');
  } else {
    res.status(401).send('Login failed');
  }
});

// Route with XSS vulnerability
app.get('/greet', (req, res) => {
  const name = req.query.name || 'Guest';
  // XSS vulnerability: Directly inserting user input into the response
  res.send(`<h1>Hello, ${name}!</h1>`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
