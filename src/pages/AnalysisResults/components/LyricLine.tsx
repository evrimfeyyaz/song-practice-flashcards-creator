import { useState, useRef } from 'react';
import { type LyricLine as LyricLineType } from '../../../services/types';
import { PlayButton } from '../../../components/PlayButton';

type LyricLineProps = {
  /** The line analysis data. */
  line: LyricLineType;
  /** The index of this line in the lyrics array. */
  index: number;
  /** Whether the audio is currently loading. */
  isLoading: boolean;
};

/**
 * Displays a single line of lyrics with its analysis.
 */
export function LyricLine({ line, isLoading }: LyricLineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayClick = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 border">
      <div className="font-medium text-lg mb-2">{line.line}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">IPA Pronunciation:</p>
          <div className="flex items-center gap-2">
            <p className="font-mono">{line.ipa}</p>
            <PlayButton
              audioUrl={line.ipaAudioUrl}
              isLoading={isLoading}
              isPlaying={isPlaying}
              onClick={handlePlayClick}
            />
            {line.ipaAudioUrl && (
              <audio
                ref={audioRef}
                src={line.ipaAudioUrl}
                onEnded={handleAudioEnded}
              />
            )}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Translation:</p>
          <p>{line.translation}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-500 mb-1">Literal Meaning:</p>
          <p className="text-gray-700">{line.literalTranslationExplanation}</p>
        </div>
      </div>
    </div>
  );
} 