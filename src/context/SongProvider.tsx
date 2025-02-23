import { ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import { SongContext } from './SongContext';
import { SongData } from './types';
import { LyricsAnalysisService, LyricsAnalysis } from '../services/LyricsAnalysisService';
import { TextToSpeechService } from '../services/TextToSpeechService';
import { AnkiExportService } from '../services/AnkiExportService';
import { OpenAI } from 'openai';
import { Polly } from '@aws-sdk/client-polly';

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

  const ttsRef = useRef<TextToSpeechService | null>(null);

  const analyzeSong = async (songTitle: string, lyrics: string) => {
    setSongData({songTitle, lyrics});
    setIsAnalyzing(true);
    setError(null);
    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });
      const analyzer = new LyricsAnalysisService(openai);
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
    if (!line || line.ipaAudioUrl || !ttsRef.current) return;
    
    setLoadingAudioLines(prev => new Set(prev).add(index));
    
    try {
      const audioContent = await ttsRef.current.synthesizeIPA(line.ipa, analysisResult.languageCode);
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
  }, [analysisResult]);

  const generateAudioForLines = useCallback(async () => {
    if (!analysisResult) return;

    ttsRef.current = new TextToSpeechService(new Polly({
      region: 'us-east-1',
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      },
    }));

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

  const exportToAnki = useCallback(async () => {
    if (!analysisResult) {
      setError('No analysis results to export');
      return;
    }
    
    try {
      await AnkiExportService.exportToAnki(analysisResult);
    } catch (error) {
      console.error('Export failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to export to Anki');
    }
  }, [analysisResult]);

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
        exportToAnki,
      }}
    >
      {children}
    </SongContext.Provider>
  );
} 