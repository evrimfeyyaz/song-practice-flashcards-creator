/**
 * Creates a stable hash number from a string that falls within Anki's model ID range (0 to 2^31).
 * This is a variant of the djb2 hash algorithm created by Daniel J. Bernstein.
 * 
 * The algorithm works by:
 * 1. Starting with a seed value
 * 2. For each character: hash = (hash * 31) + charCode
 * 3. Converting to 32-bit integer
 * 4. Ensuring output is positive and within Anki's range
 * 
 * Properties:
 * - Deterministic: Same input and seed always produces same hash
 * - Well-distributed: Hash values spread evenly across the range
 * - Fast: Uses simple arithmetic operations
 * - Not cryptographically secure: Do not use for security purposes
 * 
 * @param str The string to hash.
 * @param seed An optional seed to create different hashes for the same string.
 * @returns A number between 0 and 2^31 - 1 (0x7FFFFFFF).
 */
export function generateStableHash(str: string, seed = 0): number {
  let hash = seed;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char; // Equivalent to: hash = (hash * 31) + char
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Ensure the hash is positive and within Anki's model ID range (0 to 2^31 - 1)
  return Math.abs(hash) % 0x7FFFFFFF;
} 