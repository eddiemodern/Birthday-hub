import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Cake, Heart, MessageCircle, Calendar, Sparkles, User, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'wishes' | 'chat'>('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-purple-600/30 rounded-full border border-purple-400/30 animate-pulse">
              <Cake className="w-12 h-12 text-pink-400" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
            BIRTHDAY HUB
          </h1>
          <p className="text-center text-purple-200 mb-6 text-sm">Every Birthday Matters. Every Friendship Counts.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-purple-300 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-purple-500/30 focus:outline-none focus:border-pink-500 text-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-purple-300 mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-purple-500/30 focus:outline-none focus:border-pink-500 text-white"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 font-bold shadow-lg transition transform active:scale-95"
            >
              {loading ? 'Signing in...' : 'Sign In to Celebrate'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top Navbar */}
      <header className="bg-purple-950/40 backdrop-blur-md border-b border-purple-900/50 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <Cake className="w-8 h-8 text-pink-400 animate-bounce" />
          <span className="font-black text-xl tracking-wider bg-gradient-to-r from-pink-400 to-purple-300 bg-clip-text text-transparent">
            BIRTHDAY HUB
          </span>
        </div>
        <button 
          onClick={handleSignOut}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition text-sm font-semibold border border-red-500/30"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 pb-24">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/30 p-6 rounded-3xl backdrop-blur-md shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-pink-500/20 rounded-2xl border border-pink-500/30">
                  <Sparkles className="w-8 h-8 text-pink-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Welcome back! 🎉</h2>
                  <p className="text-purple-300 text-sm">Ready to celebrate your friends and discover birthday twins?</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-900/20 border border-purple-500/20 p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-2 flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-pink-400" />
                  <span>Upcoming Birthdays</span>
                </h3>
                <p className="text-sm text-purple-300">No birthdays scheduled for today. Check back soon!</p>
              </div>
              <div className="bg-purple-900/20 border border-purple-500/20 p-6 rounded-2xl">
                <h3 className="font-bold text-lg mb-2 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span>Birthday Twins</span>
                </h3>
                <p className="text-sm text-purple-300">Matching engine active. Connecting you with your community.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wishes' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">The Wish Corner 🌟</h2>
            <p className="text-purple-300 text-sm">Share appreciation and birthday wishes with your community.</p>
            <div className="bg-purple-900/20 border border-purple-500/20 p-6 rounded-2xl text-center text-purple-300">
              Wish feed is ready. Post your first wish!
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Community Chat 💬</h2>
            <div className="bg-purple-900/20 border border-purple-500/20 p-6 rounded-2xl text-center text-purple-300">
              Real-time messaging channels connected via Supabase Realtime.
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-purple-950/80 backdrop-blur-lg border-t border-purple-900/50 py-3 px-6 flex justify-around items-center z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'dashboard' ? 'text-pink-400' : 'text-purple-400 hover:text-white'}`}
        >
          <Cake className="w-6 h-6" />
          <span className="text-xs font-semibold">Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('wishes')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'wishes' ? 'text-pink-400' : 'text-purple-400 hover:text-white'}`}
        >
          <Sparkles className="w-6 h-6" />
          <span className="text-xs font-semibold">Wishes</span>
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'chat' ? 'text-pink-400' : 'text-purple-400 hover:text-white'}`}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs font-semibold">Chat</span>
        </button>
      </nav>
    </div>
  );
        }
