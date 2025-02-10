type PlayButtonProps = {
  /** URL of the audio to play. */
  audioUrl?: string;
  /** Whether the audio is currently being generated. */
  isLoading?: boolean;
  /** Whether the audio is currently playing. */
  isPlaying?: boolean;
  /** Callback when the play/pause button is clicked. */
  onClick: () => void;
};

/**
 * A button that shows either a loading spinner, play icon, or pause icon.
 */
export function PlayButton({ audioUrl, isLoading, isPlaying, onClick }: PlayButtonProps) {
  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
    );
  }

  if (!audioUrl) return null;

  return (
    <button
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
    >
      {isPlaying ? (
        <span className="block w-3 h-3 border-l-2 border-r-2 border-white" />
      ) : (
        <span className="block w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-white ml-1" />
      )}
    </button>
  );
} 