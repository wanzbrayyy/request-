import connectDB from '@/lib/db';
import User from '@/models/User';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'POST') {
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
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
