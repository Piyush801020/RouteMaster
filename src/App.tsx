import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, addDoc, query, limit } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Navbar } from './components/Navbar';
import { RoutePlanner } from './components/RoutePlanner';
import { Marketplace } from './components/Marketplace';
import { CostEstimator } from './components/CostEstimator';
import { Profile } from './components/Profile';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [user, setUser] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Seed initial data if marketplace is empty
  useEffect(() => {
    const seedData = async () => {
      try {
        const q = query(collection(db, 'packages'), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          const initialPackages = [
            {
              agencyId: 'agency_1',
              title: 'Coastal Paradise Explorer',
              description: 'A 5-day luxury bus tour along the scenic coastline with stops at hidden beaches and gourmet eateries.',
              price: 499,
              vehicleType: 'Bus',
              duration: '5 Days',
              startLocation: 'San Francisco',
              endLocation: 'Los Angeles'
            },
            {
              agencyId: 'agency_2',
              title: 'Mountain Peak Adventure',
              description: 'Private car tour through the heart of the Rockies. Perfect for photography enthusiasts.',
              price: 850,
              vehicleType: 'Car',
              duration: '3 Days',
              startLocation: 'Denver',
              endLocation: 'Aspen'
            },
            {
              agencyId: 'agency_3',
              title: 'Trans-Continental Express',
              description: 'Classic train journey across the country with premium sleeper cabins and panoramic views.',
              price: 1200,
              vehicleType: 'Train',
              duration: '7 Days',
              startLocation: 'New York',
              endLocation: 'Chicago'
            }
          ];
          for (const pkg of initialPackages) {
            await addDoc(collection(db, 'packages'), pkg);
          }
        }
      } catch (e) {
        console.error("Seeding failed", e);
      }
    };
    if (authReady) seedData();
  }, [authReady]);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'map': return <RoutePlanner />;
      case 'marketplace': return <Marketplace />;
      case 'estimator': return <CostEstimator />;
      case 'profile': return <Profile user={user} />;
      default: return <RoutePlanner />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-32">
      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="pt-12"
        >
          {renderContent()}
        </motion.main>
      </AnimatePresence>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
    </div>
  );
}
