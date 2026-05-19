import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

const router = express.Router();

// Get all chats for current user
router.get('/', protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: { $in: [req.userId] }
    })
    .populate('participants', 'name username avatar')
    .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get or create a chat with a specific user
router.post('/access', protect, async (req, res) => {
  const { userId, username } = req.body;

  if (!userId && !username) return res.status(400).json({ message: 'Target userId or username is required' });

  try {
    let targetUser;
    if (userId) {
      targetUser = await User.findById(userId);
    } else {
      targetUser = await User.findOne({ username });
    }

    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    let chat = await Chat.findOne({
      participants: { $all: [req.userId, targetUser._id] }
    }).populate('participants', 'name username avatar');

    if (chat) {
      return res.json(chat);
    }

    const newChat = new Chat({
      participants: [req.userId, targetUser._id],
      seenBy: [req.userId]
    });

    const savedChat = await newChat.save();
    const fullChat = await Chat.findById(savedChat._id).populate('participants', 'name username avatar');
    res.json(fullChat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a specific chat
router.get('/:chatId/messages', protect, async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .sort({ createdAt: 1 });
    
    // Mark chat as seen by this user when they fetch messages
    await Chat.findByIdAndUpdate(req.params.chatId, {
      $addToSet: { seenBy: req.userId }
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message via API (can also be done via Socket)
router.post('/message', protect, async (req, res) => {
  const { chatId, text } = req.body;
  if (!chatId || !text) return res.status(400).json({ message: 'chatId and text required' });

  try {
    const message = new Message({
      chatId,
      senderId: req.userId,
      text
    });

    await message.save();

    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: text,
      seenBy: [req.userId] // Only seen by sender initially
    });

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
