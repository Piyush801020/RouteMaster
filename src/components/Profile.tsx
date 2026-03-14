import React, { useState } from 'react';
import { motion } from 'motion/react';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User, Shield, Briefcase, UserCircle } from 'lucide-react';

export const Profile: React.FC<{ user: any }> = ({ user }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists in Firestore
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: result.user.displayName,
          email: result.user.email,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 mt-20 text-center space-y-8">
        <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-300">
          <UserCircle size={64} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-zinc-900">Welcome Back</h1>
          <p className="text-zinc-500">Sign in to sync your routes and access the marketplace</p>
        </div>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Continue with Google
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-8 flex items-center gap-6">
        <img 
          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
          className="w-24 h-24 rounded-full border-4 border-zinc-50 shadow-sm"
          alt={user.displayName}
        />
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-zinc-900">{user.displayName}</h2>
          <p className="text-zinc-500">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Shield size={12} /> Verified User
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-4">
          <h3 className="font-bold text-zinc-900 flex items-center gap-2">
            <Briefcase size={18} className="text-emerald-600" />
            Agency Account
          </h3>
          <p className="text-sm text-zinc-500">Want to list your travel packages? Apply for an agency account to access the marketplace dashboard.</p>
          <button className="w-full py-3 bg-white border border-zinc-200 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-colors">
            Apply Now
          </button>
        </div>
        
        <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-4">
          <h3 className="font-bold text-zinc-900 flex items-center gap-2">
            <User size={18} className="text-emerald-600" />
            Saved Trips
          </h3>
          <p className="text-sm text-zinc-500">You have 0 saved trips. Start planning your next adventure to see them here.</p>
          <button className="w-full py-3 bg-white border border-zinc-200 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-colors">
            View History
          </button>
        </div>
      </div>
    </div>
  );
};
