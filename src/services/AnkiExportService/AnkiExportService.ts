import { Deck, Package } from 'genanki-js';
import { AnkiDecks } from './types';
import initSqlJs from 'sql.js';
import wasm from 'sql.js/dist/sql-wasm.wasm?url';
import { generateStableHash } from '../../utils/hash';
import { LyricsAnalysis } from '../LyricsAnalysisService';
import { PRONUNCIATION_MODEL, TRANSLATION_MODEL } from './models';

const SQL_JS = await initSqlJs({
  locateFile: () => wasm,
});

export class AnkiExportService {
  /**
   * Creates and downloads Anki decks from lyrics analysis.
   * @param analysis The complete lyrics analysis data.
   */
  static async exportToAnki(analysis: LyricsAnalysis): Promise<void> {
    const decks = this.createDecks(analysis);
    const pkg = new Package();
    
    pkg.addDeck(decks.pronunciation);
    pkg.addDeck(decks.translation);
    
    await this.processLyrics(analysis, decks, pkg);
    await this.downloadDecks(analysis, pkg);
  }

  /**
   * Creates pronunciation and translation decks for a song.
   * @param analysis The lyrics analysis containing the song name.
   * @returns Object containing both Anki deck instances.
   */
  private static createDecks(analysis: LyricsAnalysis): AnkiDecks {
    // Generate stable deck IDs based on song content
    const lyricsText = analysis.lyrics.map(line => line.line).join('\n');
    const pronunciationDeckId = generateStableHash(lyricsText, 1); // Seed 1 for pronunciation
    const translationDeckId = generateStableHash(lyricsText, 2); // Seed 2 for translation

    return {
      pronunciation: new Deck(
        pronunciationDeckId,
        `${analysis.songName} - Pronunciation`
      ),
      translation: new Deck(
        translationDeckId,
        `${analysis.songName} - Translation`
      )
    };
  }

  /**
   * Processes each line of lyrics to create and add cards to the decks.
   * @param analysis The complete lyrics analysis.
   * @param decks The pronunciation and translation deck instances.
   * @param pkg The package to add media files to.
   * @param models The models for creating pronunciation and translation cards.
   */
  private static async processLyrics(
    analysis: LyricsAnalysis, 
    decks: AnkiDecks,
    pkg: Package,
  ) {
    for (const [index, line] of analysis.lyrics.entries()) {
      if (!line.line.trim()) continue;

      const audioData = await this.fetchAudioData(line.ipaAudioUrl);
      const audioFilename = `line_${index}.mp3`;
      
      if (audioData) {
        pkg.addMedia(audioData, audioFilename);
      }

      const pronunciationNote = this.createPronunciationNote(
        line,
        index,
        audioFilename,
        audioData
      );
      decks.pronunciation.addNote(pronunciationNote);

      const translationNote = this.createTranslationNote(
        line,
        index
      );
      decks.translation.addNote(translationNote);
    }
  }

  /**
   * Creates a pronunciation note for Anki.
   * @param line The lyrics line containing the original text and IPA.
   * @param model The pronunciation model to create the note from.
   * @param index The index of the line in the lyrics.
   * @param audioFilename The filename of the associated audio file.
   * @param audioData The audio data buffer, if available.
   * @returns The created Anki note.
   */
  private static createPronunciationNote(
    line: LyricsAnalysis['lyrics'][number],
    index: number,
    audioFilename: string,
    audioData: ArrayBuffer | undefined
  ) {
    return PRONUNCIATION_MODEL.note(
      [
        line.line,
        line.ipa,
        audioData ? `[sound:${audioFilename}]` : ''
      ],
      [], // Empty tags array
      generateStableHash(`pronunciation_${line.line}`, index).toString() // Stable GUID
    );
  }

  /**
   * Creates a translation note for Anki.
   * @param line The lyrics line containing the original text and translations.
   * @param model The translation model to create the note from.
   * @param index The index of the line in the lyrics.
   * @returns The created Anki note.
   */
  private static createTranslationNote(
    line: LyricsAnalysis['lyrics'][number],
    index: number
  ) {
    return TRANSLATION_MODEL.note(
      [
        line.line,
        line.translation,
        line.literalTranslationExplanation
      ],
      [], // Empty tags array
      generateStableHash(`translation_${line.line}`, index).toString() // Stable GUID
    );
  }

  /**
   * Fetches audio data from a URL.
   * @param audioUrl The URL of the audio file.
   * @returns The audio data as ArrayBuffer or undefined if fetch fails.
   */
  private static async fetchAudioData(audioUrl?: string): Promise<ArrayBuffer | undefined> {
    if (!audioUrl) return undefined;
    
    try {
      const response = await fetch(audioUrl);
      return await response.arrayBuffer();
    } catch (error) {
      console.error('Failed to fetch audio:', error);
      return undefined;
    }
  }

  /**
   * Saves and downloads the package containing both decks.
   * @param analysis The lyrics analysis containing the song name.
   * @param pkg The package containing both decks and media.
   * @throws Error if SQL.js is not initialized or package generation fails.
   */
  private static async downloadDecks(
    analysis: LyricsAnalysis,
    pkg: Package
  ) {
    if (!SQL_JS) {
      throw new Error('SQL.js not initialized.');
    }

    pkg.setSqlJs(new SQL_JS.Database());

    try {
      pkg.writeToFile(`${analysis.songName.replace(/\s+/g, '_')}.apkg`);
    } catch (error) {
      throw new Error(`Failed to generate Anki package: ${error}`);
    }
  }
}