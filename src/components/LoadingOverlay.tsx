type LoadingOverlayProps = {
  /** The message to display while loading. */
  message: string;
};

/**
 * A full-screen loading overlay with animation.
 */
export function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-xl text-blue-500 font-medium">{message}</p>
    </div>
  );
} 