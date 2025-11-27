import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderUsername: { type: String, required: true },
  senderProfilePicture: { type: String },
  recipient: { type: String, required: true },
  text: { type: String, required: true },
  image: { type: String },
  link: { type: String },
  type: { type: String, required: true },
  hitInfo: {
    address: { type: String },
    ip: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    country: { type: String },
    device: { type: String },
    org: { type: String },
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
