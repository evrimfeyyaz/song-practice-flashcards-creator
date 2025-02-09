import { ReactNode, useState } from 'react';
import { SongContext } from './SongContext';
import { SongData } from './types';
import LyricsAnalyzer from '../services/LyricsAnalyzer';

/**
 * Provider component for song-related state management.
 */
export function SongProvider({ children }: { children: ReactNode }) {
  const [songData, setSongData] = useState<SongData>({
    songTitle: '',
    lyrics: ''
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeSong = async (songTitle: string, lyrics: string) => {
    setSongData({songTitle, lyrics});
    setIsAnalyzing(true);
    try {
      const analyzer = new LyricsAnalyzer(import.meta.env.VITE_OPENAI_API_KEY);
      const result = await analyzer.analyzeLyrics(songTitle, lyrics);
      setAnalysisResult(result);
      goToNextStep();
    } catch (error) {
      console.error('Analysis failed:', error);
      // TODO: Add error handling here.
    } finally {
      setIsAnalyzing(false);
    }
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
        analysisResult,
        isAnalyzing,
        analyzeSong,
        goToNextStep,
      }}
    >
      {children}
    </SongContext.Provider>
  );
} 