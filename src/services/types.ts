import { Deck, Model } from "genanki-js";

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
  /** The URL of the IPA audio file. */
  ipaAudioUrl?: string;
};

/**
 * Represents the complete analysis of a song's lyrics.
 */
export type LyricsAnalysis = {
  /** The name of the song. */
  songName: string;
  /** The language code of the song, e.g. 'en-US', 'es-ES', 'fr-FR', etc. */
  languageCode: string;
  /** Background information about the song including cultural/historical significance. */
  generalContextInformation: string;
  /** Array of analyzed lyrics lines. */
  lyrics: LyricLine[];
};

/**
 * Represents a single Anki card with front and back content.
 */
export type AnkiCard = {
  /** The front (question) side of the card. */
  front: string;
  /** The back (answer) side of the card. */
  back: string;
  /** Tags to categorize the card. */
  tags: string[];
  /** Optional audio attachment for the card. */
  audio?: {
    data: ArrayBuffer;
    filename: string;
  };
};
  
/**
 * Represents a collection of Anki decks for pronunciation and translation.
 */
export type AnkiDecks = {
  /** The pronunciation deck. */
  pronunciation: Deck;
  /** The translation deck. */
  translation: Deck;
};

/**
 * Models used for creating Anki cards.
 */
export type Models = {
  /** The pronunciation model. */
  pronunciation: Model;
  /** The translation model. */
  translation: Model;
}; 
