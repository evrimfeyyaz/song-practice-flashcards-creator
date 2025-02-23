import OpenAI from 'openai';
import { LyricsAnalysis } from './types';
import { LYRICS_ANALYSIS_PROMPT, SYSTEM_PROMPT } from './prompts';

/**
 * Service for analyzing song lyrics using OpenAI API.
 */
export class LyricsAnalysisService {
  /**
   * Creates a new LyricsAnalysisService instance.
   * @param openai - OpenAI client instance.
   */
  constructor(private readonly openai: OpenAI) {}

  /**
   * Generates the user prompt for the OpenAI API.
   * @param songName - Name of the song.
   * @param lyrics - Lyrics to analyze.
   * @returns Formatted user prompt.
   */
  private generateUserPrompt(songName: string, lyrics: string): string {
    return LYRICS_ANALYSIS_PROMPT
      .replace('${songName}', songName)
      .replace('${lyrics}', lyrics);
  }

  /**
   * Analyzes the given song lyrics.
   * @param songName - Name of the song.
   * @param lyrics - Lyrics to analyze.
   * @returns Analysis of the lyrics.
   */
  public async analyzeLyrics(songName: string, lyrics: string): Promise<LyricsAnalysis> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: this.generateUserPrompt(songName, lyrics) }
        ],
        temperature: 0,
        response_format: { type: 'json_object' }
      });

      const result = response.choices[0].message.content;
      if (!result) {
        throw new Error('No response from OpenAI API.');
      }

      return JSON.parse(result) as LyricsAnalysis;
    } catch (error) {
      console.error('Error analyzing lyrics:', error);
      throw new Error('Failed to analyze lyrics.');
    }
  }
}
