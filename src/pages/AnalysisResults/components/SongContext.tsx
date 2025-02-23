import { type LyricsAnalysis } from '../../../services/LyricsAnalysisService';

type SongContextProps = {
  /** The song analysis data. */
  analysis: LyricsAnalysis;
};

/**
 * Displays the song's context and background information.
 */
export function SongContext({ analysis }: SongContextProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-3">Context & Background</h2>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-gray-700 whitespace-pre-wrap">
          {analysis.generalContextInformation}
        </p>
      </div>
    </section>
  );
} 