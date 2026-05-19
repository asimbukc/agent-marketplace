import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Square, 
  MessageSquare, 
  Bookmark, 
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Share2
} from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) {
           throw new Error(response.status === 404 ? 'Property not found' : `Error ${response.status}`);
        }
        const data = await response.json();
        setProperty(data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(err.message || 'Failed to connect to server');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="font-sans text-[10px] uppercase tracking-widest opacity-50">Loading Excellence...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 pt-32 text-center">
          <h2 className="text-3xl font-display font-bold mb-4">{error || 'Property Not Found'}</h2>
          <Link to="/search" className="text-primary hover:underline font-nunito uppercase tracking-widest text-xs">Back to Search</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 selection:bg-primary selection:text-black">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28">
        <div className="flex items-center justify-between mb-8">
           <Link to="/search" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group">
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
             <span className="font-nunito text-[10px] font-bold uppercase tracking-widest">Back to Listings</span>
           </Link>
           <button className="text-gray-500 hover:text-white transition-colors">
             <Share2 className="w-4 h-4" />
           </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="w-full lg:w-[65%] space-y-12">
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[450px]">
  <div
    className={`rounded-md overflow-hidden border border-white/5 bg-neutral-900 ${
      property.images?.[1] || property.images?.[2]
        ? "col-span-3 row-span-2"
        : "col-span-4 row-span-2"
    }`}
  >
    <img
      src={
        property.images?.[0] ||
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000"
      }
      className="w-full h-full object-cover"
      alt={property.title}
    />
  </div>

  {property.images?.[1] && (
    <div className="rounded-md overflow-hidden border border-white/5 bg-neutral-900">
      <img
        src={property.images[1]}
        className="w-full h-full object-cover"
        alt="Gallery 1"
      />
    </div>
  )}

  {property.images?.[2] && (
    <div className="rounded-md overflow-hidden border border-white/5 bg-neutral-900">
      <img
        src={property.images[2]}
        className="w-full h-full object-cover"
        alt="Gallery 2"
      />
    </div>
  )}
</div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 mb-2">
                   <div className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-sm text-[8px] font-bold uppercase tracking-widest font-nunito">
                     {property.propertyType}
                   </div>
                   <div className="bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-sm text-[8px] font-bold uppercase tracking-widest font-nunito">
                     For {property.type}
                   </div>
                </div>
                <h1 className="text-3xl lg:text-4xl font-display font-bold">{property.title}</h1>
                <p className="font-sans flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin className="text-primary w-4 h-4" />
                  {property.location}
                </p>
              </div>
              
              <div className="bg-neutral-900 border border-white/10 p-3 rounded-md flex items-center gap-5">
                 <div className="text-right">
                    <p className="font-nunito text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1">Price</p>
                    <p className="text-2xl font-display font-bold text-primary leading-none">${property.price.toLocaleString()}</p>
                 </div>
                 <div className="h-10 w-px bg-white/5" />
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-sm overflow-hidden border border-white/10 bg-neutral-800 shrink-0">
                    <img src={property.owner?.avatar || `https://ui-avatars.com/api/?name=${property.owner?.name || 'Owner'}&background=random`} alt={property.owner?.name} className="w-full h-full object-cover" />
                   </div>
                   <div>
                    <p className="font-nunito text-[9px] text-gray-500 font-bold uppercase tracking-wider leading-none mb-1">Listed by</p>
                    <p className="font-bold text-[13px] leading-none">{property.owner?.name || 'Authorized Agent'}</p>
                   </div>
                 </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-primary rounded-full" />
                 About this place
              </h3>
              <p className="font-sans text-gray-400 leading-relaxed text-base">
                {property.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
               {property.features?.map((f, i) => (
                 <div key={i} className="flex items-center gap-2 bg-neutral-900 border border-white/5 px-4 py-2 rounded-sm text-[11px] font-bold uppercase tracking-wider text-gray-400 font-oswald">
                   <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                   {f}
                 </div>
               ))}
            </div>
          </div>

          <div className="w-full lg:w-[35%] space-y-8">
            <div className="bg-neutral-900 border border-white/10 p-6 rounded-md space-y-5 shadow-2xl">
              <h3 className="font-nunito border-b border-white/5 pb-3 uppercase tracking-wider text-[10px] font-bold text-gray-500">Property Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    <Square className="text-primary w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">Total Size</h4>
                    <p className="font-sans text-[10px] text-gray-500">{property.size} sqm</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    <BedDouble className="text-primary w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">Bedrooms</h4>
                    <p className="font-sans text-[10px] text-gray-500">{property.bedrooms} Modern Units</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-white/5 border border-white/5 rounded-sm flex items-center justify-center group-hover:border-primary/50 transition-colors">
                    <Bath className="text-primary w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">Bathrooms</h4>
                    <p className="font-sans text-[10px] text-gray-500">{property.bathrooms} Luxury Baths</p>
                  </div>
                </div>
              </div>
            </div>

            {property.nearbyPlaces?.length > 0 && (
            <div className="bg-neutral-900 border border-white/10 p-6 rounded-md space-y-4">
              <h3 className="font-nunito border-b border-white/5 pb-3 uppercase tracking-wider text-[10px] font-bold text-gray-500">Nearby Places</h3>
              <div className="font-nunito grid grid-cols-1 gap-2">
                {property.nearbyPlaces.map((place, i) => (
                   <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-sm border border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                      <span className="text-[11px] font-bold">{place.name} ({place.type})</span>
                    </div>
                    <span className="text-[9px] text-gray-500 uppercase font-bold">{place.distance}</span>
                  </div>
                ))}
              </div>
            </div>
            )}

            <div className="rounded-md overflow-hidden h-48 grayscale border border-white/10 group relative">
              <MapContainer center={property.lat && property.lng ? [property.lat, property.lng] : [20, 0]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {property.lat && property.lng && <Marker position={[property.lat, property.lng]} />}
              </MapContainer>
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            </div>

            <div className="flex gap-2">
              <Link 
                to={`/chat?target=${property.owner?.username || 'admin'}`} 
                className="font-nunito flex-grow bg-primary hover:bg-primary-600 text-black py-4 rounded-sm font-bold flex items-center justify-center gap-2 transition-all text-[11px] uppercase tracking-widest"
              >
                <MessageSquare className="w-4 h-4" />
                Contact Owner
              </Link>
              <button className="font-nunito bg-neutral-900 border border-white/10 hover:border-primary/50 text-white px-5 rounded-sm transition-all">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
