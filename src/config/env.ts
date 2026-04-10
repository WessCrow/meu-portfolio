/**
 * Centralized environment configuration
 * Ensures all VITE_ variables are accessed through a single point 
 * with proper typing and optional validation.
 */

export const env = {
  // Add environment variables here as needed
  // Example:
  // GOOGLE_SCRIPT_URL: import.meta.env.VITE_GOOGLE_SCRIPT_URL,
  
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  BASE_URL: import.meta.env.BASE_URL,
};

// Simple validation helper
export function validateEnv() {
  const missing: string[] = [];
  
  // Example validation logic:
  // if (!env.SOME_KEY) missing.push('VITE_SOME_KEY');
  
  if (missing.length > 0) {
    console.warn(`[Security] Missing environment variables: ${missing.join(', ')}`);
  }
}
