/**
 * Represents a single line of lyrics with its analysis.
 */
export type LyricLine = {
  /** The original text of the line. */
  line: string;
  /** The International Phonetic Alphabet transcription of the line. */
  ipa: string;
  /** A natural language translation of the line. */
  translation: string;
  /** A word-by-word or phrase-by-phrase breakdown explaining the literal meaning. */
  literalTranslationExplanation: string;
};

/**
 * Represents the complete analysis of a song's lyrics.
 */
export type LyricsAnalysis = {
  /** The name of the song with translation in parentheses. */
  songName: string;
  /** Background information about the song including cultural/historical significance. */
  generalContextInformation: string;
  /** Array of analyzed lyrics lines. */
  lyrics: LyricLine[];
}; 