const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ---- Mock DB (thay bằng MongoDB/MySQL sau) ----
const users = [];

// ---- REGISTER ----
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Missing required fields' });

  if (users.find(u => u.email === email))
    return res.status(409).json({ message: 'Email already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), name, email, phone, password: hashed };
  users.push(user);

  const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user.id, name, email } });
});

// ---- LOGIN ----
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user)
    return res.status(401).json({ message: 'Invalid email or password' });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(401).json({ message: 'Invalid email or password' });

  const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email } });
});

// ---- PROTECTED ROUTE (test) ----
app.get('/api/auth/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'secret');
    const user = users.find(u => u.id === decoded.id);
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));