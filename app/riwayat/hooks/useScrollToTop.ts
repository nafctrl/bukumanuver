/**
 * useScrollToTop Hook
 * 
 * RESPONSIBILITIES:
 * - Detect scroll position and direction
 * - Determine when to show scroll-to-top button
 * - Provide smooth scroll-to-top function
 * 
 * NOT RESPONSIBLE FOR:
 * - Rendering the button (component handles that)
 * - Button styling or positioning
 * 
 * Logic:
 * - Show button when user is near bottom OR scrolling up significantly
 * - Near bottom: within 200px of page bottom
 * - Scrolling up significantly: scrolled down > 500px AND currently scrolling up
 * 
 * @returns showScrollTop - Boolean to control button visibility
 * @returns scrollToTop - Function to smoothly scroll to top
 */

import { useState, useEffect } from 'react';

export function useScrollToTop() {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Show button if:
            // 1. User is near bottom (within 200px)
            // 2. User is scrolling up and has scrolled down at least 500px
            const isNearBottom = (windowHeight + currentScrollY) >= (documentHeight - 200);
            const isScrollingUp = currentScrollY < lastScrollY;
            const hasScrolledSignificantly = currentScrollY > 500;

            setShowScrollTop(isNearBottom || (isScrollingUp && hasScrolledSignificantly));
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return { showScrollTop, scrollToTop };
}
