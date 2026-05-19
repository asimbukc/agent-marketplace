import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  MapPin, 
  DollarSign, 
  Bed, 
  Bath, 
  Maximize, 
  Upload,
  Plus, 
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';

export default function PostProperty() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'rent',
    propertyType: 'Modern Bungalow',
    bedrooms: '',
    bathrooms: '',
    size: '',
    images: [],
    features: [],
    lat: '',
    lng: ''
  });

  const [featureTag, setFeatureTag] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Session expired. Please login again.');
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ image: base64 })
        });

        if (!res.ok) throw new Error('Cloudinary upload failed');
        const data = await res.json();
        return data.url;
      });

      const cloudinaryUrls = await Promise.all(uploadPromises);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...cloudinaryUrls] }));
    } catch (err) {
      setError("Cloudinary integration failed. Check your environment variables.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const addFeature = () => {
    if (featureTag.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, featureTag.trim()] }));
      setFeatureTag('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length < 10) newErrors.title = 'Title too short (min 10 chars)';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length < 50) newErrors.description = 'Description too short (min 50 chars)';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Invalid price';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setError('Please fix the errors below');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to post an ad');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
          size: Number(formData.size),
          lat: Number(formData.lat),
          lng: Number(formData.lng)
        })
      });

      if (!response.ok) {
        let errorMessage = 'Failed to post ad';
        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch (e) {
          errorMessage = `Server Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setTimeout(() => navigate('/search'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col lg:px-8 px-4 pt-20 pb-10 max-w-[1600px] mx-auto w-full">
        <header className="mb-6 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold tracking-tight">Post Your Ad</h1>
              <p className="font-sans text-gray-500 text-xs">Reach premium buyers with a professional property listing.</p>
            </div>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-1.5 rounded-sm flex items-center gap-2 font-sans text-[10px]"
              >
                <AlertCircle className="w-3 h-3" />
                {error}
              </motion.div>
            )}
          </div>
        </header>

        {success ? (
          <div className="flex-grow flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-primary/20 rounded-md p-10 text-center max-w-md w-full"
            >
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-display font-bold mb-1">Ad Published!</h2>
              <p className="font-sans text-gray-400 text-xs mb-4">Your property is now live in the marketplace.</p>
              <Loader2 className="w-5 h-5 text-primary animate-spin mx-auto" />
            </motion.div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:h-[calc(100vh-180px)]">
            <div className="bg-neutral-950/50 border border-white/5 rounded-lg p-5 flex flex-col space-y-5 lg:overflow-y-auto custom-scrollbar shadow-2xl">
              <h3 className="font-nunito text-[10px] font-bold text-primary uppercase tracking-[0.2em] border-b border-white/5 pb-2">01. Identity</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-nunito text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Ad Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="Grand Coastal Villa..."
                    value={formData.title}
                    onChange={handleInputChange}
                    className="font-sans w-full bg-black border border-white/10 rounded-sm py-2 px-3 focus:outline-none focus:border-primary transition-all text-xs"
                  />
                  {errors.title && <p className="text-red-500 text-[9px] mt-1 ml-1">{errors.title}</p>}
                </div>
                <div className="space-y-1.5 flex-grow">
                  <label className="font-nunito text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={8}
                    placeholder="Describe key highlights..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="font-sans w-full bg-black border border-white/10 rounded-sm py-2 px-3 focus:outline-none focus:border-primary transition-all text-xs resize-none"
                  />
                  {errors.description && <p className="text-red-500 text-[9px] mt-1 ml-1">{errors.description}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-nunito text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Listing Type</label>
                    <div className="flex bg-black border border-white/10 rounded-sm p-0.5">
                       {['rent', 'buy'].map((type) => (
                         <button
                           key={type}
                           type="button"
                           onClick={() => setFormData(prev => ({ ...prev, type }))}
                           className={`flex-1 py-1.5 rounded-[1px] font-nunito text-[9px] font-bold uppercase transition-all ${
                             formData.type === type 
                               ? 'bg-primary text-black' 
                               : 'text-gray-500 hover:text-white'
                           }`}
                         >
                           {type}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-nunito text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Price ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
                      <input
                        type="number"
                        name="price"
                        required
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="font-sans w-full bg-black border border-white/10 rounded-sm py-2 px-3 pl-7 focus:outline-none focus:border-primary transition-all text-xs"
                      />
                    </div>
                    {errors.price && <p className="text-red-500 text-[9px] mt-1 ml-1">{errors.price}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-950/50 border border-white/5 rounded-lg p-5 flex flex-col space-y-5 lg:overflow-y-auto custom-scrollbar shadow-2xl">
              <h3 className="font-nunito text-[10px] font-bold text-primary uppercase tracking-[0.2em] border-b border-white/5 pb-2">02. Specifics</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-nunito text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Full Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
                    <input
                      type="text"
                      name="location"
                      required
                      placeholder="City, State, Country"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="font-sans w-full bg-black border border-white/10 rounded-sm py-2 pl-7 pr-3 focus:outline-none focus:border-primary transition-all text-xs"
                    />
                  </div>
                  {errors.location && <p className="text-red-500 text-[9px] mt-1 ml-1">{errors.location}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-nunito text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Latitude</label>
                    <input
                      type="text"
                      name="lat"
                      placeholder="e.g. 40.7128"
                      value={formData.lat}
                      onChange={handleInputChange}
                      className="font-sans w-full bg-black border border-white/10 rounded-sm py-2 px-3 focus:outline-none focus:border-primary transition-all text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-nunito text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Longitude</label>
                    <input
                      type="text"
                      name="lng"
                      placeholder="e.g. -74.0060"
                      value={formData.lng}
                      onChange={handleInputChange}
                      className="font-sans w-full bg-black border border-white/10 rounded-sm py-2 px-3 focus:outline-none focus:border-primary transition-all text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-nunito text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Property Category</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="font-sans w-full bg-black border border-white/10 rounded-sm py-2 px-3 focus:outline-none focus:border-primary transition-all text-xs appearance-none cursor-pointer"
                  >
                    <option>Modern Bungalow</option>
                    <option>Sleek Penthouse</option>
                    <option>Coastal Villa</option>
                    <option>Urban Apartment</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-nunito text-[8px] font-bold text-gray-600 uppercase tracking-widest ml-1">Bedrooms</label>
                    <div className="relative">
                      <Bed className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
                      <input
                        type="number"
                        name="bedrooms"
                        required
                        placeholder="2"
                        value={formData.bedrooms}
                        onChange={handleInputChange}
                        className="font-sans w-full bg-black border border-white/10 rounded-sm py-2 pl-7 pr-2 focus:outline-none focus:border-primary transition-all text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-nunito text-[8px] font-bold text-gray-600 uppercase tracking-widest ml-1">Bathrooms</label>
                    <div className="relative">
                      <Bath className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
                      <input
                        type="number"
                        name="bathrooms"
                        required
                        placeholder="1"
                        value={formData.bathrooms}
                        onChange={handleInputChange}
                        className="font-sans w-full bg-black border border-white/10 rounded-sm py-2 pl-7 pr-2 focus:outline-none focus:border-primary transition-all text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-nunito text-[8px] font-bold text-gray-600 uppercase tracking-widest ml-1">Sq Metres</label>
                    <div className="relative">
                      <Maximize className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-600" />
                      <input
                        type="number"
                        name="size"
                        required
                        placeholder="120"
                        value={formData.size}
                        onChange={handleInputChange}
                        className="font-sans w-full bg-black border border-white/10 rounded-sm py-2 pl-7 pr-2 focus:outline-none focus:border-primary transition-all text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-950/50 border border-white/5 rounded-lg p-5 flex flex-col space-y-5 lg:overflow-y-auto custom-scrollbar shadow-2xl">
              <h3 className="font-nunito text-[10px] font-bold text-primary uppercase tracking-[0.2em] border-b border-white/5 pb-2">03. Assets</h3>
              <div className="space-y-5">
                <div className="space-y-2.5">
                  <label className="font-nunito text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Gallery</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 hover:border-primary/50 bg-black/50 rounded-sm h-32 flex flex-col items-center justify-center cursor-pointer transition-all group"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple 
                      accept="image/*"
                      className="hidden" 
                    />
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors mb-2" />
                        <span className="text-[10px] font-bold uppercase text-gray-600 tracking-wider">Upload Assets</span>
                      </>
                    )}
                  </div>
                  {errors.images && <p className="text-red-500 text-[9px] mt-1 ml-1">{errors.images}</p>}
                  
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-sm overflow-hidden border border-white/10 group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute inset-0 bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                   <label className="font-nunito text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Key Features</label>
                   <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Pool, Gym, Security..."
                        value={featureTag}
                        onChange={(e) => setFeatureTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        className="font-sans flex-grow bg-black border border-white/10 rounded-sm py-2 px-3 focus:outline-none focus:border-primary transition-all text-xs"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 rounded-sm flex items-center justify-center transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  <div className="flex flex-wrap gap-2 pt-1 max-h-24 overflow-y-auto custom-scrollbar">
                    {formData.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-primary/5 border border-primary/20 text-primary px-3 py-1.5 rounded-sm">
                        <span className="font-oswald text-[9px] font-bold uppercase tracking-wider">{feature}</span>
                        <button type="button" onClick={() => removeFeature(idx)}>
                          <X className="w-3 h-3 px-1" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || isUploading}
                  className="w-full bg-primary hover:bg-primary-600 active:bg-primary-700 text-black py-4 rounded-sm font-nunito font-bold text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Publish Ad
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--color-primary);
        }
      `}</style>
    </div>
  );
}
