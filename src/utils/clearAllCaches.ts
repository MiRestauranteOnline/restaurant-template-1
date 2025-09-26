// Utility to clear all cached data
export const clearAllCaches = () => {
  // Clear localStorage caches
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes('fast-load') || key.includes('client_styles_') || key.includes('nav-data') || key.includes('settings-cache')) {
      localStorage.removeItem(key);
      console.log('Cleared cache:', key);
    }
  });
  
  // Clear any CSS custom properties that might have cached values
  const props = [
    '--cached-header-logo',
    '--cached-footer-logo',
    '--cached-homepage-hero-bg',
    '--cached-about-hero-bg',
    '--cached-contact-hero-bg',
    '--cached-menu-hero-bg',
    '--cached-reviews-hero-bg',
    '--cached-restaurant-name'
  ];
  
  props.forEach(prop => {
    document.documentElement.style.removeProperty(prop);
  });
  
  console.log('All caches cleared!');
};

// Auto-clear caches on load (temporary for debugging)
if (typeof window !== 'undefined') {
  clearAllCaches();
}