import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
  isFirstLaunch?: boolean;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  isFirstLaunch = true,
  durationMs,
}) => {
  const [logoVisible, setLogoVisible] = useState(false);
  const [titleVisible, setTitleVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    if (prefersReducedMotion) {
      // Reduced motion: show everything immediately, fast exit
      setLogoVisible(true);
      setTitleVisible(true);
      setTaglineVisible(true);

      timeouts.push(
        setTimeout(() => setIsFadingOut(true), 400),
        setTimeout(() => onFinish(), 500)
      );
    } else if (!isFirstLaunch) {
      // Returning user: ~1.0–1.2s total, fast recognizable branding
      setLogoVisible(true);
      setTitleVisible(true);
      setTaglineVisible(true);

      const exitTime = durationMs ? Math.max(durationMs - 200, 700) : 900;
      const finishTime = durationMs || 1100;

      timeouts.push(
        setTimeout(() => setIsFadingOut(true), exitTime),
        setTimeout(() => onFinish(), finishTime)
      );
    } else {
      // First-time user deliberate sequence (approx 2.5s total)
      // 0–300ms: Clean background
      // 300–800ms: Logo fades and subtly scales in (500ms transition)
      timeouts.push(
        setTimeout(() => {
          setLogoVisible(true);
        }, 300)
      );

      // 700–1200ms: "BANTAY-KURYENTE" title fades in (500ms transition)
      timeouts.push(
        setTimeout(() => {
          setTitleVisible(true);
        }, 700)
      );

      // 1100–1700ms: Tagline & status fade in (600ms transition)
      timeouts.push(
        setTimeout(() => {
          setTaglineVisible(true);
        }, 1100)
      );

      // 1700–2300ms: Completely stable & readable (no continuous animation)
      // 2300–2550ms: Subtle fade transition out
      const exitTime = durationMs ? Math.max(durationMs - 250, 1800) : 2300;
      const finishTime = durationMs || 2550;

      timeouts.push(
        setTimeout(() => {
          setIsFadingOut(true);
        }, exitTime),
        setTimeout(() => {
          onFinish();
        }, finishTime)
      );
    }

    return () => {
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, [onFinish, isFirstLaunch, durationMs]);

  return (
    <div
      id="bantay-splash-screen"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 text-slate-900 px-6 select-none transition-opacity duration-250 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      role="status"
      aria-label="Loading Bantay Kuryente"
    >
      <div className="flex flex-col items-center text-center max-w-xs w-full">
        {/* 1. Minimalist Brand Mark: Charcoal base with warm amber energy core */}
        <div
          id="splash-logo-container"
          className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-md mb-6 transition-all duration-500 ease-out ${
            logoVisible
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 translate-y-2'
          }`}
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

        {/* 2. Brand Title: Staggered entrance */}
        <h1
          id="splash-title"
          className={`text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mb-1.5 transition-all duration-500 ease-out ${
            titleVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          BANTAY-KURYENTE
        </h1>

        {/* 3. Purpose Subtitle & Offline Status: Staggered entrance */}
        <div
          className={`flex flex-col items-center transition-all duration-600 ease-out ${
            taglineVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-normal">
            Household Electricity & Meter Tracker
          </p>

          {/* Static, stable status indicator (no continuous loop/pulse) */}
          <div className="mt-8 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span className="text-[11px] font-semibold text-slate-400">
              Offline-Ready
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
