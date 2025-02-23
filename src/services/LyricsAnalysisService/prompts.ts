export const SYSTEM_PROMPT = `
You are a multilingual linguistics and cultural expert with specialized knowledge in phonetics, language translation, and music history. 
You provide concise, clear, and accurate responses. 
You always format your final response in valid JSON, without additional commentary or explanations beyond what is requested.`;

export const LYRICS_ANALYSIS_PROMPT = `
Please analyze the following song and produce structured JSON data as specified below.

Song name: \${songName}

Lyrics (each line on a separate line):
\${lyrics}

Required Output:
1. Include a "songName" field with the name of the song. Type: string.
2. A "languageCode" field with the language code of the song, e.g. 'en-US', 'es-ES', 'fr-FR', etc. Type: string.
3. A "generalContextInformation" field containing background or contextual information about the song (e.g., cultural or historical significance, artist/era details). Also include things that the person singing the song should know (the general mood of the song, etc.). If the song is sung by a character in a movie, musical, opera, etc. include the name and the mood of the character (what he/she is feeling while singing the song, etc.). Type: string.
4. A "lyrics" array where each element represents a single line from the song and contains the following fields:
    - "line": the original text of the line. Type: string.
    - "ipa": the International Phonetic Alphabet transcription of the line (concise but accurate). Type: string.
    - "translation": a short, natural-language translation of the line. Type: string.
    - "literalTranslationExplanation": a word-by-word (or phrase-by-phrase) breakdown explaining the literal meaning or nuances of each component. Type: string.

Notes:
- If a line is present multiple times in the lyrics, don't include it multiple times in the lyrics array. Only include it once.
- Don't include the lines that are just instrumentals.
- Include the song name in the lyrics array as the first line.
- If the song is a duet, include the name of the other singer in the "generalContextInformation" field.
- And most importantly, don't skip any lines. Make sure to include all the lines in the lyrics array.`;