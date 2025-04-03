const useSwipe = (onSwipeRight, onSwipeLeft, threshold = 50, edgeSize = 20) => {
  let touchStart = null;
  let touchStartY = null;
  let isSwiping = false;

  const onTouchStart = (e) => {
    // For opening sidebar: only register touch if it starts from the left edge
    // For closing sidebar: register touch anywhere when sidebar is open
    if (e.touches[0].clientX <= edgeSize || onSwipeLeft) {
      touchStart = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      isSwiping = true;
    }
  };

  const onTouchMove = (e) => {
    if (!touchStart || !isSwiping) return;

    const currentTouch = e.touches[0].clientX;
    const currentTouchY = e.touches[0].clientY;

    // Calculate horizontal and vertical differences
    const horizontalDiff = currentTouch - touchStart;
    const verticalDiff = Math.abs(currentTouchY - touchStartY);

    // If vertical swipe is greater than horizontal, cancel the gesture
    if (verticalDiff > Math.abs(horizontalDiff)) {
      touchStart = null;
      touchStartY = null;
      isSwiping = false;
      return;
    }

    if (Math.abs(horizontalDiff) >= threshold) {
      if (horizontalDiff > 0) {
        // Swipe right - only trigger if started from left edge
        if (touchStart <= edgeSize) {
          onSwipeRight?.();
        }
      } else {
        // Swipe left - can trigger anywhere when sidebar is open
        onSwipeLeft?.();
      }
      touchStart = null;
      touchStartY = null;
      isSwiping = false;
    }
  };

  const onTouchEnd = () => {
    touchStart = null;
    touchStartY = null;
    isSwiping = false;
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};

export default useSwipe;
