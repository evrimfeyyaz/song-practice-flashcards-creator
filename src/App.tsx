import { useState } from 'react';

function App() {
  const [songName, setSongName] = useState('');
  const [lyrics, setLyrics] = useState('');

  const handleAnalyze = () => {
    // TODO: Add analysis logic
    console.log('Analyzing lyrics for:', songName);
  };

  return (
    <div className="flex flex-col items-center p-8 gap-6">
      <div className="w-full max-w-lg">
        <input
          type="text"
          placeholder="Enter song name"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="w-full max-w-lg">
        <textarea
          placeholder="Enter song lyrics"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          rows={10}
          cols={50}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>
      <button
        onClick={handleAnalyze}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Analyze Lyrics
      </button>
    </div>
  );
}

export default App;
