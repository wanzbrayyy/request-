import connectDB from '@/lib/db';
import Message from '@/models/Message';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const { recipient } = req.query;
    const messages = await Message.find({ recipient }).sort({ timestamp: -1 });
    res.status(200).json({ messages });
  } else if (req.method === 'POST') {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
