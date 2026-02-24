type TypingAnalysis = {
  accuracy: number
  wpm: number
  errors: number
}

/**
 * Optimized Damerau-Levenshtein distance algorithm.
 * - Tracks insertion, deletion, substitution, and transposition (common typing mistakes).
 *
 * @param a - Original reference text (exact casing and punctuation)
 * @param b - User's typed text
 * @returns Number of character-level errors
 */
function optimizedLevenshtein(a: string, b: string): number {
  const lenA = a.length,
    lenB = b.length
  if (lenA === 0) return lenB // If reference is empty, all chars must be added
  if (lenB === 0) return lenA // If typed is empty, all chars are missing

  let prevRow: number[] = Array(lenB + 1).fill(0)
  let currRow: number[] = Array(lenB + 1).fill(0)

  for (let j = 0; j <= lenB; j++) prevRow[j] = j // Initialize first row

  for (let i = 1; i <= lenA; i++) {
    currRow[0] = i // First column initialization (deletion cost)
    let minDistance = Number.MAX_SAFE_INTEGER

    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1 // Substitution cost

      currRow[j] = Math.min(
        currRow[j - 1] + 1, // Insertion
        prevRow[j] + 1, // Deletion
        prevRow[j - 1] + cost, // Substitution
      )

      // Handle transpositions (adjacent swaps like "teh" → "the")
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        currRow[j] = Math.min(currRow[j], prevRow[j - 2] + 1)
      }

      minDistance = Math.min(minDistance, currRow[j])
    }

    if (minDistance > lenB - i)
      break // Early exit if distance is too high
    ;[prevRow, currRow] = [currRow, prevRow] // Swap rows for O(N) space usage
  }

  return prevRow[lenB] // Final edit distance
}

/**
 * Analyzes the user's typing speed and accuracy, including capitalization and punctuation mismatches.
 *
 * @param originalText - The reference text that should have been typed (exact casing and punctuation)
 * @param typedText - The actual text typed by the user
 * @param timeInSeconds - The total time taken to type the text
 * @returns Typing analysis including WPM, accuracy, and error count
 */
export function analyzeTyping(
  originalText: string,
  typedText: string,
  timeInSeconds: number,
): TypingAnalysis {
  const errors = optimizedLevenshtein(originalText, typedText)
  const correctChars = Math.max(0, originalText.length - errors)

  // Dynamic word count calculation
  const words = originalText.split(/\s+/).length
  const avgWordLength = originalText.length / words
  const typedWords = correctChars / avgWordLength

  // Adjusted WPM calculation
  const wpm = Math.max(0, typedWords / (timeInSeconds / 60))

  return {
    accuracy: Math.max(0, (correctChars / originalText.length) * 100), // Accuracy in percentage
    wpm: wpm, // Words per minute
    errors: errors, // Number of character-level errors
  }
}
