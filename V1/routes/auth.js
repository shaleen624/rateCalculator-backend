const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/user');

// User Registration
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  User.findOne({ username: username })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Create a new user
      bcrypt.hash(password, 10)
        .then((hashedPassword) => {
          const newUser = new User({
            username: username,
            password: hashedPassword
          });

          newUser.save()
            .then(() => {
              res.status(201).json({ message: 'User registered successfully' });
            })
            .catch((error) => {
              res.status(500).json({ error: error.message });
            });
        });
    });
});

// User Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      // Compare the provided password with the hashed password
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(401).json({ message: 'Authentication failed' });
          }

          // Generate JWT token
          const token = jwt.sign(
            { userId: user._id, username: user.username },
            'your-secret-key', // Replace with your own secret key
            { expiresIn: '1h' } // Set expiration time
          );

          res.status(200).json({ token: token });
        });
    });
});

module.exports = router;
