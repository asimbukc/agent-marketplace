import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search as SearchIcon, MapPin, BedDouble, Bath, Bookmark, MessageSquare, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function Search() {
  const [properties, setProperties] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarking, setIsBookmarking] = useState(null);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    type: 'any',
    propertyType: 'any',
    minPrice: '',
    maxPrice: ''
  });

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserBookmarks(data.bookmarks || []);
        setCurrentUserId(data._id);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.type !== 'any') queryParams.append('type', filters.type.toLowerCase());
      if (filters.propertyType !== 'any') queryParams.append('propertyType', filters.propertyType);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

      const response = await fetch(`/api/properties?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setError(error.message || "Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchUser();
  }, []);

  const toggleBookmark = async (propertyId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to save properties");
      return;
    }

    setIsBookmarking(propertyId);
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
        const data = await res.json();
        setUserBookmarks(data.bookmarks);
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    } finally {
      setIsBookmarking(null);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      type: 'any',
      propertyType: 'any',
      minPrice: '',
      maxPrice: ''
    });
    setTimeout(() => fetchProperties(), 0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="flex flex-col lg:flex-row h-screen pt-20 overflow-hidden">
        <div className="w-full lg:w-[60%] overflow-y-auto px-4 sm:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-display font-bold mb-6">
              Search results for <span className="text-primary italic">Property</span>
            </h1>

            <form onSubmit={handleSearch} className="space-y-4 mb-10 font-nunito">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Location</label>
                <div className="relative text-black">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input 
                    type="text" 
                    name="location"
                    placeholder="City Location" 
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="font-sans w-full bg-neutral-900 border border-neutral-800 rounded-sm py-2 pl-9 pr-4 focus:outline-none focus:border-primary transition-all text-[13px] text-white placeholder-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div className="space-y-1 text-black">
                  <label className="text-[9px] text-gray-500 font-bold uppercase ml-1">Type</label>
                  <select 
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-sm py-2 px-3 focus:outline-none focus:border-primary transition-all text-[12px] text-white appearance-none cursor-pointer"
                  >
                    <option value="any">Any</option>
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>
                <div className="space-y-1 text-black">
                  <label className="text-[9px] text-gray-500 font-bold uppercase ml-1">Property</label>
                  <select 
                    name="propertyType"
                    value={filters.propertyType}
                    onChange={handleFilterChange}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-sm py-2 px-3 focus:outline-none focus:border-primary transition-all text-[12px] text-white appearance-none cursor-pointer"
                  >
                    <option value="any">Any</option>
                    <option>Modern Bungalow</option>
                    <option>Sleek Penthouse</option>
                    <option>Coastal Villa</option>
                  </select>
                </div>
                <div className="space-y-1 text-black">
                  <label className="text-[9px] text-gray-500 font-bold uppercase ml-1">Min Price</label>
                  <input 
                    type="number" 
                    name="minPrice"
                    placeholder="any" 
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-sm py-2 px-3 focus:outline-none focus:border-primary transition-all text-[12px] text-white placeholder-gray-600" 
                  />
                </div>
                <div className="space-y-1 text-black">
                  <label className="text-[9px] text-gray-500 font-bold uppercase ml-1">Max Price</label>
                  <input 
                    type="number" 
                    name="maxPrice"
                    placeholder="any" 
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-sm py-2 px-3 focus:outline-none focus:border-primary transition-all text-[12px] text-white placeholder-gray-600" 
                  />
                </div>
                <div className="flex items-end gap-2 font-nunito">
                  <button type="submit" className="flex-grow bg-primary hover:bg-primary-600 text-black h-8 rounded-sm flex items-center justify-center transition-all">
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <SearchIcon className="w-3.5 h-3.5" />}
                  </button>
                  <button 
                    type="button" 
                    onClick={clearFilters}
                    className="flex-grow bg-white/5 hover:bg-white/10 text-gray-400 h-8 rounded-sm flex items-center justify-center transition-all text-[10px] uppercase font-bold px-2"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-md text-center">
                  <p className="font-sans text-sm mb-2">Error connecting to marketplace</p>
                  <p className="font-mono text-[10px] opacity-70 mb-4">{error}</p>
                  <button 
                    onClick={fetchProperties}
                    className="text-[10px] uppercase tracking-widest font-bold underline hover:text-red-400 transition-colors"
                  >
                    Try Reconnecting
                  </button>
                </div>
              )}

              {isLoading && properties.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                   <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                   <p className="font-sans text-xs uppercase tracking-widest">Finding Properties...</p>
                </div>
              )}
              
              {!isLoading && properties.length === 0 && (
                <div className="text-center py-20">
                  <p className="font-sans text-gray-500">No properties found matching your criteria.</p>
                </div>
              )}

              {properties.map((property) => (
                <motion.div 
                  key={property._id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col md:flex-row gap-5 p-3 bg-neutral-900 border border-white/5 rounded-md hover:border-primary/20 transition-all group"
                >
                  <Link to={`/property/${property._id}`} className="w-full md:w-52 h-36 rounded-sm overflow-hidden shrink-0">
                    <img 
                      src={property.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000"} 
                      alt={property.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="flex flex-col justify-between py-0.5 flex-grow">
                    <div>
                      <Link to={`/property/${property._id}`}>
                        <h3 className="text-base font-display font-bold mb-1 group-hover:text-primary transition-colors leading-snug">
                          {property.title}
                        </h3>
                      </Link>
                      <p className="flex items-center gap-1 text-gray-500 text-[11px] mb-2 font-medium font-sans">
                        <MapPin className="w-3 h-3 text-primary" />
                        {property.location}
                      </p>
                      <div className="inline-block bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded-sm text-xs mb-3 font-nunito">
                        ${property.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[9px] text-gray-500 font-bold uppercase tracking-tight font-nunito">
                        <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-sm">
                          <BedDouble className="w-3 h-3 text-primary" />
                          <span>{property.bedrooms} bed</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-sm">
                          <Bath className="w-3 h-3 text-primary" />
                          <span>{property.bathrooms} bath</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-black">
                        <button 
                          onClick={() => toggleBookmark(property._id)}
                          disabled={isBookmarking === property._id}
                          className={`p-1.5 rounded-sm border transition-all ${
                            userBookmarks.includes(property._id) 
                              ? 'bg-primary/20 border-primary text-primary' 
                              : 'border-white/5 text-gray-500 hover:border-primary/50 hover:text-primary'
                          }`}
                        >
                          <Bookmark 
                            className={`w-3.5 h-3.5 ${userBookmarks.includes(property._id) ? 'fill-primary' : ''}`} 
                          />
                        </button>
                <Link
  to={
    property.owner?._id === currentUserId
      ? '#'
      : `/chat?target=${property.owner?._id || 'admin'}`
  }
  onClick={(e) => {
    if (property.owner?._id === currentUserId) {
      e.preventDefault();
    }
  }}
  className={`p-1.5 rounded-sm border transition-all ${
    property.owner?._id === currentUserId
      ? 'border-white/5 text-gray-700 opacity-50 cursor-not-allowed'
      : 'border-white/5 hover:border-primary/50 text-gray-500 hover:text-primary'
  }`}
>
  <MessageSquare className="w-3.5 h-3.5" />
</Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-[40%] relative">
          <div className="h-full w-full grayscale contrast-125 brightness-50">
            <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {properties.map(p => (
                p.lat && p.lng && (
                  <Marker key={p._id} position={[p.lat, p.lng]}>
                    <Popup>
                      <div className="p-1">
                        <div className="font-bold text-black">{p.title}</div>
                        <div className="text-black font-semibold text-primary">${p.price}</div>
                        <Link to={`/property/${p._id}`} className="text-[10px] text-primary underline mt-1 block">View Details</Link>
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
