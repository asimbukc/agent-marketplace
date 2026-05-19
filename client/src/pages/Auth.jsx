import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, AtSign, ArrowRight, Home } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

  const toggleAuth = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateAuth = () => {
    const newErrors = {};
    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.username.trim()) newErrors.username = 'Username is required';
      if (formData.username.length < 3) newErrors.username = 'Username too short';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email/Username is required';
    } else if (!isLogin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAuth()) return;
    setIsLoading(true);
    setErrors({});

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.field) {
          setErrors({ [data.field]: data.message });
        } else {
          setErrors({ form: data.message || 'Something went wrong' });
        }
        setIsLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ form: 'Unable to connect to server. Please try again later.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white overflow-hidden">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 relative z-10 bg-black">
        <div className="max-w-md w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <Home className="text-black w-4 h-4" />
            </div>
            <span className="text-lg font-display font-bold tracking-tight text-white uppercase tracking-widest">MarketPlace</span>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-3xl font-display font-bold mb-1 tracking-tight">
                {isLogin ? 'Welcome Back' : 'Sign up'}
              </h2>
              <p className="font-sans text-gray-500 text-xs font-medium mb-8">
                {isLogin
                  ? 'Sign in to your account'
                  : 'Join to find your dream property'}
              </p>

              {errors.form && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-2.5 rounded-sm mb-6 text-[10px] font-bold uppercase tracking-wider">
                  {errors.form}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-1">
                      <label className="font-nunito text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="font-sans w-full bg-neutral-950 border border-white/10 rounded-sm py-2 pl-9 pr-4 focus:outline-none focus:border-primary transition-all text-white placeholder-gray-700 text-xs"
                        />
                      </div>
                      {errors.name && <p className="text-red-500 text-[9px] mt-1 ml-1 font-sans">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="font-nunito text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Username</label>
                      <div className="relative group">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-primary transition-colors" />
                        <input
                          type="text"
                          name="username"
                          placeholder="johndoe"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="font-sans w-full bg-neutral-950 border border-white/10 rounded-sm py-2 pl-9 pr-4 focus:outline-none focus:border-primary transition-all text-white placeholder-gray-700 text-xs"
                        />
                      </div>
                      {errors.username && <p className="text-red-500 text-[9px] mt-1 ml-1 font-sans">{errors.username}</p>}
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="font-nunito text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <input
                      type="text"
                      name="email"
                      placeholder={isLogin ? "Username or Email" : "email@example.com"}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="font-sans w-full bg-neutral-950 border border-white/10 rounded-sm py-2 pl-9 pr-4 focus:outline-none focus:border-primary transition-all text-white placeholder-gray-700 text-xs"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-[9px] mt-1 ml-1 font-sans">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <label className="font-nunito text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="font-sans w-full bg-neutral-950 border border-white/10 rounded-sm py-2 pl-9 pr-4 focus:outline-none focus:border-primary transition-all text-white placeholder-gray-700 text-xs"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-[9px] mt-1 ml-1 font-sans">{errors.password}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="font-nunito w-full bg-primary hover:bg-primary-600 active:bg-primary-700 text-black font-bold py-2.5 rounded-sm transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 text-[10px] uppercase tracking-widest"
                >
                  {isLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={toggleAuth}
                  className="font-nunito text-[10px] text-gray-500 uppercase font-bold tracking-widest hover:text-white transition-colors"
                >
                  {isLogin ? "Need an account? " : "Already have an account? "}
                  <span className="text-primary ml-1 underline decoration-primary/30 underline-offset-4">
                    {isLogin ? 'Register' : 'Login'}
                  </span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="hidden lg:block w-1/2 relative bg-neutral-900 border-l border-neutral-800">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"
          alt="Luxury Bungalow"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-md"
          >
            <h3 className="text-2xl font-display font-bold mb-3">Finding Excellence</h3>
            <p className="font-sans text-gray-300 text-base leading-relaxed">
              Experience the pinnacle of luxury living. Our curated collection of premium properties offers more than just a home—it offers a lifestyle of unparalleled sophistication.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
