import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: { type: String, default: 'free' },
  hitCount: { type: Number, default: 0 },
  profilePicture: { type: String, default: '' },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
