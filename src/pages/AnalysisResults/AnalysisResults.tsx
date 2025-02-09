import { useSongContext } from '../../context/useSongContext';
import { Button } from '../../components/Button';
import { SongContext } from './components/SongContext';
import { LyricsAnalysis } from './components/LyricsAnalysis';

/**
 * Displays the complete analysis results for a song.
 */
export function AnalysisResults() {
  const { analysisResult } = useSongContext();

  const handleNewSong = () => {
    window.location.reload();
  };

  if (!analysisResult) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{analysisResult.songName}</h1>
      
      <SongContext analysis={analysisResult} />
      <LyricsAnalysis analysis={analysisResult} />

      <div className="mt-8 flex justify-center">
        <Button onClick={handleNewSong}>
          New Song
        </Button>
      </div>
    </div>
  );
} 