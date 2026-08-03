import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const WelcomeScreen = ({ onLoadingComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[#030014] flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      <div className="w-full max-w-lg text-center space-y-6">
        <p className="text-sm tracking-[0.2em] uppercase text-slate-500">
          Portfolio
        </p>

        <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight">
          Wahyu Oktavian
        </h1>

        <p className="text-base sm:text-lg text-slate-300">
          Software Engineer · IT Support
        </p>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md mx-auto">
          3 years building and supporting web systems — from Laravel apps to day-to-day IT operations.
        </p>

        <button
          type="button"
          onClick={() => onLoadingComplete?.()}
          className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-lg border border-white/15 bg-white/5 text-white text-sm font-medium hover:bg-white/10 hover:border-white/25 transition-colors"
        >
          View portfolio
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default WelcomeScreen;
