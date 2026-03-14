import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, TrendingUp, Utensils, Fuel, Calendar, Map as MapIcon } from 'lucide-react';
import { geminiService } from '../services/geminiService';

export const CostEstimator: React.FC = () => {
  const [distance, setDistance] = useState<number>(100);
  const [days, setDays] = useState<number>(3);
  const [vehicle, setVehicle] = useState('Car');
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<number | null>(null);

  const calculateEstimate = async () => {
    setLoading(true);
    try {
      const result = await geminiService.estimateCost(distance, days, vehicle);
      setEstimate(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Smart Cost Estimator</h1>
        <p className="text-zinc-500">Plan your budget with AI-powered precision</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-8 space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-2">
                <MapIcon size={14} /> Distance (km)
              </span>
              <input
                type="range"
                min="10"
                max="5000"
                step="10"
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
              />
              <div className="flex justify-between text-xs text-zinc-400 mt-2 font-mono">
                <span>10km</span>
                <span className="text-emerald-600 font-bold text-lg">{distance}km</span>
                <span>5000km</span>
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-2">
                <Calendar size={14} /> Duration (Days)
              </span>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 5, 7, 10, 14].map(d => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                      days === d ? 'bg-zinc-900 text-white' : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-2">
                <Fuel size={14} /> Transport Mode
              </span>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Car', 'Bus', 'Train', 'Flight'].map(v => (
                  <button
                    key={v}
                    onClick={() => setVehicle(v)}
                    className={`py-3 rounded-xl text-sm font-bold transition-all ${
                      vehicle === v ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </label>
          </div>

          <button
            onClick={calculateEstimate}
            disabled={loading}
            className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <TrendingUp size={20} />
                Calculate Wallet View
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full -mr-16 -mt-16" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                  <Wallet size={24} className="text-emerald-400" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest opacity-50">Estimated Budget</span>
              </div>
              
              <div>
                <span className="text-5xl font-bold tracking-tighter">
                  ${estimate !== null ? estimate.toLocaleString() : '---'}
                </span>
                <p className="text-emerald-400 text-sm font-medium mt-2 flex items-center gap-1">
                  <TrendingUp size={14} /> AI-Optimized Estimate
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider opacity-50">Transport</p>
                  <p className="font-bold text-sm">${estimate ? Math.round(estimate * 0.4) : '0'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider opacity-50">Meals & Misc</p>
                  <p className="font-bold text-sm">${estimate ? Math.round(estimate * 0.6) : '0'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
            <h3 className="text-emerald-900 font-bold flex items-center gap-2 mb-3">
              <Utensils size={18} /> Budget Tips
            </h3>
            <ul className="space-y-2 text-sm text-emerald-800/70">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0" />
                Booking {vehicle} travel 2 weeks in advance can save up to 20%.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 shrink-0" />
                Average meal cost along this route is estimated at $25/day.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
