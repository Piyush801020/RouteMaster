import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Navigation, Utensils, Camera, AlertCircle, Coffee, Info } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Waypoint } from '../types';

export const RoutePlanner: React.FC = () => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  const handleSearch = async () => {
    if (!start || !end) return;
    setLoading(true);
    try {
      const suggestions = await geminiService.suggestWaypoints(start, end);
      setWaypoints(suggestions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'eatery': return <Utensils size={16} />;
      case 'photo': return <Camera size={16} />;
      case 'emergency': return <AlertCircle size={16} />;
      case 'rest': return <Coffee size={16} />;
      default: return <Info size={16} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">RouteMaster</h1>
        <p className="text-zinc-500">Discover the best spots along your journey</p>
      </header>

      <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              placeholder="Starting Point"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
          <div className="relative">
            <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
            <input
              type="text"
              placeholder="Destination"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-semibold hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Search size={20} />
              Plan My Route
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
            <MapIcon size={20} className="text-emerald-600" />
            Interactive Route
          </h2>
          <div className="aspect-video bg-zinc-100 rounded-3xl relative overflow-hidden border border-zinc-200">
            {/* Mock Route Visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              {!waypoints.length && !loading && (
                <p className="text-zinc-400 text-sm italic">Enter locations to visualize your route</p>
              )}
              {loading && (
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                  <p className="text-emerald-600 font-medium animate-pulse">Analyzing route for hidden gems...</p>
                </div>
              )}
              <AnimatePresence>
                {waypoints.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full p-8 relative"
                  >
                    {/* Stylized Route Line */}
                    <svg className="w-full h-full absolute inset-0 pointer-events-none">
                      <motion.path
                        d="M 100 200 Q 400 50 700 200"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeDasharray="8 8"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2 }}
                      />
                    </svg>
                    
                    {/* Waypoint Markers */}
                    {waypoints.map((wp, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="absolute group cursor-pointer"
                        style={{ 
                          left: `${15 + (i * 12)}%`, 
                          top: `${30 + (Math.sin(i) * 20)}%` 
                        }}
                      >
                        <div className="bg-white p-2 rounded-full shadow-lg border border-zinc-100 group-hover:scale-125 transition-transform">
                          {getIcon(wp.type)}
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-zinc-900 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          <p className="font-bold">{wp.name}</p>
                          <p className="opacity-70">{wp.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-zinc-900">Waypoints</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {waypoints.map((wp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-zinc-50 rounded-xl text-emerald-600">
                    {getIcon(wp.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-zinc-900">{wp.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{wp.description}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px] uppercase font-bold tracking-wider">
                      {wp.type}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
            {!waypoints.length && !loading && (
              <div className="text-center py-12 text-zinc-400">
                <p>No waypoints found yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MapIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);
