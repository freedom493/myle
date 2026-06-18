'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Bell, X, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WarningCard() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if warning has been dismissed in this session
    const isDismissed = sessionStorage.getItem('myle_session_warning_dismissed')
    if (!isDismissed) {
      // Small timeout to show it after page load completes
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem('myle_session_warning_dismissed', 'true')
    setIsOpen(false)
  }

  // Placeholders for WhatsApp Group and Channel Links
  const WHATSAPP_CHANNEL_LINK = "https://whatsapp.com/channel/0029Vb89HYY5K3zW069YCD26"
  const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/EGrdpOs0XGOBZhoU6JneK5"

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-brand-indigo text-white shadow-2xl border border-brand-lime/20"
          >
            {/* Glow effect */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-lime/20 blur-2xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-brand-lime/10 blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button 
              onClick={handleDismiss}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors z-10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="p-6 sm:p-8 relative z-0">
              <div className="inline-flex items-center justify-center rounded-xl bg-brand-lime/10 p-3 mb-4 border border-brand-lime/30 text-brand-lime">
                <Bell className="h-6 w-6 animate-bounce" />
              </div>

              <h3 className="text-xl font-bold font-heading mb-2 text-brand-surface">
                Stay Updated!
              </h3>
              
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                Join our student community on WhatsApp to get the latest study resources, updates, and connect with other students.
              </p>

              <div className="space-y-3">
                {/* WhatsApp Channel */}
                <a 
                  href={WHATSAPP_CHANNEL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-brand-lime text-brand-indigo font-semibold hover:bg-brand-lime/90 transition-all shadow-lg shadow-brand-lime/20 group text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Follow WhatsApp Channel
                  </span>
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* WhatsApp Discussion Group */}
                <a 
                  href={WHATSAPP_GROUP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-all border border-white/10 group text-sm"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-brand-lime" />
                    Join Discussion Group
                  </span>
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              <button 
                onClick={handleDismiss}
                className="mt-6 text-xs text-gray-400 hover:text-white transition-colors block w-full text-center hover:underline"
              >
                Maybe later, I'll explore first
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}