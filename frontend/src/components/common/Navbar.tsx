import React from 'react';
import { Compass, Bell, RefreshCw, ShieldCheck, UserCheck, Sun, Moon, Sparkles } from 'lucide-react';
import { useItinerary } from '../../contexts/ItineraryContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useTheme } from '../../contexts/useTheme';

interface NavbarProps {
  currentStep: 'PLANNER' | 'OPTIONS' | 'DETAIL';
  onNavigate: (step: 'PLANNER' | 'OPTIONS' | 'DETAIL') => void;
  activeRole: 'TRAVELER' | 'OPERATOR';
  onToggleRole: (role: 'TRAVELER' | 'OPERATOR') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStep,
  onNavigate,
  activeRole,
  onToggleRole,
}) => {
  const { itinerary, resetToOriginal } = useItinerary();
  const { unreadCount, setIsOpen, isOpen } = useNotifications();
  const { theme, toggleTheme } = useTheme();

  const isAdapted = itinerary?.status === 'ADAPTED';
  const isDisrupted = itinerary?.status === 'DISRUPTED';

  const stepLabels = {
    PLANNER: '1. Trip Request',
    OPTIONS: '2. Itinerary Options',
    DETAIL: '3. Day Timeline & Engine',
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/95 dark:bg-[#151C20]/95 backdrop-blur-md border-b border-gray-200/80 dark:border-white/10 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('PLANNER')}
              className="flex items-center gap-2.5 group text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-xl"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-teal-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-content-primary dark:text-dark-text">
                    Code<span className="text-primary dark:text-primary-bright">Nova</span>
                  </span>
                  <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-bright text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase border border-primary/20">
                    Celestial
                  </span>
                </div>
                <p className="text-[11px] text-content-secondary dark:text-dark-secondary hidden lg:block">
                  Personalized Dynamic Tour Planning & Operations Platform
                </p>
              </div>
            </button>
          </div>

          {/* Center: Desktop Stepper vs Mobile Compact Step Indicator */}
          {/* Desktop Stepper */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-muted dark:bg-[#111619] p-1 rounded-xl border border-gray-200 dark:border-white/10">
            {(['PLANNER', 'OPTIONS', 'DETAIL'] as const).map((step, idx) => {
              const isActive = currentStep === step;
              return (
                <React.Fragment key={step}>
                  {idx > 0 && <span className="text-gray-300 dark:text-gray-600 px-0.5">/</span>}
                  <button
                    onClick={() => onNavigate(step)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white dark:bg-[#20292F] text-primary dark:text-primary-bright shadow-xs font-bold'
                        : 'text-content-secondary dark:text-dark-secondary hover:text-content-primary dark:hover:text-dark-text'
                    }`}
                  >
                    <span>{stepLabels[step]}</span>
                    {step === 'DETAIL' && isAdapted && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Mobile Compact Stepper Dropdown / Progress Dots */}
          <div className="flex md:hidden items-center gap-1 bg-surface-muted dark:bg-[#111619] px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/10">
            <span className="text-[11px] font-bold text-primary dark:text-primary-bright">
              {currentStep === 'PLANNER' ? 'Step 1/3' : currentStep === 'OPTIONS' ? 'Step 2/3' : 'Step 3/3'}
            </span>
            <div className="flex items-center gap-1 ml-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${currentStep === 'PLANNER' ? 'bg-primary dark:bg-primary-bright' : 'bg-gray-300 dark:bg-gray-700'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${currentStep === 'OPTIONS' ? 'bg-primary dark:bg-primary-bright' : 'bg-gray-300 dark:bg-gray-700'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${currentStep === 'DETAIL' ? 'bg-primary dark:bg-primary-bright' : 'bg-gray-300 dark:bg-gray-700'}`} />
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Version & Pricing Pill (Desktop) */}
            {itinerary && (
              <div className="hidden xl:flex items-center gap-1.5 bg-gray-50 dark:bg-[#1A2226] border border-gray-200 dark:border-white/10 px-2.5 py-1 rounded-lg text-xs">
                <span className="text-content-secondary dark:text-dark-secondary font-medium">Version:</span>
                <span
                  className={`font-bold ${
                    isAdapted
                      ? 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded'
                      : isDisrupted
                      ? 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-950/60 px-1.5 py-0.5 rounded'
                      : 'text-primary dark:text-primary-bright'
                  }`}
                >
                  {isAdapted ? 'v2.0 (Adapted)' : isDisrupted ? 'v1.0 (Disrupted)' : 'v1.0'}
                </span>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <span className="font-extrabold text-content-primary dark:text-dark-text">
                  ₹{itinerary.pricing.total.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Operator / Traveler Role Switcher */}
            <div className="flex items-center bg-gray-100 dark:bg-[#1A2226] p-0.5 rounded-lg border border-gray-200 dark:border-white/10 text-xs">
              <button
                onClick={() => onToggleRole('TRAVELER')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                  activeRole === 'TRAVELER'
                    ? 'bg-white dark:bg-[#2A343A] text-primary dark:text-primary-bright shadow-xs font-semibold'
                    : 'text-content-secondary dark:text-dark-secondary hover:text-content-primary dark:hover:text-dark-text'
                }`}
                title="Traveler View"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Traveler</span>
              </button>
              <button
                onClick={() => onToggleRole('OPERATOR')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                  activeRole === 'OPERATOR'
                    ? 'bg-white dark:bg-[#2A343A] text-teal-800 dark:text-teal-300 shadow-xs font-semibold'
                    : 'text-content-secondary dark:text-dark-secondary hover:text-content-primary dark:hover:text-dark-text'
                }`}
                title="Operator Margins View"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Operator</span>
              </button>
            </div>

            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-content-secondary dark:text-dark-secondary hover:text-content-primary dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-[#1A2226] transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-content-secondary hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 rounded-lg text-content-secondary dark:text-dark-secondary hover:text-content-primary dark:hover:text-dark-text hover:bg-gray-100 dark:hover:bg-[#1A2226] transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
              title="Stakeholder Notifications Feed"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Reset Prototype State Button */}
            <button
              onClick={resetToOriginal}
              className="p-2 text-content-secondary dark:text-dark-secondary hover:text-primary dark:hover:text-primary-bright hover:bg-primary-light dark:hover:bg-primary/20 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
              title="Reset prototype state back to initial v1.0"
              aria-label="Reset prototype"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
