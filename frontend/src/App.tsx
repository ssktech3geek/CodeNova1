import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ItineraryProvider, useItinerary } from './contexts/ItineraryContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { NotificationFeed } from './components/notifications/NotificationFeed';
import { TripPlannerPage } from './pages/TripPlannerPage';
import { ItineraryComparisonPage } from './pages/ItineraryComparisonPage';
import { ItineraryDetailPage } from './pages/ItineraryDetailPage';

const APP_STEP_KEY = 'codenova_app_step_v1';
const APP_ROLE_KEY = 'codenova_app_role_v1';

type AppStep = 'PLANNER' | 'OPTIONS' | 'DETAIL';

export const AppContent: React.FC = () => {
  const { selectedPlan } = useItinerary();
  const [currentStep, setCurrentStep] = useState<AppStep>(() => {
    try {
      const storedStep = localStorage.getItem(APP_STEP_KEY) as AppStep | null;
      if (storedStep === 'OPTIONS' || storedStep === 'DETAIL' || storedStep === 'PLANNER') {
        return storedStep;
      }
    } catch (error) {
      console.error('Failed to restore app step', error);
    }
    return 'PLANNER';
  });
  const [activeRole, setActiveRole] = useState<'TRAVELER' | 'OPERATOR'>(() => {
    try {
      const storedRole = localStorage.getItem(APP_ROLE_KEY) as 'TRAVELER' | 'OPERATOR' | null;
      if (storedRole === 'TRAVELER' || storedRole === 'OPERATOR') {
        return storedRole;
      }
    } catch (error) {
      console.error('Failed to restore app role', error);
    }
    return 'TRAVELER';
  });

  useEffect(() => {
    try {
      localStorage.setItem(APP_STEP_KEY, currentStep);
    } catch (error) {
      console.error('Failed to persist app step', error);
    }
  }, [currentStep]);

  useEffect(() => {
    try {
      localStorage.setItem(APP_ROLE_KEY, activeRole);
    } catch (error) {
      console.error('Failed to persist app role', error);
    }
  }, [activeRole]);

  useEffect(() => {
    if (selectedPlan && currentStep !== 'DETAIL') {
      setCurrentStep('DETAIL');
    }
  }, [selectedPlan, currentStep]);

  return (
    <div className="min-h-screen bg-surface-muted dark:bg-[#0F1417] flex flex-col text-content-primary dark:text-dark-text transition-colors duration-200 selection:bg-primary/20 selection:text-primary">
      {/* Top Sticky Navigation with Theme Toggle */}
      <Navbar
        currentStep={currentStep}
        onNavigate={(step) => setCurrentStep(step)}
        activeRole={activeRole}
        onToggleRole={(role) => setActiveRole(role)}
      />

      {/* Main Page Flow */}
      <main className="flex-1 pb-16">
        {currentStep === 'PLANNER' && (
          <TripPlannerPage onNavigateToOptions={() => setCurrentStep('OPTIONS')} />
        )}

        {currentStep === 'OPTIONS' && (
          <ItineraryComparisonPage
            onNavigateBack={() => setCurrentStep('PLANNER')}
            onSelectPlan={() => setCurrentStep('DETAIL')}
          />
        )}

        {currentStep === 'DETAIL' && (
          <ItineraryDetailPage
            onBackToOptions={() => setCurrentStep('OPTIONS')}
            activeRole={activeRole}
          />
        )}
      </main>

      {/* Stakeholder Notification Drawer */}
      <NotificationFeed />

      {/* Footer */}
      <footer className="bg-surface dark:bg-[#111619] border-t border-gray-200 dark:border-white/10 py-6 text-center text-xs text-content-secondary dark:text-dark-secondary transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-content-primary dark:text-dark-text">
            <span>CodeNova</span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <span className="font-normal text-content-secondary dark:text-dark-secondary">Hack Celestial 2026 Demo Prototype</span>
          </div>
          <div className="text-[11px] text-content-secondary dark:text-dark-secondary">
            Built with React, Vite, Tailwind CSS & Dynamic Adaptation Replanning Engine
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <ItineraryProvider>
          <AppContent />
        </ItineraryProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
