/** 
 * Represents the basic data structure for a song.
 */
export type SongData = {
  /** The title of the song. */
  songTitle: string;
  /** The lyrics/text content of the song. */
  lyrics: string;
};

/** Interface for managing song-related state throughout the application. */
export interface SongContextType {
  /** The song data containing song information. */
  songData: SongData;
  /** Current step in the song analysis workflow. */
  currentStep: number;
  /** Analysis result of the song. */
  analysisResult: any | null;
  /** Whether analysis is currently in progress. */
  isAnalyzing: boolean;
  /** 
   * Analyzes the current song data.
   */
  analyzeSong: (songTitle: string, lyrics: string) => Promise<void>;
  /** 
   * Advances to the next step in the workflow.
   */
  goToNextStep: () => void;
}