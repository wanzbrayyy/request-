import mongoose from 'mongoose';
import { mongodbUri } from '@/config';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDB;
