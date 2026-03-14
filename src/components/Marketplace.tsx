import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Package, Agency } from '../types';
import { Bus, Car, Train, Plane, Plus, Filter, Tag } from 'lucide-react';

export const Marketplace: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const q = query(collection(db, 'packages'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
        setPackages(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'Bus': return <Bus size={18} />;
      case 'Car': return <Car size={18} />;
      case 'Train': return <Train size={18} />;
      case 'Flight': return <Plane size={18} />;
      default: return <Tag size={18} />;
    }
  };

  const filteredPackages = filter === 'All' 
    ? packages 
    : packages.filter(p => p.vehicleType === filter);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Agency Marketplace</h1>
          <p className="text-zinc-500">Curated travel packages from top agencies</p>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-xl">
          {['All', 'Bus', 'Car', 'Train', 'Flight'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === type ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-[400px] bg-zinc-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/10] bg-zinc-100 relative overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${pkg.id}/800/500`} 
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-zinc-900 flex items-center gap-2">
                  {getVehicleIcon(pkg.vehicleType)}
                  {pkg.vehicleType}
                </div>
                <div className="absolute bottom-4 right-4 px-4 py-2 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg">
                  ${pkg.price}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 group-hover:text-emerald-600 transition-colors">{pkg.title}</h3>
                  <p className="text-sm text-zinc-500 line-clamp-2 mt-2">{pkg.description}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-zinc-50 mt-auto">
                  <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                    <span className="px-2 py-1 bg-zinc-100 rounded-md">{pkg.duration}</span>
                  </div>
                  <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700">
                    View Details →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredPackages.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto text-zinc-300">
                <ShoppingBag size={32} />
              </div>
              <p className="text-zinc-500 font-medium">No packages found in this category.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ShoppingBag = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
