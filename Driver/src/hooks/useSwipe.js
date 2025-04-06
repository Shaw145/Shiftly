const useSwipe = (onSwipeRight, onSwipeLeft, threshold = 50, edgeSize = 20) => {
  let touchStart = null;
  let touchStartY = null;
  let isSwiping = false;

  const onTouchStart = (e) => {
    // Only register touch if it starts from the left edge or if sidebar is open
    const touchX = e.touches[0].clientX;
    if (touchX <= edgeSize || onSwipeLeft) {
      touchStart = touchX;
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

    // Prevent scrolling while swiping
    if (isSwiping) {
      e.preventDefault();
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
