/**
 * PWA Utility for App Badging API
 */

export const updateAppBadge = (count) => {
  if (typeof navigator !== 'undefined' && 'setAppBadge' in navigator) {
    if (count > 0) {
      navigator.setAppBadge(count).catch((error) => {
        console.warn('PWA: Error setting badge', error);
      });
    } else {
      navigator.clearAppBadge().catch((error) => {
        console.warn('PWA: Error clearing badge', error);
      });
    }
  }
};
