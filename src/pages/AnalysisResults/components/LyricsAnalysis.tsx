import { type LyricsAnalysis as LyricsAnalysisType } from '../../../services/types';
import { LyricLine } from './LyricLine';

type LyricsAnalysisProps = {
  /** The song analysis data. */
  analysis: LyricsAnalysisType;
};

/**
 * Displays the analysis of all lyrics lines.
 */
export function LyricsAnalysis({ analysis }: LyricsAnalysisProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Lyrics Analysis</h2>
      <div className="space-y-6">
        {analysis.lyrics.map((line, index) => (
          <LyricLine key={index} line={line} />
        ))}
      </div>
    </section>
  );
} 