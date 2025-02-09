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
  /** 
   * Updates the song details.
   * @param title - The title of the song.
   * @param lyrics - The lyrics of the song.
   */
  updateSongData: (title: string, lyrics: string) => void;
  /** 
   * Advances to the next step in the workflow.
   */
  goToNextStep: () => void;
}