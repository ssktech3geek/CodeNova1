import React from 'react';
import { X, Bell, CheckCheck, User, ShieldCheck, Truck, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

export const NotificationFeed: React.FC = () => {
  const { notifications, isOpen, setIsOpen, markAsRead, markAllAsRead } = useNotifications();

  if (!isOpen) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'TRAVELER':
        return <User className="w-3.5 h-3.5 text-primary dark:text-primary-bright" />;
      case 'OPERATOR':
        return <ShieldCheck className="w-3.5 h-3.5 text-teal-700 dark:text-teal-300" />;
      case 'VENDOR':
        return <Truck className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'ALERT':
      case 'DISRUPTION':
        return <AlertTriangle className="w-4 h-4 text-disruption shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-surface dark:bg-[#1A2226] shadow-2xl border-l border-gray-200 dark:border-white/10 flex flex-col animate-slide-left transition-colors duration-200">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-surface-muted dark:bg-[#141B1F]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary-light dark:bg-primary/20 text-primary dark:text-primary-bright">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-content-primary dark:text-dark-text">
              Multi-Stakeholder Sync Feed
            </h3>
            <span className="text-[11px] text-content-secondary dark:text-dark-secondary">
              Traveler, Operator, and Vendor notifications
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="p-1.5 text-[11px] font-semibold text-primary dark:text-primary-bright hover:underline cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded"
            title="Mark all as read"
          >
            <CheckCheck className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-content-secondary dark:text-dark-secondary hover:text-content-primary dark:hover:text-dark-text rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-100 dark:divide-white/5">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-content-secondary dark:text-dark-secondary text-xs">
            No new activity notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`pt-3 first:pt-0 cursor-pointer transition-all duration-150 p-2.5 rounded-xl ${
                !n.read
                  ? 'bg-primary-light/40 dark:bg-primary/10 border border-primary/20 dark:border-primary/30'
                  : 'hover:bg-gray-50 dark:hover:bg-[#141B1F]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0">{getTypeIcon(n.type)}</div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-content-primary dark:text-dark-text">
                      {n.title}
                    </span>
                    <span className="text-[10px] text-content-tertiary dark:text-gray-500">
                      {n.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-content-secondary dark:text-dark-secondary leading-relaxed">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="inline-flex items-center gap-1 bg-gray-100 dark:bg-[#11171A] px-2 py-0.5 rounded text-[10px] font-semibold text-content-secondary dark:text-dark-secondary border border-gray-200/60 dark:border-white/5">
                      {getRoleIcon(n.recipientRole)}
                      <span>{n.stakeholderName || n.recipientRole}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-surface-muted dark:bg-[#141B1F] border-t border-gray-200 dark:border-white/10 text-center text-[10px] text-content-secondary dark:text-dark-secondary">
        Automatic real-time sync across traveler app & vendor dispatch
      </div>
    </div>
  );
};
