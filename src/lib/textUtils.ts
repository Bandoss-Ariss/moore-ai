/**
 * Preprocessing utilities for text translation
 */

/**
 * Preprocesses French text before translation to Mooré
 * Replaces specific terms to improve translation quality
 * 
 * @param text - The French text to preprocess
 * @returns The preprocessed text
 */
export function preprocessFrenchText(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // Replace "bienvenu" (and its variations) with "Bonne arrivée"
  // Case-insensitive replacement that preserves original casing
  let processedText = text
    // Match "bienvenu" at word boundaries, case-insensitive
    .replace(/\bbienvenu\b/gi, (match) => {
      // Preserve the case of the original match
      if (match === match.toUpperCase()) {
        return "BONNE ARRIVÉE";
      } else if (match[0] === match[0].toUpperCase()) {
        return "Bonne arrivée";
      } else {
        return "bonne arrivée";
      }
    })
    // Also handle "bienvenue" (feminine form)
    .replace(/\bbienvenue\b/gi, (match) => {
      if (match === match.toUpperCase()) {
        return "BONNE ARRIVÉE";
      } else if (match[0] === match[0].toUpperCase()) {
        return "Bonne arrivée";
      } else {
        return "bonne arrivée";
      }
    });

  return processedText;
}

/**
 * Checks if the source language is French
 * 
 * @param srcLang - The source language code
 * @returns True if the source language is French
 */
export function isFrenchSource(srcLang: string): boolean {
  return srcLang === "fra_Latn";
}

