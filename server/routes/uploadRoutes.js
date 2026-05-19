import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

let isConfigured = false;
const configureCloudinary = () => {
  if (isConfigured) return;
  
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary environment variables are missing (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
  
  isConfigured = true;
};

router.post('/', protect, async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ message: 'No image provided' });
    }

    configureCloudinary();

    const result = await cloudinary.uploader.upload(image, {
      folder: 'elite_estates',
      resource_type: 'auto'
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

export default router;
