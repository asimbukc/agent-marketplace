import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  avatar: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  },
  role: {
    type: String,
    enum: ['user', 'agent', 'admin'],
    default: 'user',
  },
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
