import React from 'react';
import { motion } from 'motion/react';
import { Award, TrendingUp, Users, Target, CheckCircle2, History, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { Link } from 'react-router-dom';

const MapPin = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

export default function About() {
  const stats = [
    { label: "Success Rate", value: "98%", icon: <Award className="w-4 h-4" /> },
    { label: "Properties Sold", value: "1.2k+", icon: <TrendingUp className="w-4 h-4" /> },
    { label: "Active Clients", value: "3.5k+", icon: <Users className="w-4 h-4" /> },
    { label: "Market Reach", value: "12 Countries", icon: <Target className="w-4 h-4" /> }
  ];

  const recentSold = [
    {
      title: "The Glass House",
      location: "Malibu, CA",
      price: "$12.5M",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Penthouse 42",
      location: "New York, NY",
      price: "$8.9M",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Arctic Villa",
      location: "Oslo, Norway",
      price: "$6.2M",
      image: "https://images.unsplash.com/photo-1600607687940-c52fb036999c?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Navbar />

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <span className="font-oswald text-[11px] font-bold text-primary uppercase tracking-[0.4em] mb-4 block">Est. 2018</span>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight leading-[0.9]">
                Redefining <br />
                <span className="text-primary italic font-serif -ml-1">Modern</span> Real Estate.
              </h1>
              <p className="font-sans text-gray-500 text-lg max-w-lg leading-relaxed">
                We believe that property is more than just square footage. It's the canvas upon which lives are built and legacies are secured.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-white/5 bg-neutral-900 shadow-2xl">
                 <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop" 
                    className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 transition-all duration-700" 
                    alt="Our Office" 
                 />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary p-6 rounded-lg shadow-2xl hidden md:block">
                 <p className="font-display text-4xl font-bold text-black leading-none">07</p>
                 <p className="font-nunito text-[9px] font-bold text-black uppercase tracking-widest mt-1">Years of Excellence</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="bg-neutral-950 border-y border-white/5 py-16 mb-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-2 text-primary">
                  {stat.icon}
                  <span className="font-display text-3xl font-bold text-white">{stat.value}</span>
                </div>
                <p className="font-nunito text-[9px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
               <div className="sticky top-32">
                  <div className="flex items-center gap-3 mb-4">
                    <History className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-display font-bold uppercase tracking-widest">The Story</h2>
                  </div>
                  <div className="h-px bg-white/10 w-full mb-8" />
               </div>
            </div>
            <div className="lg:col-span-2 space-y-12">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h3 className="text-3xl font-display font-bold">A Vision Beyond Borders</h3>
                <p className="font-sans text-gray-400 text-lg leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                  Founded in a small downtown studio, our mission was simple yet radical: strip away the noise of traditional real estate and focus purely on the aesthetic and functional soul of architecture. We didn't want to list houses; we wanted to curate experiences.
                </p>
                <p className="font-sans text-gray-400 text-lg leading-relaxed">
                  Today, we stand as a global bridge for high-intent investors. Our algorithm doesn't just match budgets; it matches lifestyles. Every listing on our platform undergoes a rigorous aesthetic audit to ensure it meets the "Modern Elite" standard.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 pt-8">
                 <div className="bg-white/2 border border-white/5 p-8 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-primary mb-4" />
                    <h4 className="font-display font-bold mb-2">Curated Selection</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-sans">We reject over 60% of properties submitted to our platform to maintain our commitment to architectural excellence.</p>
                 </div>
                 <div className="bg-white/2 border border-white/5 p-8 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-primary mb-4" />
                    <h4 className="font-display font-bold mb-2">Discrete Service</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-sans">Our elite concierge service handles high-profile transitions with absolute anonymity and surgical precision.</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recently Sold Section */}
        <section className="bg-neutral-950/50 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
               <div>
                  <span className="font-oswald text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-2 block">Proven Results</span>
                  <h2 className="text-3xl md:text-4xl font-display font-bold">Recently Transacted</h2>
               </div>
               <Link to="/search" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                  View Marketplace <ArrowRight className="w-3 h-3" />
               </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {recentSold.map((property, idx) => (
                 <motion.div
                   key={property.title}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   viewport={{ once: true }}
                   className="group relative"
                 >
                   <div className="aspect-[3/4] overflow-hidden rounded-lg border border-white/10 bg-neutral-900">
                      <img src={property.image} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" alt={property.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      <div className="absolute inset-0 border-[10px] border-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <div className="absolute bottom-6 left-6 pr-6">
                      <p className="text-primary font-display text-sm font-bold uppercase tracking-widest mb-1">{property.price}</p>
                      <h3 className="text-xl font-display font-bold mb-1">{property.title}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                         <MapPin className="w-3 h-3" /> {property.location}
                      </p>
                   </div>
                   <div className="absolute top-6 right-6">
                      <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/10">
                         <span className="text-[9px] font-bold text-white uppercase tracking-widest">SOLD</span>
                      </div>
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="max-w-5xl mx-auto px-6 pt-32 text-center">
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="bg-primary p-12 md:p-20 rounded-2xl text-black relative overflow-hidden"
           >
              <div className="relative z-10">
                 <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">Ready to start your <br /> next chapter?</h2>
                 <p className="font-sans text-black/70 mb-10 text-lg max-w-lg mx-auto">Join the exclusive network of property owners and discovery seekers changing the landscape of real estate.</p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/post-property" className="bg-black text-white px-10 py-4 rounded-sm font-nunito font-bold text-xs uppercase tracking-widest hover:bg-neutral-900 transition-all">
                       List Your Property
                    </Link>
                    <Link to="/search" className="bg-transparent border-2 border-black/10 text-black px-10 py-4 rounded-sm font-nunito font-bold text-xs uppercase tracking-widest hover:border-black/30 transition-all">
                       Explore Gallery
                    </Link>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24" />
           </motion.div>
        </section>
      </main>
    </div>
  );
}
