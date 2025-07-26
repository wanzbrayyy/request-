import express from 'express';
import cors from 'cors';
import connectDB from './src/lib/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Import models
import User from './src/models/User.js';
import Message from './src/models/Message.js';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      profilePicture: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
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
