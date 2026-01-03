/**
 * ScrollToTopButton Component
 * 
 * RESPONSIBILITIES:
 * - Render floating button in bottom-right corner
 * - Smooth scroll to top of page when clicked
 * - Fade in/out animation based on visibility state
 * 
 * NOT RESPONSIBLE FOR:
 * - Scroll position detection (handled by hook/parent)
 * - Determining when to show/hide (receives visibility state)
 * 
 * @param showScrollTop - Boolean to show/hide button
 * @param scrollToTop - Function to execute scroll action
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollToTopButtonProps {
    showScrollTop: boolean;
    scrollToTop: () => void;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ showScrollTop, scrollToTop }) => {
    return (
        <AnimatePresence>
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    onClick={scrollToTop}
                    className="fixed bottom-24 right-8 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-colors z-40"
                    title="Scroll to top"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 19V5m0 0l-7 7m7-7l7 7" />
                    </svg>
                </motion.button>
            )}
        </AnimatePresence>
    );
};
