import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
  type: { type: String, enum: ['buy', 'rent'], required: true },
  propertyType: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  size: { type: Number, required: true },
  images: [{ type: String }],
  features: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Property || mongoose.model('Property', propertySchema);
