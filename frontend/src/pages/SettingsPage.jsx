import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  User, Shield, ShieldCheck, Eye, EyeOff, Settings, Sparkles,
  Key, Copy, Check, Info, Bell, ToggleLeft, ToggleRight, Database
} from 'lucide-react';
import { DashboardLayout } from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { toggleTheme } from '../store/slices/themeSlice';
import api from '../config/api';
import { useNotify } from '../components/ui/NotificationBell';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const theme = useSelector((s) => s.theme.mode);
  const notify = useNotify();
  
  const [name, setName] = useState(user?.name || '');
  const [beginnerMode, setBeginnerMode] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [aiOverlay, setAiOverlay] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // API key mockup states
  const [apiKey, setApiKey] = useState('nx_live_51PjK2LB7iXmG8vB9q1y2z3a4b5c6d7e8f9');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/auth/profile', { name });
      notify('Settings Saved', 'Profile display properties updated successfully', 'success');
    } catch {
      notify('Update Failed', 'Could not sync settings with the server', 'error');
    }
    setSaving(false);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    notify('Copied', 'API key copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateKey = () => {
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setApiKey(`nx_live_${randomHex}`);
    notify('New API Key Generated', 'Existing keys have been successfully rotated', 'success');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 text-gray-100 pb-16 max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="pb-6 border-b border-white/[0.06]">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-3 border border-cyan-500/20">
            <Settings size={11} />
            <span>Preferences Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-white">
            System Preferences
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Configure your personal profile identity, customize AI trading annotations, and manage developer API access channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Identity & Developer Keys */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Card 1: Profile & Identity */}
            <Card className="border border-white/5 p-6 bg-black/20" glow>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
                  <User size={16} />
                </div>
                <h3 className="font-bold text-base text-white font-display">Identity Settings</h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-white/[0.05]">
                {/* Glowing Avatar */}
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 opacity-75 blur-md group-hover:opacity-100 transition duration-300" />
                  <div className="relative w-20 h-20 rounded-2xl bg-[#0b0f19] border border-white/10 flex items-center justify-center text-3xl font-extrabold text-white">
                    {(name || user?.email || 'U')[0].toUpperCase()}
                  </div>
                </div>
                
                <div className="text-center sm:text-left flex-1 space-y-1">
                  <h4 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                    {name || 'NexTrade Trader'}
                    {user?.isAdmin && (
                      <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        Admin
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-gray-500 font-mono">{user?.email}</p>
                  <p className="text-[10px] text-gray-500 flex items-center justify-center sm:justify-start gap-1">
                    <ShieldCheck size={11} className="text-emerald-400" /> Standard Firebase Encrypted Session
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <Input 
                  label="Display Username" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Satoshi Nakamoto"
                  className="bg-white/[0.01] border-white/10"
                />
                
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Secure Email Address</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={user?.email || ''} 
                      disabled 
                      className="w-full h-11 px-4 text-xs font-semibold rounded-xl bg-white/[0.02] border border-white/5 text-gray-500 select-none cursor-not-allowed"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      <ShieldCheck size={12} /> VERIFIED
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleSave} 
                  loading={saving}
                  className="shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 mt-2 px-6"
                >
                  Save Profile Changes
                </Button>
              </div>
            </Card>

            {/* Card 2: Developer API Keys (Fintech Aesthetic Upgrade) */}
            <Card className="border border-white/5 p-6 bg-black/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400">
                    <Key size={16} />
                  </div>
                  <h3 className="font-bold text-base text-white font-display">Developer API Credentials</h3>
                </div>
                <Button variant="secondary" size="sm" onClick={handleGenerateKey}>
                  Rotate Key
                </Button>
              </div>
              <p className="text-[11px] text-gray-500 mb-6 leading-relaxed">
                Connect your account directly to external automated quant scripts or trading terminals using this secret security key. Keep this key strictly confidential.
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Live Secret Key</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      readOnly
                      className="w-full h-11 px-4 text-xs font-mono font-bold rounded-xl bg-black/35 border border-white/5 text-cyan-400"
                    />
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      title={showKey ? 'Hide key' : 'Show key'}
                    >
                      {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  
                  <button
                    onClick={handleCopyKey}
                    className="w-11 h-11 shrink-0 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    title="Copy API Key"
                  >
                    {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </Card>

          </div>

          {/* RIGHT SIDE: Interactive Preferences & Metadata */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Card 3: Interactive Preferences */}
            <Card className="border border-white/5 p-6 bg-black/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                  <Sparkles size={16} />
                </div>
                <h3 className="font-bold text-base text-white font-display">Terminal Preferences</h3>
              </div>

              <div className="divide-y divide-white/[0.05] space-y-4">
                
                {/* Toggle 1: Dark Mode */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-sm font-semibold text-white">Visual Interface Theme</p>
                    <p className="text-[10px] text-gray-500">Toggle between Dark luxury grid and Light mode</p>
                  </div>
                  <button
                    onClick={() => dispatch(toggleTheme())}
                    className={`w-12 h-6 rounded-full transition-colors relative border border-white/5 shrink-0 ${
                      theme === 'dark' ? 'bg-cyan-500/20 border-cyan-500/20' : 'bg-white/[0.04]'
                    }`}
                  >
                    <motion.div 
                      layout
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 ${
                        theme === 'dark' ? 'right-0.5' : 'left-0.5'
                      }`} 
                    />
                  </button>
                </div>

                {/* Toggle 2: Beginner Mode */}
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-sm font-semibold text-white">AI Annotation Mode</p>
                    <p className="text-[10px] text-gray-500">Display simplified annotations for technical indicators</p>
                  </div>
                  <button
                    onClick={() => setBeginnerMode(!beginnerMode)}
                    className={`w-12 h-6 rounded-full transition-colors relative border border-white/5 shrink-0 ${
                      beginnerMode ? 'bg-cyan-500/20 border-cyan-500/20' : 'bg-white/[0.04]'
                    }`}
                  >
                    <motion.div 
                      layout
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 ${
                        beginnerMode ? 'right-0.5' : 'left-0.5'
                      }`} 
                    />
                  </button>
                </div>

                {/* Toggle 3: AI Price Overlays */}
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Dynamic AI Predictions</p>
                    <p className="text-[10px] text-gray-500">Enable real-time trajectory vector displays on 3D charts</p>
                  </div>
                  <button
                    onClick={() => setAiOverlay(!aiOverlay)}
                    className={`w-12 h-6 rounded-full transition-colors relative border border-white/5 shrink-0 ${
                      aiOverlay ? 'bg-cyan-500/20 border-cyan-500/20' : 'bg-white/[0.04]'
                    }`}
                  >
                    <motion.div 
                      layout
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 ${
                        aiOverlay ? 'right-0.5' : 'left-0.5'
                      }`} 
                    />
                  </button>
                </div>

                {/* Toggle 4: Sound Alerts */}
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Order Auditory Pings</p>
                    <p className="text-[10px] text-gray-500">Play subtle, low-frequency audio alerts on transaction completions</p>
                  </div>
                  <button
                    onClick={() => setSoundAlerts(!soundAlerts)}
                    className={`w-12 h-6 rounded-full transition-colors relative border border-white/5 shrink-0 ${
                      soundAlerts ? 'bg-cyan-500/20 border-cyan-500/20' : 'bg-white/[0.04]'
                    }`}
                  >
                    <motion.div 
                      layout
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 ${
                        soundAlerts ? 'right-0.5' : 'left-0.5'
                      }`} 
                    />
                  </button>
                </div>

              </div>
            </Card>

            {/* Card 4: Metadata Registry Details */}
            <Card className="border border-white/5 p-6 bg-black/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                  <Database size={16} />
                </div>
                <h3 className="font-bold text-base text-white font-display">System Registries</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Account Database Unique UID</p>
                  <div className="mt-1.5 flex items-center justify-between bg-black/35 border border-white/5 px-3 py-2.5 rounded-lg font-mono text-[10px] text-gray-400">
                    <span className="truncate mr-2 select-all">{user?.uid || 'nx_user_87f3942ab91c'}</span>
                    <Info size={12} className="text-gray-600 shrink-0" />
                  </div>
                </div>

                <div className="pt-2 flex justify-between text-[11px]">
                  <span className="text-gray-500 font-medium">Session Role:</span>
                  {user?.isAdmin ? (
                    <span className="text-purple-400 font-bold">Platform Administrator</span>
                  ) : (
                    <span className="text-cyan-400 font-bold">Standard Platform Trader</span>
                  )}
                </div>
              </div>
            </Card>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
