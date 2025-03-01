import { Polly, VoiceId, LanguageCode } from '@aws-sdk/client-polly';

/**
 * Service for synthesizing speech from text using Amazon Polly.
 */
export class TextToSpeechService {
  private voiceCache: Map<string, string> = new Map();

  /**
   * Creates a new TextToSpeechService instance.
   * @param client - The AWS Polly client to use for speech synthesis.
   */
  constructor(private client: Polly) {}

  /**
   * Synthesizes speech from IPA text.
   * @param ipa - The IPA text to synthesize.
   * @param languageCode - The language code to use for the synthesis, e.g. 'en-US', 'es-ES', 'fr-FR', etc.
   * @returns A promise that resolves to the synthesized audio as a Uint8Array.
   */
  async synthesizeIPA(ipa: string, languageCode: string): Promise<Uint8Array> {
    const voiceId = await this.getVoiceIdForLanguage(languageCode);
    const ssml = `<speak><prosody rate="x-slow"><phoneme alphabet="ipa" ph="${ipa}"></phoneme></prosody></speak>`;
    
    const response = await this.client.synthesizeSpeech({
      Text: ssml,
      TextType: 'ssml',
      OutputFormat: 'mp3',
      VoiceId: voiceId as VoiceId,
      Engine: 'neural'
    });

    if (!response.AudioStream) {
      throw new Error('No audio stream returned from Polly.');
    }

    return await response.AudioStream.transformToByteArray();
  }

  /**
   * Gets the first available neural voice for the given language code.
   * @param languageCode - The language code to get a voice for.
   * @returns A promise that resolves to a Polly voice ID.
   */
  private async getVoiceIdForLanguage(languageCode: string): Promise<string> {
    // Check cache first
    const cachedVoiceId = this.voiceCache.get(languageCode);
    if (cachedVoiceId) {
      return cachedVoiceId;
    }

    const response = await this.client.describeVoices({
      LanguageCode: languageCode as LanguageCode,
      Engine: 'neural'
    });

    if (!response.Voices?.length) {
      throw new Error(`No voices found for language code: ${languageCode}`);
    }

    // Get the first available neural voice
    const voiceId = response.Voices[0].Id;
    if (!voiceId) {
      throw new Error(`No voice ID found for language code: ${languageCode}`);
    }

    // Cache the result
    this.voiceCache.set(languageCode, voiceId);
    return voiceId;
  }
}
