import OpenAI from 'openai';

type LyricLine = {
  line: string;
  ipa: string;
  translation: string;
  literalTranslationExplanation: string;
};

type LyricsAnalysis = {
  songName: string;
  generalContextInformation: string;
  lyrics: LyricLine[];
};

/**
 * Service for analyzing song lyrics using OpenAI API.
 */
class LyricsAnalyzer {
  private openai: OpenAI;
  private readonly systemPrompt = `
You are a multilingual linguistics and cultural expert with specialized knowledge in phonetics, language translation, and music history. 
You provide concise, clear, and accurate responses. 
You always format your final response in valid JSON, without additional commentary or explanations beyond what is requested.`;

  /**
   * Creates a new LyricsAnalyzer instance.
   * @param apiKey - OpenAI API key.
   */
  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  /**
   * Generates the user prompt for the OpenAI API.
   * @param songName - Name of the song.
   * @param lyrics - Lyrics to analyze.
   * @returns Formatted user prompt.
   */
  private generateUserPrompt(songName: string, lyrics: string): string {
    return `
Please analyze the following song and produce structured JSON data as specified below.

Song name: ${songName}

Lyrics (each line on a separate line):
${lyrics}

Required Output:
1. Include a "songName" field with the name of the song.
2. A "generalContextInformation" field containing concise background or contextual information about the song (e.g., cultural or historical significance, artist/era details).
3. A "lyrics" array where each element represents a single line from the song and contains the following fields:
    - "line": the original text of the line.
    - "ipa": the International Phonetic Alphabet transcription of the line (concise but accurate).
    - "translation": a short, natural-language translation of the line.
    - "literalTranslationExplanation": a word-by-word (or phrase-by-phrase) breakdown explaining the literal meaning or nuances of each component.`;
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
        model: 'gpt-4',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: this.generateUserPrompt(songName, lyrics) }
        ],
        temperature: 0.2
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

export default LyricsAnalyzer; 