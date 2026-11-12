import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Cake,
  Menu,
  X,
  Sun,
  Moon,
  HelpCircle,
  LogIn,
  LogOut,
  UserPlus,
  Sparkles,
  Heart,
  Calendar,
  MessageCircle,
  Mail,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Navigation & Modals
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'wishes' | 'chat'>('dashboard');

  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Sync Dark Mode class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Listen to Supabase Auth State
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthMessage(null);
    setAuthModalOpen(true);
    setMenuOpen(false);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthMessage(null);

    try {
      if (authMode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setAuthModalOpen(false);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, username },
          },
        });
        if (error) throw error;

        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName || email.split('@')[0],
            username: username || email.split('@')[0] + Math.floor(Math.random() * 1000),
            email,
          });
        }

        setAuthMessage({
          type: 'success',
          text: 'Account created! You can now sign in.',
        });
        setAuthMode('signin');
      }
    } catch (err: any) {
      setAuthMessage({ type: 'error', text: err.message || 'Authentication failed' });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-rose-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/20">
              <Cake className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-rose-600 to-amber-600 dark:from-rose-400 dark:to-amber-300 bg-clip-text text-transparent">
              BIRTHDAY HUB
            </span>
          </div>

          {/* Right Controls: Theme Toggle + Menu Button */}
          <div className="flex items-center gap-2">
            {/* Dark / Light Mode Quick Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Top-Right Menu Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium text-sm shadow-sm hover:opacity-90 transition"
              >
                {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                <span>Menu</span>
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50">
                  {!session ? (
                    <>
                      <button
                        onClick={() => openAuth('signin')}
                        className="w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-3 hover:bg-rose-50 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200 transition"
                      >
                        <LogIn className="w-4 h-4 text-rose-500" />
                        Sign In
                      </button>
                      <button
                        onClick={() => openAuth('signup')}
                        className="w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-3 hover:bg-rose-50 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200 transition"
                      >
                        <UserPlus className="w-4 h-4 text-amber-500" />
                        Create Account
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-3 hover:bg-rose-50 dark:hover:bg-slate-700/70 text-rose-600 dark:text-rose-400 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  )}

                  <div className="my-1 border-t border-slate-100 dark:border-slate-700" />

                  <button
                    onClick={() => {
                      setDarkMode(!darkMode);
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200 transition"
                  >
                    {darkMode ? (
                      <>
                        <Sun className="w-4 h-4 text-amber-400" />
                        Switch to Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4 text-indigo-500" />
                        Switch to Dark Mode
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setHelpOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/70 text-slate-700 dark:text-slate-200 transition"
                  >
                    <HelpCircle className="w-4 h-4 text-emerald-500" />
                    Help & Contact Support
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        {!session ? (
          /* PUBLIC LANDING / ONBOARDING SCREEN */
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center max-w-2xl mx-auto space-y-6 pt-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Every Birthday Matters. Every Friendship Counts.
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Celebrate Friends &amp; Discover Your{' '}
                <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                  Birthday Twins
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Birthday Hub is your dedicated social space to keep track of upcoming birthdays,
                connect with people born on the exact same day as you, and send heartfelt birthday
                wishes that never get lost in a crowded timeline.
              </p>

              {/* Main Screen Prompt: Add Account / Sign In */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-rose-100 dark:border-slate-700 shadow-xl shadow-rose-500/5 space-y-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Don&apos;t have an account yet? Create one in seconds to join the celebration!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => openAuth('signup')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold shadow-lg shadow-rose-500/25 hover:opacity-95 transition flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add / Create Account
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openAuth('signin')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 text-slate-800 dark:text-white font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4 text-rose-500" />
                    Sign In
                  </button>
                </div>
              </div>
            </section>

            {/* App Goals & Features Grid */}
            <section className="grid sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/90 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">Never Miss a Date</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Our goal is to keep your circle close with smart upcoming birthday reminders so
                  every friend feels remembered.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/90 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">Find Birthday Twins</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Automatically match with members in the community who share your exact birth date
                  and celebrate together.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/90 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">Wishes &amp; Live Chat</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Post personalized birthday wishes on friends&apos; walls and chat directly in real
                  time.
                </p>
              </div>
            </section>
          </div>
        ) : (
          /* LOGGED-IN DASHBOARD SCREEN */
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
                  Welcome back! 🎉
                </h1>
                <p className="text-rose-100 text-sm sm:text-base">
                  Signed in as <span className="font-semibold text-white">{session.user.email}</span>
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold text-sm flex items-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>

            {/* Aligned Navigation Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm max-w-md">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition ${
                  activeTab === 'dashboard'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Cake className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('wishes')}
                className={`py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition ${
                  activeTab === 'wishes'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Wishes
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-2.5 px-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition ${
                  activeTab === 'chat'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </button>
            </div>

            {/* Tab Views */}
            {activeTab === 'dashboard' && (
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm space-y-3">
                  <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-bold text-lg">
                    <Calendar className="w-5 h-5" />
                    <h2>Upcoming Birthdays</h2>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    No birthdays scheduled for today. Check back soon!
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm space-y-3">
                  <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-bold text-lg">
                    <Heart className="w-5 h-5" />
                    <h2>Birthday Twins</h2>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Matching engine active. Connecting you with your community.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'wishes' && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm space-y-3">
                <h2 className="font-bold text-lg">Birthday Wishes Wall</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Share warm wishes with friends celebrating this week!
                </p>
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm space-y-3">
                <h2 className="font-bold text-lg">Community Chat</h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Connect and celebrate live with your birthday twins and friends.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* AUTH MODAL (SIGN IN & CREATE ACCOUNT) */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-bet
