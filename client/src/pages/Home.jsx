import { motion } from 'motion/react';
import { Search, MapPin, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [activeTab, setActiveTab] = useState('buy');

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-start gap-16">
              {/* Left Content */}
              <div className="w-full lg:w-3/5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="inline-block px-2 py-0.5 rounded-sm bg-primary/10 border border-primary/20 text-primary font-bold text-[9px] mb-6 uppercase tracking-widest">
                    Luxury Real Estate
                  </span>
                  <h1 className="text-4xl md:text-6xl font-display font-bold leading-[1.1] mb-8">
                    Find Real Estate <br />
                    <span className="text-primary italic">& Get Your</span> <br />
                    Dream Place
                  </h1>
                  <p className="font-sans text-gray-400 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
                    Discover a curated collection of premium high-end properties. Whether you're looking for a modern bungalow, a sleek penthouse, or a coastal villa, we have the perfect home for you.
                  </p>

                  {/* Search Box */}
                  <div className="bg-neutral-900 border border-white/10 rounded-md p-1.5 shadow-2xl">
                    <div className="flex gap-1 p-1 mb-1">
                      <button
                        onClick={() => setActiveTab('buy')}
                        className={`font-nunito px-4 py-1.5 rounded-sm text-[11px] font-bold transition-all uppercase tracking-wider ${
                          activeTab === 'buy' ? 'bg-primary text-black' : 'hover:bg-white/5 text-gray-500'
                        }`}
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => setActiveTab('rent')}
                        className={`font-nunito px-4 py-1.5 rounded-sm text-[11px] font-bold transition-all uppercase tracking-wider ${
                          activeTab === 'rent' ? 'bg-primary text-black' : 'hover:bg-white/5 text-gray-500'
                        }`}
                      >
                        Rent
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-3 p-1.5">
                      <div className="flex flex-col gap-1 pl-2 md:border-r border-white/5 font-nunito">
                        <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">City Location</label>
                        <div className="flex items-center gap-2">
                          <MapPin className="text-primary w-3.5 h-3.5" />
                          <input
                            type="text"
                            placeholder="New York, USA"
                            className="font-sans bg-transparent border-none outline-none text-[13px] text-white placeholder-gray-600 w-full"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 pl-2 md:border-r border-white/5 font-nunito">
                        <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Min Price</label>
                        <div className="flex items-center gap-2">
                          <DollarSign className="text-primary w-3.5 h-3.5" />
                          <input
                            type="text"
                            placeholder="Min Price"
                            className="font-sans bg-transparent border-none outline-none text-[13px] text-white placeholder-gray-600 w-full"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 pl-2 md:border-r border-white/5 font-nunito">
                        <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Max Price</label>
                        <div className="flex items-center gap-2">
                          <DollarSign className="text-primary w-3.5 h-3.5" />
                          <input
                            type="text"
                            placeholder="Max Price"
                            className="font-sans bg-transparent border-none outline-none text-[13px] text-white placeholder-gray-600 w-full"
                          />
                        </div>
                      </div>
                      <Link to="/search" className="font-nunito bg-primary hover:bg-primary-600 text-black h-9 w-full md:w-auto rounded-sm flex items-center justify-center transition-all group px-4">
                        <Search className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-10 mt-12">
                    <div>
                      <h4 className="text-3xl font-display font-bold mb-1">16+</h4>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider font-nunito">Years Exp</p>
                    </div>
                    <div>
                      <h4 className="text-3xl font-display font-bold mb-1">200</h4>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider font-nunito">Award Gained</p>
                    </div>
                    <div>
                      <h4 className="text-3xl font-display font-bold mb-1">1200+</h4>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider font-nunito">Property Ready</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Collage */}
              <div className="w-full lg:w-2/5 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="rounded-md overflow-hidden aspect-square bg-neutral-800 border border-white/10 group">
                    <img
                      src="/images/img1.jpg"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                      alt="Modern Mansion"
                    />
                  </div>
                  <div className="rounded-md overflow-hidden aspect-square bg-neutral-800 border border-white/10 group">
                    <img
                      src="/images/img2.jpg"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                      alt="Luxury Interior"
                    />
                  </div>
                  <div className="rounded-md overflow-hidden aspect-square bg-neutral-800 border border-white/10 group">
                    <img
                      src="/images/img3.jpg"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                      alt="Minimalist House"
                    />
                  </div>
                  <div className="rounded-md overflow-hidden aspect-square bg-neutral-800 border border-white/10 group">
                    <img
                      src="/images/img4.jpg"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                      alt="Modern Bungalow"
                    />
                  </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
