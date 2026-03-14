import React from 'react';
import { motion } from 'motion/react';
import { Map as MapIcon, ShoppingBag, Wallet, User, LogOut } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, user }) => {
  const tabs = [
    { id: 'map', label: 'Route Map', icon: MapIcon },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'estimator', label: 'Cost Estimator', icon: Wallet },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-black/5 shadow-2xl rounded-2xl px-6 py-3 flex items-center gap-8 z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            activeTab === tab.id ? 'text-emerald-600 scale-110' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <tab.icon size={20} />
          <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute -bottom-1 w-1 h-1 bg-emerald-600 rounded-full"
            />
          )}
        </button>
      ))}
      <div className="w-px h-8 bg-zinc-200 mx-2" />
      {user ? (
        <button
          onClick={() => signOut(auth)}
          className="flex flex-col items-center gap-1 text-zinc-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Logout</span>
        </button>
      ) : (
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            activeTab === 'profile' ? 'text-emerald-600 scale-110' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <User size={20} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Login</span>
        </button>
      )}
    </nav>
  );
};
