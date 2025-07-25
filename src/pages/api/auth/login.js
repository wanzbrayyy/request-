import connectDB from '@/lib/db';
import User from '@/models/User';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
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
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
