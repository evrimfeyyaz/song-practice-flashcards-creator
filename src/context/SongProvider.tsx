import { ReactNode, useState } from 'react';
import { SongContext } from './SongContext';
import { SongData } from './types';

/**
 * Provider component for song-related state management.
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The child components.
 * @returns {JSX.Element} The provider component.
 */
export function SongProvider({ children }: { children: ReactNode }) {
  const [songData, setSongData] = useState<SongData>({
    songTitle: '',
    lyrics: ''
  });
  const [currentStep, setCurrentStep] = useState(0);

  /**
   * Update the song title and lyrics.
   * @param {string} title - The title of the song.
   * @param {string} lyrics - The lyrics of the song.
   */
  const updateSongData = (title: string, lyrics: string) => {
    setSongData({ songTitle: title, lyrics });
  };

  /**
   * Increment the current step.
   */
  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  return (
    <SongContext.Provider
      value={{
        songData,
        currentStep,
        updateSongData,
        goToNextStep,
      }}
    >
      {children}
    </SongContext.Provider>
  );
} 