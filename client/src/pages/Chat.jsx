import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { io } from 'socket.io-client';
import { Send, MessageSquare, Search, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Chat() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');
      return;
    }

    const query = new URLSearchParams(location.search);
    const targetuserid = query.get('target');

    let isMounted = true;

    const fetchData = async () => {
      try {
        const userRes = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!userRes.ok) throw new Error('Auth failed');
        const userData = await userRes.json();
        if (!isMounted) return;
        setCurrentUser(userData);

        const chatsRes = await fetch('/api/chats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const chatsData = await chatsRes.json();
        if (!isMounted) return;
        setChats(chatsData);

        if (targetuserid) {
          const accessRes = await fetch('/api/chats/access', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId: targetuserid }),
          });
          if (accessRes.ok && isMounted) {
            const chatObj = await accessRes.json();
            setActiveChat(chatObj);
            setChats(prev => {
              if (prev.find((c) => c._id === chatObj._id)) return prev;
              return [chatObj, ...prev];
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          navigate('/auth');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    const newSocket = io();
    setSocket(newSocket);

    return () => {
      isMounted = false;
      newSocket.disconnect();
    };
  }, [navigate, location.search]);

  useEffect(() => {
    if (activeChat && socket) {
      socket.emit('join_chat', activeChat._id);
      const token = localStorage.getItem('token');
      fetch(`/api/chats/${activeChat._id}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(setMessages);
    }
  }, [activeChat, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('receive_message', (message) => {
        if (activeChat && message.chatId === activeChat._id) {
          setMessages(prev => [...prev, message]);
        }
        setChats(prev => prev.map(c => 
          c._id === message.chatId ? { ...c, lastMessage: message.text } : c
        ));
      });
    }
    return () => {
      socket?.off('receive_message');
    };
  }, [socket, activeChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !currentUser) return;

    const messageData = {
      chatId: activeChat._id,
      senderId: currentUser._id,
      text: newMessage,
      createdAt: new Date().toISOString()
    };

    socket?.emit('send_message', messageData);
    setMessages(prev => [...prev, messageData]);
    

    const token = localStorage.getItem('token');
    try {
      await fetch('/api/chats/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ chatId: activeChat._id, text: newMessage }),
      });
    } catch (err) {
      console.error(err);
    }

    setNewMessage('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white selection:bg-primary/30 flex flex-col">
      <Navbar />

      <main className="flex-1 flex overflow-hidden pt-20">
        <div className="max-w-7xl mx-auto w-full flex h-full p-4 md:p-6 gap-6">
          <div className={`w-full md:w-72 lg:w-80 flex flex-col bg-neutral-900 border border-white/5 rounded-md overflow-hidden ${activeChat ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-white/5">
              <h2 className="text-xl font-display font-bold mb-3 uppercase tracking-wider text-[10px] text-gray-500">Messages</h2>
              <div className="relative text-black font-nunito">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Find conversation..." 
                  className="w-full bg-black/40 border border-white/5 rounded-sm py-1.5 pl-9 pr-4 focus:outline-none focus:border-primary transition-all text-[11px] text-white"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
              {chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-3 opacity-50 py-10">
                  <MessageSquare className="w-8 h-8" />
                  <p className="text-[9px] font-bold uppercase tracking-widest leading-none">No Inbox</p>
                </div>
              ) : (
                chats.map(chat => {
                  const otherUser = chat.participants.find((p) => p._id !== currentUser._id);
                  return (
                    <button
                      key={chat._id}
                      onClick={() => setActiveChat(chat)}
                      className={`w-full flex items-center gap-2.5 p-2.5 rounded-md transition-all border ${
                        activeChat?._id === chat._id 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'hover:bg-white/5 border-transparent'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-sm overflow-hidden shrink-0 border border-white/10">
                        <img src={otherUser?.avatar} alt={otherUser?.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-left overflow-hidden">
                        <div className="flex justify-between items-center mb-0.5">
                          <h4 className="font-display font-bold truncate text-[12px] text-gray-200">{otherUser?.name}</h4>
                          <span className="text-[8px] text-gray-500 font-bold uppercase font-nunito">12:45</span>
                        </div>
                        <p className={`text-[10px] truncate font-sans ${activeChat?._id === chat._id ? 'text-primary' : 'text-gray-500'}`}>
                          {chat.lastMessage || 'Start a conversation'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className={`flex-1 flex flex-col bg-neutral-900 border border-white/5 rounded-md overflow-hidden ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
            {activeChat ? (
              <>
                <div className="p-3.5 md:p-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setActiveChat(null)}
                      className="md:hidden p-1.5 rounded-sm bg-white/5 hover:bg-white/10"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="w-9 h-9 rounded-sm overflow-hidden border border-white/10 shrink-0">
                      <img 
                        src={activeChat.participants.find((p) => p._id !== currentUser._id)?.avatar} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-[13px] leading-none mb-1">
                        {activeChat.participants.find((p) => p._id !== currentUser._id)?.name}
                      </h3>
                      <p className="text-[8px] text-primary font-bold uppercase tracking-widest font-nunito">Active Now</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
                  {messages.map((msg, idx) => {
                    const isMine = msg.senderId === currentUser._id;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] md:max-w-[70%] p-3 rounded-md ${
                          isMine 
                          ? 'bg-primary text-black font-bold text-[13px]' 
                          : 'bg-white/5 border border-white/10 text-gray-200 text-[13px]'
                        }`}>
                          <p className="font-sans leading-relaxed">{msg.text}</p>
                          <span className={`text-[8px] mt-1.5 block font-bold uppercase font-nunito ${isMine ? 'text-black/50' : 'text-gray-500'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={scrollRef} />
                </div>

                <div className="p-3 border-t border-white/5">
                  <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                    <div className="flex-1 relative text-black">
                      <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Write a message..." 
                        className="w-full bg-black/40 border border-white/5 rounded-sm py-2 px-4 pr-10 focus:outline-none focus:border-primary transition-all text-xs text-white"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="font-nunito bg-primary hover:bg-primary-600 active:bg-primary-700 text-black p-2.5 rounded-sm transition-all disabled:opacity-30"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="w-12 h-12 bg-primary/5 rounded-md flex items-center justify-center mx-auto border border-primary/10">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-display font-bold text-gray-200 uppercase tracking-widest text-xs">Inbox</h3>
                    <p className="text-gray-600 text-[10px] max-w-[200px] mx-auto leading-relaxed uppercase font-bold">
                      Select a contact to start negotiating
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
