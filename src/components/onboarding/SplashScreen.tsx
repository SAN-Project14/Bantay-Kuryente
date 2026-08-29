import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 950,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, prefersReducedMotion ? 400 : Math.max(durationMs - 250, 400));

    const finishTimer = setTimeout(() => {
      onFinish();
    }, prefersReducedMotion ? 500 : durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish, durationMs]);

  return (
    <div
      id="bantay-splash-screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 text-slate-900 px-6 select-none transition-opacity duration-200 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      role="status"
      aria-label="Loading Bantay Kuryente"
    >
      <div className="flex flex-col items-center text-center max-w-xs animate-in fade-in zoom-in-95 duration-500 ease-out">
        {/* Minimalist Brand Mark: Charcoal base with warm amber energy core */}
        <div
          id="splash-logo-container"
          className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-md mb-6"
        >
          {/* Subtle warm electric spark ring */}
          <div className="absolute inset-0 rounded-2xl border border-amber-500/30"></div>
          
          <svg
            className="w-10 h-10 sm:w-11 sm:h-11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Meter Gauge Arc */}
            <path
              d="M12 4a8 8 0 0 0-8 8c0 2.2.9 4.2 2.3 5.7"
              className="stroke-slate-400"
            />
            <path
              d="M17.7 17.7A8 8 0 0 0 20 12a8 8 0 0 0-8-8"
              className="stroke-amber-400"
            />
            {/* Energy Core Lightning */}
            <path
              d="M13 3l-4 8h4l-2 9 6-10h-4l2-7z"
              fill="#F59E0B"
              stroke="#D97706"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        {/* Brand Title */}
        <h1
          id="splash-title"
          className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mb-1.5"
        >
          BANTAY-KURYENTE
        </h1>

        {/* Purpose Subtitle */}
        <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-normal">
          Household Electricity & Meter Tracker
        </p>

        {/* Minimal status indicator */}
        <div className="mt-8 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-[11px] font-semibold text-slate-400">
            Offline-Ready
          </span>
        </div>
      </div>
    </div>
  );
};
