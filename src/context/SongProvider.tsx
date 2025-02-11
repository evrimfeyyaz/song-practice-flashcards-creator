import { ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import { SongContext } from './SongContext';
import { SongData } from './types';
import LyricsAnalysisService from '../services/LyricsAnalysisService';
import TextToSpeechService from '../services/TextToSpeechService';
import { LyricsAnalysis } from '../services/types';

/**
 * Provider component for song-related state management.
 */
export function SongProvider({ children }: { children: ReactNode }) {
  const [songData, setSongData] = useState<SongData>({
    songTitle: '',
    lyrics: ''
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<LyricsAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingAudioLines, setLoadingAudioLines] = useState<Set<number>>(new Set());
  const hasAudioGenerationRunRef = useRef(false);

  const tts = useRef<TextToSpeechService | null>(new TextToSpeechService()).current;

  const analyzeSong = async (songTitle: string, lyrics: string) => {
    setSongData({songTitle, lyrics});
    setIsAnalyzing(true);
    setError(null);
    try {
      const analyzer = new LyricsAnalysisService(import.meta.env.VITE_OPENAI_API_KEY);
      const result = await analyzer.analyzeLyrics(songTitle, lyrics);
      setAnalysisResult(result);
      goToNextStep();
    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Generates audio for a single lyric line.
   */
  const generateAudioForLine = useCallback(async (
    index: number,
  ): Promise<void> => {
    if (!analysisResult) return;

    const line = analysisResult.lyrics[index];
    if (!line || line.ipaAudioUrl || !tts) return;
    
    setLoadingAudioLines(prev => new Set(prev).add(index));
    
    try {
      const audioContent = await tts.synthesizeIPA(line.ipa, analysisResult.languageCode);
      const blob = new Blob([audioContent], { type: 'audio/mp3' });
      const ipaAudioUrl = URL.createObjectURL(blob);
      
      setAnalysisResult(prev => {
        if (!prev) return prev;
        const newLyrics = [...prev.lyrics];
        newLyrics[index] = { ...line, ipaAudioUrl };
        return { ...prev, lyrics: newLyrics };
      });
    } catch (error) {
      console.error('Failed to generate audio:', error);
    } finally {
      setLoadingAudioLines(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  }, [analysisResult, tts]);

  const generateAudioForLines = useCallback(async () => {
    if (!analysisResult) return;

    for (let i = 0; i < analysisResult.lyrics.length; i++) {
      await generateAudioForLine(i);
    }
  }, [analysisResult, generateAudioForLine]);

  useEffect(() => {
    if (analysisResult && !hasAudioGenerationRunRef.current) {
      hasAudioGenerationRunRef.current = true;
      generateAudioForLines();
    }
  }, [analysisResult, generateAudioForLines]);

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
        error,
        analyzeSong,
        goToNextStep,
        loadingAudioLines,
        generateAudioForLine,
      }}
    >
      {children}
    </SongContext.Provider>
  );
} 