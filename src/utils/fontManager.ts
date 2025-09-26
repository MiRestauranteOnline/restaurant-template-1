// Font management utility for dynamic Google Fonts loading
export interface FontSettings {
  titleFont?: string;
  bodyFont?: string;
  titleFontWeight?: string;
}

// Cache for loaded fonts to avoid duplicate requests
const loadedFonts = new Set<string>();

// Popular Google Fonts list for future font picker
export const POPULAR_GOOGLE_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans Pro',
  'Oswald',
  'Raleway',
  'Ubuntu',
  'Playfair Display',
  'Cormorant Garamond',
  'Merriweather',
  'Crimson Text',
  'Libre Baskerville',
  'Lora',
  'Source Serif Pro',
  'Nunito',
  'Work Sans',
  'Fira Sans'
];

// Convert font name to Google Fonts URL format
const formatFontName = (fontName: string): string => {
  return fontName.replace(/\s+/g, '+');
};

// Generate Google Fonts URL for multiple fonts with custom weights
const generateGoogleFontsUrl = (fonts: string[], titleFontWeight?: string): string => {
  const weights = titleFontWeight ? `${titleFontWeight};400;500;600;700` : '300;400;500;600;700';
  const formattedFonts = fonts.map(font => `${formatFontName(font)}:wght@${weights}`);
  const timestamp = Date.now(); // Add timestamp to prevent caching
  return `https://fonts.googleapis.com/css2?${formattedFonts.map(font => `family=${font}`).join('&')}&display=swap&v=${timestamp}`;
};

// Load fonts from Google Fonts
export const loadGoogleFonts = (fonts: FontSettings): void => {
  const fontsToLoad: string[] = [];
  
  // Clear cache and force reload of fonts
  if (fonts.titleFont) {
    fontsToLoad.push(fonts.titleFont);
    loadedFonts.add(fonts.titleFont);
  }
  
  if (fonts.bodyFont) {
    fontsToLoad.push(fonts.bodyFont);
    loadedFonts.add(fonts.bodyFont);
  }
  
  if (fontsToLoad.length === 0) return;

  // Create and append font link to head
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = generateGoogleFontsUrl(fontsToLoad, fonts.titleFontWeight);
  
  // Remove any existing dynamic font links to prevent duplicates
  const existingLinks = document.querySelectorAll('link[data-dynamic-font]');
  existingLinks.forEach(link => link.remove());
  
  link.setAttribute('data-dynamic-font', 'true');
  
  // Force a small delay to ensure the DOM is ready
  setTimeout(() => {
    document.head.appendChild(link);
  }, 10);
};

// Apply fonts to CSS custom properties
export const applyFonts = (fonts: FontSettings): void => {
  const root = document.documentElement;
  
  if (fonts.titleFont) {
    // Get font category (serif/sans-serif) for fallback
    const serifFonts = ['Playfair Display', 'Cormorant Garamond', 'Merriweather', 'Crimson Text', 'Libre Baskerville', 'Lora', 'Source Serif Pro'];
    const fallback = serifFonts.includes(fonts.titleFont) ? 'serif' : 'sans-serif';
    
    root.style.setProperty('--font-heading', `'${fonts.titleFont}', ${fallback}`);
  }
  
  if (fonts.bodyFont) {
    // Body fonts are typically sans-serif
    const serifFonts = ['Playfair Display', 'Cormorant Garamond', 'Merriweather', 'Crimson Text', 'Libre Baskerville', 'Lora', 'Source Serif Pro'];
    const fallback = serifFonts.includes(fonts.bodyFont) ? 'serif' : 'sans-serif';
    
    root.style.setProperty('--font-body', `'${fonts.bodyFont}', ${fallback}`);
  }
  
  // Apply title font weight
  if (fonts.titleFontWeight) {
    root.style.setProperty('--font-heading-weight', fonts.titleFontWeight);
  }
};

// Combined function to load and apply fonts
export const loadAndApplyFonts = (fonts: FontSettings): void => {
  loadGoogleFonts(fonts);
  applyFonts(fonts);
};

// Cache fonts in localStorage for early application
export const cacheFonts = (subdomain: string, fonts: FontSettings): void => {
  try {
    const cacheKey = `fonts_${subdomain}`;
    localStorage.setItem(cacheKey, JSON.stringify(fonts));
  } catch (error) {
    console.warn('Failed to cache fonts:', error);
  }
};

// Load cached fonts for early application
export const getCachedFonts = (subdomain: string): FontSettings | null => {
  try {
    const cacheKey = `fonts_${subdomain}`;
    const cached = localStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn('Failed to load cached fonts:', error);
    return null;
  }
};

// Apply cached fonts early to prevent layout shifts
export const applyEarlyFonts = (subdomain: string): void => {
  const cachedFonts = getCachedFonts(subdomain);
  if (cachedFonts) {
    loadAndApplyFonts(cachedFonts);
  }
};