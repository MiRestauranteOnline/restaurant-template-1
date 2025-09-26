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
const generateGoogleFontsUrl = (fonts: string[], _titleFontWeight?: string): string => {
  // Request a full, cached weight range to avoid swaps when switching
  const weights = '100;200;300;400;500;600;700;800;900';
  const formattedFonts = fonts.map(font => `${formatFontName(font)}:wght@${weights}`);
  return `https://fonts.googleapis.com/css2?${formattedFonts.map(font => `family=${font}`).join('&')}&display=swap`;
};

// Load fonts from Google Fonts with preloading support (returns when ready)
export const loadGoogleFonts = async (fonts: FontSettings): Promise<void> => {
  const fontsToLoad: string[] = [];

  if (fonts.titleFont) {
    fontsToLoad.push(fonts.titleFont);
    loadedFonts.add(fonts.titleFont);
  }

  if (fonts.bodyFont) {
    fontsToLoad.push(fonts.bodyFont);
    loadedFonts.add(fonts.bodyFont);
  }

  if (fontsToLoad.length === 0) return;

  // Check if fonts are already preloaded - comprehensive list to prevent loading
  const preloadedFonts = [
    'Cormorant Garamond', 'Inter', 'Poppins', 'Montserrat', 'Playfair Display', 'Lato',
    'Open Sans', 'Roboto', 'Merriweather', 'Lora', 'Raleway', 'Ubuntu', 'Oswald',
    'Source Sans Pro', 'Nunito', 'Work Sans'
  ];
  const needsLoading = fontsToLoad.filter(font => !preloadedFonts.includes(font));

  if (needsLoading.length === 0) {
    return; // everything we need is already available
  }

  // Create and append font link for non-preloaded fonts and wait for it
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = generateGoogleFontsUrl(needsLoading, fonts.titleFontWeight);

  // Remove any existing dynamic font links to prevent duplicates
  const existingLinks = document.querySelectorAll('link[data-dynamic-font]');
  existingLinks.forEach(l => l.remove());
  link.setAttribute('data-dynamic-font', 'true');

  await new Promise<void>((resolve) => {
    link.addEventListener('load', () => resolve());
    // Fallback resolve in case 'load' doesn't fire
    setTimeout(() => resolve(), 500);
    document.head.appendChild(link);
  });

  // Ensure key weights are available before switching
  const weightCandidates = ['400', '700', fonts.titleFontWeight || '600'];
  const fontPromises: Promise<FontFace[]>[] = [];
  needsLoading.forEach((family) => {
    weightCandidates.forEach((w) => {
      try {
        fontPromises.push((document as any).fonts.load(`${w} 1em '${family}'`));
      } catch {}
    });
  });
  await Promise.allSettled(fontPromises);
};

// Apply fonts to CSS custom properties with smooth transition
export const applyFonts = (fonts: FontSettings): void => {
  const root = document.documentElement;
  
  // Force a style calculation before changing fonts to prevent shifts
  root.offsetHeight;
  
  if (fonts.titleFont) {
    const serifFonts = ['Playfair Display', 'Cormorant Garamond', 'Merriweather', 'Crimson Text', 'Libre Baskerville', 'Lora', 'Source Serif Pro'];
    const isSerif = serifFonts.includes(fonts.titleFont);
    const fallbackStack = isSerif
      ? `Georgia, 'Times New Roman', serif`
      : `system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif`;

    root.style.setProperty('--font-heading', `'${fonts.titleFont}', ${fallbackStack}`);
  }
  
  if (fonts.bodyFont) {
    const serifFonts = ['Playfair Display', 'Cormorant Garamond', 'Merriweather', 'Crimson Text', 'Libre Baskerville', 'Lora', 'Source Serif Pro'];
    const isSerif = serifFonts.includes(fonts.bodyFont);
    const fallbackStack = isSerif
      ? `Georgia, 'Times New Roman', serif`
      : `system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif`;

    root.style.setProperty('--font-body', `'${fonts.bodyFont}', ${fallbackStack}`);
  }
  
  // Apply title font weight immediately and force recalculation
  if (fonts.titleFontWeight) {
    root.style.setProperty('--font-heading-weight', fonts.titleFontWeight);
  }
  
  // Force immediate style recalculation to prevent shifts
  root.offsetHeight;
};

// Combined function to load and apply fonts without visible swap
export const loadAndApplyFonts = async (fonts: FontSettings): Promise<void> => {
  // 1) Ensure the new font files are ready
  try {
    await loadGoogleFonts(fonts);
  } catch {}
  // 2) Switch variables only after fonts are ready
  applyFonts(fonts);
};

// Cache fonts in localStorage for early application
export const cacheFonts = (domain: string, fonts: FontSettings): void => {
  try {
    const cacheKey = `fonts_${domain}`;
    localStorage.setItem(cacheKey, JSON.stringify(fonts));
  } catch (error) {
    console.warn('Failed to cache fonts:', error);
  }
};

// Load cached fonts for early application
export const getCachedFonts = (domain: string): FontSettings | null => {
  try {
    const cacheKey = `fonts_${domain}`;
    const cached = localStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn('Failed to load cached fonts:', error);
    return null;
  }
};

// Apply cached fonts early to prevent layout shifts
export const applyEarlyFonts = (domain: string): void => {
  const cachedFonts = getCachedFonts(domain);
  if (cachedFonts) {
    loadAndApplyFonts(cachedFonts);
  }
};