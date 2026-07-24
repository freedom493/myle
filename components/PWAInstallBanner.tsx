'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already dismissed or installed
    const isDismissed = localStorage.getItem('myle_pwa_dismissed') === 'true';
    if (isDismissed) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show your custom install UI
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the browser's install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferred prompt variable, it can only be used once
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('myle_pwa_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 bg-brand-indigo text-white rounded-2xl p-5 shadow-2xl border border-brand-lime/30"
        >
          {/* Background Glow */}
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-lime/20 blur-xl pointer-events-none" />

          <button
            onClick={handleDismiss}
            className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-brand-lime/10 p-3 border border-brand-lime/30 text-brand-lime shrink-0">
              <Smartphone className="h-6 w-6" />
            </div>

            <div className="space-y-1 pr-4">
              <h4 className="font-heading font-bold text-base text-brand-surface">
                Install MYLE Student OS
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Add MYLE to your home screen for quick offline access, full-screen speed, and instant study sessions.
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-lime text-brand-indigo px-4 py-2.5 text-xs font-bold hover:bg-brand-lime/90 transition shadow-md shadow-brand-lime/20"
            >
              <Download className="h-4 w-4" />
              <span>Install App</span>
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-xl bg-white/10 px-3 py-2.5 text-xs font-medium text-gray-300 hover:bg-white/15 transition"
            >
              Not Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}