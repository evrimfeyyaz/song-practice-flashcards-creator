import { useSongContext } from '../../context/useSongContext';
import { Button } from '../../components/Button';
import { SongContext } from './components/SongContext';
import { LyricsAnalysis } from './components/LyricsAnalysis';
import { useState } from 'react';

/**
 * Displays the complete analysis results for a song.
 */
export function AnalysisResults() {
  const { analysisResult, exportToAnki } = useSongContext();
  const [isExporting, setIsExporting] = useState(false);

  const handleNewSong = () => {
    window.location.reload();
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToAnki();
    } finally {
      setIsExporting(false);
    }
  };

  if (!analysisResult) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{analysisResult.songName}</h1>
      
      <SongContext analysis={analysisResult} />
      <LyricsAnalysis analysis={analysisResult} />

      <div className="mt-8 flex justify-center gap-4">
        <Button onClick={handleNewSong} title="New Song" />
        <Button onClick={handleExport} isLoading={isExporting} title={isExporting ? 'Exporting...' : 'Export to Anki'} />
      </div>
    </div>
  );
} 