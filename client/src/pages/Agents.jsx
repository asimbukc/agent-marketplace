import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, MapPin, MessageSquare, Loader2, Award } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        setAgents(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <span className="font-oswald text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-4 block">Meet the Elites</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">Our Professional Agents</h1>
          <p className="font-sans text-gray-500 max-w-2xl mx-auto text-sm md:text-base">
            Expert guidance from high-performance individuals dedicated to finding your next legacy property.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agents.map((agent, idx) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-neutral-950 border border-white/5 rounded-lg overflow-hidden flex flex-col hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.05)]"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={agent.image} 
                    alt={agent.name} 
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute top-3 right-3">
                     <div className="bg-black/50 backdrop-blur-md border border-white/10 p-1.5 rounded-sm">
                        <Award className="w-3 h-3 text-primary" />
                     </div>
                  </div>
                </div>

                <div className="p-4 flex-grow flex flex-col">
                  <div className="mb-3">
                    <p className="font-nunito text-[8px] font-bold text-primary uppercase tracking-[0.2em] mb-1">{agent.role}</p>
                    <h3 className="font-display text-base font-bold group-hover:text-primary transition-colors">{agent.name}</h3>
                  </div>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-start gap-2 text-gray-500 group-hover:text-gray-400 transition-colors">
                      <Mail className="w-3 h-3 mt-0.5 shrink-0" />
                      <span className="font-sans text-[10px] truncate">{agent.email}</span>
                    </div>
                    <div className="flex items-start gap-2 text-gray-500 group-hover:text-gray-400 transition-colors">
                      <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                      <div className="font-sans text-[10px] leading-relaxed italic line-clamp-2">
                        {agent.office}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">Available</span>
                     </div>
                     <div className="p-1.5 border border-white/10 rounded-sm text-gray-500 hover:text-primary transition-colors cursor-default">
                        <MessageSquare className="w-3 h-3" />
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 p-8 border border-white/5 rounded-xl bg-gradient-to-r from-neutral-950 to-black text-center"
        >
          <h3 className="font-display text-xl font-bold mb-2">Want to join the network?</h3>
          <p className="font-sans text-gray-500 text-sm mb-6 max-w-xl mx-auto">We are always looking for premium talent to represent our high-intent clientele across global markets.</p>
          <button className="px-8 py-3 bg-white/5 hover:bg-primary hover:text-black border border-white/10 rounded-sm text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300">
            Submit Portfolio
          </button>
        </motion.div>
      </main>
    </div>
  );
}
