import express from 'express';
import Property from '../models/Property.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/properties
// @desc    Create a new property
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, price, location, type, propertyType, bedrooms, bathrooms, size, images, features, nearbyPlaces, lat, lng } = req.body;

    const property = await Property.create({
      title,
      description,
      price,
      location,
      type,
      propertyType,
      bedrooms,
      bathrooms,
      size,
      images,
      lat,
      lng,
      owner: req.userId,
      features,
      nearbyPlaces
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/properties
// @desc    Get all properties (with filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, location, minPrice, maxPrice, propertyType } = req.query;
    let query = {};

    if (type && type !== 'any') query.type = type;
    if (propertyType && propertyType !== 'any') query.propertyType = propertyType;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(query).populate('owner', 'name avatar');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/properties/:id
// @desc    Get property by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name avatar');
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
