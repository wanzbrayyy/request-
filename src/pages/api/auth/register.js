import connectDB from '@/lib/db';
import User from '@/models/User';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
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
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
