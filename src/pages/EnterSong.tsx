import { useState } from 'react';
import { TextInput } from '../components/TextInput';
import { TextArea } from '../components/TextArea';
import { Button } from '../components/Button';
import { useSongContext } from '../context/useSongContext';

/**
 * Component for entering song title and lyrics.
 */
export function EnterSong() {
  const { updateSongData, goToNextStep } = useSongContext();
  
  const [songTitle, setSongTitle] = useState('');
  const [lyrics, setLyrics] = useState('');

  const isAnalyzeDisabled = !songTitle.trim() || !lyrics.trim();

  const handleAnalyze = () => {
    if (songTitle && lyrics) {
      updateSongData(songTitle, lyrics);
      goToNextStep();
    }
  };

  return (
    <div className="flex flex-col items-center p-8 gap-6">
      <div className="w-full max-w-lg">
        <TextInput
          placeholder="Enter song title"
          value={songTitle}
          onChange={(e) => setSongTitle(e.target.value)}
        />
      </div>
      <div className="w-full max-w-lg">
        <TextArea
          placeholder="Enter song lyrics"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          rows={10}
        />
      </div>
      <Button
        onClick={handleAnalyze}
        disabled={isAnalyzeDisabled}
      >
        Analyze Lyrics
      </Button>
    </div>
  );
} 