import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Chat || mongoose.model('Chat', chatSchema);
