import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { mongodbUri } from './src/config.js';

// Import models
import User from './src/models/User.js';
import Message from './src/models/Message.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const newUser = new User({
    username,
    password, // In a real app, you should hash the password
    profilePicture: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
  });

  await newUser.save();

  res.status(201).json({ message: 'User created successfully' });
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const user = await User.findOne({ username, password }); // In a real app, compare hashed passwords

  if (user) {
    res.status(200).json({ user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/auth/updateUser', async (req, res) => {
  const { userId, updatedData } = req.body;

  if (!userId || !updatedData) {
    return res.status(400).json({ message: 'User ID and updated data are required' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

app.get('/api/messages', async (req, res) => {
  const { recipient } = req.query;
  const messages = await Message.find({ recipient }).sort({ timestamp: -1 });
  res.status(200).json({ messages });
});

app.post('/api/messages', async (req, res) => {
  const newMessage = new Message(req.body);
  await newMessage.save();
  res.status(201).json({ message: 'Message sent successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
