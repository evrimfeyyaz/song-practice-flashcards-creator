import { Deck, Model } from "genanki-js";

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
