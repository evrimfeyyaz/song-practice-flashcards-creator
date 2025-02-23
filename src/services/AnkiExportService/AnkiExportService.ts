import { Deck, Model, Package } from 'genanki-js';
import { AnkiDecks, Models } from './types';
import initSqlJs from 'sql.js';
import wasm from 'sql.js/dist/sql-wasm.wasm?url';
import { generateStableHash } from '../../utils/hash';
import { LyricsAnalysis } from '../LyricsAnalysisService';

const SQL_JS = await initSqlJs({
  locateFile: () => wasm,
});

// If you change the models, update the IDs below by incrementing the version number.
const PRONUNCIATION_MODEL_ID = '1740052059953';
const TRANSLATION_MODEL_ID = '1740052059954';

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
    
    await this.processLyrics(analysis, decks, pkg, {
      pronunciation: new Model({
        name: 'Song Pronunciation Model',
        id: PRONUNCIATION_MODEL_ID,
        flds: [
          { name: 'Original' },
          { name: 'IPA' },
          { name: 'Audio' }
        ],
        tmpls: [{
          name: 'Pronunciation Card',
          qfmt: '{{Original}}',
          afmt: '{{FrontSide}}<hr id="answer">IPA: {{IPA}}<br><br>{{Audio}}'
        }],
        req: [[0, "all", [0]]]
      }),
      translation: new Model({
        name: 'Song Translation Model',
        id: TRANSLATION_MODEL_ID,
        flds: [
          { name: 'Original' },
          { name: 'Translation' },
          { name: 'LiteralMeaning' }
        ],
        tmpls: [{
          name: 'Translation Card',
          qfmt: '{{Original}}',
          afmt: '{{FrontSide}}<hr id="answer">Translation: {{Translation}}<br><br>Literal Meaning: {{LiteralMeaning}}'
        }],
        req: [[0, "all", [0]]]
      })
    });
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
    models: Models
  ) {
    for (const [index, line] of analysis.lyrics.entries()) {
      if (!line.line.trim()) continue;

      const audioData = await this.fetchAudioData(line.ipaAudioUrl);
      const audioFilename = `line_${index}.mp3`;
      
      if (audioData) {
        pkg.addMedia(audioData, audioFilename);
      }

      // Create notes with proper field arrays
      const pronunciationNote = models.pronunciation.note(
        [
          line.line,
          line.ipa,
          audioData ? `[sound:${audioFilename}]` : ''
        ],
        [], // Empty tags array
        generateStableHash(`pronunciation_${line.line}`, index).toString() // Stable GUID
      );
      decks.pronunciation.addNote(pronunciationNote);

      const translationNote = models.translation.note(
        [
          line.line,
          line.translation,
          line.literalTranslationExplanation
        ],
        [], // Empty tags array
        generateStableHash(`translation_${line.line}`, index).toString() // Stable GUID
      );
      decks.translation.addNote(translationNote);
    }
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
      throw new Error('Dependencies not initialized. Call initializeAnkiDependencies() first.');
    }

    pkg.setSqlJs(new SQL_JS.Database());

    try {
      await pkg.writeToFile(`${analysis.songName.replace(/\s+/g, '_')}.apkg`);
      console.log('Anki package generated successfully');
    } catch (error) {
      throw new Error(`Failed to generate Anki package: ${error}`);
    }
  }
}