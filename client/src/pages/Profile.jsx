import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Mail, AtSign, Lock, Camera, Check, AlertCircle, Home, Upload, Loader2, X, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { useNavigate, Link } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    avatar: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [savedProperties, setSavedProperties] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data);
      setFormData({
        name: data.name,
        username: data.username,
        email: data.email,
        avatar: data.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        password: '',
      });

      const bookmarksRes = await fetch('/api/auth/bookmarks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (bookmarksRes.ok) {
        const bookmarksData = await bookmarksRes.json();
        setSavedProperties(bookmarksData);
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem('token');
      navigate('/auth');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const removeBookmark = async (propertyId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('/api/auth/toggle-bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ propertyId })
      });

      if (res.ok) {
        setSavedProperties(prev => prev.filter(p => p._id !== propertyId));
      }
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (formData.username.length < 3) newErrors.username = 'Username too short';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    setIsUploading(true);
    try {
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
      
      setFormData(prev => ({ ...prev, avatar: data.url }));
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Cloudinary upload failed. Check keys.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsUpdating(true);
    setMessage(null);
    setErrors({});

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.field) {
          setErrors({ [data.field]: data.message });
        } else {
          setMessage({ type: 'error', text: data.message || 'Update failed' });
        }
        return;
      }

      setUser(data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30 pb-20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900 border border-white/10 rounded-md overflow-hidden p-6 md:p-8 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 flex flex-col items-center gap-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer"
              >
                <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-white/10 bg-neutral-800 transition-all group-hover:border-primary/50">
                  <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 bg-primary text-black p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                  <Camera className="w-4 h-4" />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-display font-bold leading-tight">{user?.name}</p>
                <p className="font-nunito text-primary text-[11px] font-bold uppercase tracking-[0.2em] leading-none mt-1">@{user?.username}</p>
              </div>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2 border border-white/5 bg-white/2 hover:bg-white/5 rounded-sm transition-all text-[10px] font-bold uppercase tracking-widest text-gray-400 font-nunito"
              >
                <Upload className="w-3 h-3" />
                Replace Picture
              </button>
            </div>

            <div className="w-full md:w-2/3 border-l border-white/5 pl-0 md:pl-8">
              <div className="mb-6">
                <h2 className="text-xl font-display font-bold mb-1">My Profile</h2>
                <p className="font-sans text-gray-500 text-[10px] uppercase tracking-wider font-bold">Manage your account</p>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-2.5 rounded-sm mb-6 flex items-center gap-3 ${
                    message.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'
                  }`}
                >
                  {message.type === 'success' ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span className="font-bold text-[10px] uppercase tracking-wider">{message.text}</span>
                </motion.div>
              )}

              <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2 md:col-span-1 text-black">
                  <label className="font-nunito text-[9px] text-gray-500 font-bold uppercase ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="font-sans w-full bg-black border border-white/10 rounded-sm py-2 pl-9 pr-3 focus:outline-none focus:border-primary transition-all text-white text-[13px]"
                      placeholder="Your Name"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-[9px] mt-1 ml-1 font-sans">{errors.name}</p>}
                </div>

                <div className="space-y-1 col-span-2 md:col-span-1 text-black">
                  <label className="font-nunito text-[9px] text-gray-500 font-bold uppercase ml-1">Username</label>
                  <div className="relative group">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="font-sans w-full bg-black border border-white/10 rounded-sm py-2 pl-9 pr-3 focus:outline-none focus:border-primary transition-all text-white text-[13px]"
                      placeholder="username"
                    />
                  </div>
                  {errors.username && <p className="text-red-500 text-[9px] mt-1 ml-1 font-sans">{errors.username}</p>}
                </div>

                <div className="space-y-1 col-span-2 text-black">
                  <label className="font-nunito text-[9px] text-gray-500 font-bold uppercase ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="font-sans w-full bg-black border border-white/10 rounded-sm py-2 pl-9 pr-3 focus:outline-none focus:border-primary transition-all text-white text-[13px]"
                      placeholder="email@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-[9px] mt-1 ml-1 font-sans">{errors.email}</p>}
                </div>

                <div className="space-y-1 col-span-2 text-black">
                  <label className="font-nunito text-[9px] text-gray-500 font-bold uppercase ml-1">Change Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="font-sans w-full bg-black border border-white/10 rounded-sm py-2 pl-9 pr-3 focus:outline-none focus:border-primary transition-all text-white text-[13px]"
                      placeholder="Leave empty to keep current"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-[9px] mt-1 ml-1 font-sans">{errors.password}</p>}
                </div>

                <div className="col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="font-nunito w-full md:w-auto bg-primary hover:bg-primary-600 active:bg-primary-700 text-black font-bold px-6 py-2 rounded-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-[11px] uppercase tracking-widest"
                  >
                    {isUpdating ? (
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Save Changes</span>
                        <Check className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="bg-neutral-900 border border-white/10 rounded-md p-6">
            <h3 className="text-lg font-display font-bold mb-5">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-sm border border-white/5">
                <div className="flex items-center gap-3">
                  <Home className="text-primary w-4 h-4" />
                  <div>
                    <p className="font-semibold text-xs">Viewed Mansion in NY</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">2 hours ago</p>
                  </div>
                </div>
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              </div>
            </div>
          </div>
          
          <div className="bg-neutral-900 border border-white/10 rounded-md p-6">
            <h3 className="text-lg font-display font-bold mb-5">Saved Properties</h3>
            <div className="space-y-4">
              {savedProperties.length === 0 ? (
                <div className="flex items-center justify-center h-20 border border-dashed border-white/10 rounded-sm">
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">No saved properties yet</p>
                </div>
              ) : (
                savedProperties.map(property => (
                  <div key={property._id} className="flex items-center gap-4 p-2 bg-black/20 rounded-sm border border-white/5 group hover:border-primary/20 transition-all">
                    <div className="w-16 h-12 rounded-sm overflow-hidden shrink-0">
                      <img src={property.images?.[0]} alt={property.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <Link to={`/property/${property._id}`} className="text-xs font-bold hover:text-primary transition-colors block truncate">{property.title}</Link>
                      <p className="text-[9px] text-primary font-bold uppercase">${property.price.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => removeBookmark(property._id)}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                       <X className="w-3.5 h-3.5" />
                    </button>
                    <Link to={`/property/${property._id}`} className="p-2 text-gray-400 hover:text-primary transition-colors">
                       <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
