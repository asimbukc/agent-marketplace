import { motion } from 'motion/react';
import { Home, Menu, X, MessageSquare, Users, Search, PlusSquare, Info, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(null);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/search', label: 'Explore', icon: Search },
    { path: '/agents', label: 'Agents', icon: Users },
    { path: '/post-property', label: 'Post Ad', icon: PlusSquare },
    { path: '/about', label: 'About', icon: Info },
  ];

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.id || data._id) setUser(data);
      })
      .catch(() => {});
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Home className="text-black w-6 h-6" />
            </div>
            <span className="text-lg font-display font-bold tracking-tight text-white uppercase">MarketPlace</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center h-10 px-4 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <motion.div
                    initial={false}
                    animate={{ 
                      width: isActive ? 'auto' : 0, 
                      opacity: isActive ? 1 : 0,
                      marginLeft: isActive ? 8 : 0 
                    }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
                  </motion.div>
                  
                  {!isActive && (
                    <motion.div
                      className="overflow-hidden whitespace-nowrap flex"
                      initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                      whileHover={{ width: 'auto', opacity: 1, marginLeft: 8 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{item.label}</span>
                    </motion.div>
                  )}
                </Link>
              );
            })}
            
            <div className="h-4 w-px bg-white/10 mx-2" />

            {token ? (
              <div className="flex items-center gap-2">
                <Link 
                  to="/chat" 
                  className={`group flex items-center h-10 px-4 rounded-full transition-all duration-300 ${location.pathname === '/chat' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <div className="relative">
                    <MessageSquare className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary rounded-full" />
                  </div>
                </Link>

                <Link 
                  to="/profile" 
                  className="group flex items-center h-10 p-1.5 transition-all"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors">
                    <img src={user?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt="Avatar" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                </Link>

                <button 
                  onClick={handleLogout}
                  className="flex items-center h-10 px-4 rounded-full text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all duration-300 group"
                >
                  <LogOut className="w-4 h-4 mr-0 group-hover:mr-2 transition-all" />
                  <span className="w-0 opacity-0 group-hover:w-auto group-hover:opacity-100 overflow-hidden text-[10px] font-bold uppercase tracking-widest transition-all">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link to="/auth" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Sign in</Link>
                <Link to="/auth?mode=signup" className="bg-primary hover:bg-primary-600 text-black px-4 py-2 rounded-full text-[10px] font-bold transition-all uppercase tracking-widest">
                  Join
                </Link>
              </div>
            )}
          </div>

          {/* Mobile button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300">
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-neutral-900 border-b border-white/10 px-4 py-6 flex flex-col gap-4"
        >
          <Link to="/" className={`py-2 font-nunito uppercase text-xs tracking-widest ${location.pathname === '/' ? 'text-primary' : 'text-gray-300'}`}>Home</Link>
          <Link to="/search" className={`py-2 font-nunito uppercase text-xs tracking-widest ${location.pathname === '/search' ? 'text-primary' : 'text-gray-300'}`}>Explore</Link>
          <Link to="/agents" className={`py-2 font-nunito uppercase text-xs tracking-widest ${location.pathname === '/agents' ? 'text-primary' : 'text-gray-300'}`}>Agents</Link>
          <Link to="/about" className={`py-2 font-nunito uppercase text-xs tracking-widest ${location.pathname === '/about' ? 'text-primary' : 'text-gray-300'}`}>About</Link>
          <hr className="border-white/5 my-2" />
          {token ? (
            <>
              <Link to="/profile" className="font-nunito text-primary font-bold py-2">My Profile</Link>
              <button onClick={handleLogout} className="font-nunito text-gray-400 text-left font-medium py-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth" className="font-nunito text-gray-300 py-2">Sign in</Link>
              <Link to="/auth?mode=signup" className="font-nunito bg-primary text-black px-6 py-3 rounded-xl font-bold text-center">Join</Link>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
}
