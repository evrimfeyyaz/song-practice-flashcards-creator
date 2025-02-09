import { useSongContext } from '../context/useSongContext';

export function TestResults() {
  const { analysisResult } = useSongContext();

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Analysis Results</h2>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
        {JSON.stringify(analysisResult, null, 2)}
      </pre>
    </div>
  );
} 