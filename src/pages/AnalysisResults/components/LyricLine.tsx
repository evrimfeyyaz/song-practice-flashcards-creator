import { type LyricLine as LyricLineType } from '../../../services/types';

type LyricLineProps = {
  /** The line analysis data. */
  line: LyricLineType;
};

/**
 * Displays a single line of lyrics with its analysis.
 */
export function LyricLine({ line }: LyricLineProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 border">
      <div className="font-medium text-lg mb-2">{line.line}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">IPA Pronunciation:</p>
          <p className="font-mono">{line.ipa}</p>
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