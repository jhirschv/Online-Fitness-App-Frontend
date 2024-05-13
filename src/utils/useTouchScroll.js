import { useRef, useState, useCallback } from 'react';

export default function useTouchScroll(shouldPreventScroll) {
    const [touchStartY, setTouchStartY] = useState(0);
    const [lastTouchY, setLastTouchY] = useState(0);
    const touchAreaRef = useRef(null);

    const handleTouchStart = useCallback((e) => {
        if (shouldPreventScroll()) {
            e.preventDefault();  // Prevent default only if dragging
            return;  // Exit early if scrolling should be prevented
        }
        setTouchStartY(e.touches[0].clientY);
        setLastTouchY(e.touches[0].clientY);
    }, [shouldPreventScroll]);

    const handleTouchMove = useCallback((e) => {
        if (shouldPreventScroll()) {
            e.preventDefault();  // Prevent default only if dragging
            return;  // Exit early if scrolling should be prevented
        }
        const currentTouchY = e.touches[0].clientY;
        const diffY = lastTouchY - currentTouchY;
        if (touchAreaRef.current) {
            touchAreaRef.current.scrollTop += diffY;
        }
        setLastTouchY(currentTouchY);
    }, [lastTouchY, shouldPreventScroll]);

    const handleTouchEnd = useCallback((e) => {
        // Perform any cleanup or final actions needed here
    }, [shouldPreventScroll]);

    return { touchAreaRef, handleTouchStart, handleTouchMove, handleTouchEnd };
}