import { useEffect } from 'react';

const useDisableZoom = () => {
  useEffect(() => {
    const isMobile = window.innerWidth <= 768; // Adjust as needed
    if (isMobile) {
      const preventZoom = (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };

      document.addEventListener('touchstart', preventZoom, { passive: false });
      document.addEventListener('touchmove', preventZoom, { passive: false });

      return () => {
        document.removeEventListener('touchstart', preventZoom);
        document.removeEventListener('touchmove', preventZoom);
      };
    }
  }, []);
};

export default useDisableZoom;