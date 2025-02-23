# Song Practice Flashcards Creator

A web application that helps you practice and learn songs by analyzing lyrics, providing text-to-speech pronunciation and creating Anki flashcards.

## Features

- Analyzes song lyrics for meaning and context.
- Generates text-to-speech audio for pronunciation practice.
- Creates Anki flashcards from the analysis.

## Screenshots

![Analysis page showing lyrics analysis and Anki export](./screenshots/analysis.jpg)
![Pronunciation deck practice in Anki](./screenshots/pronunciation-deck.jpg)
![Translation deck practice in Anki](./screenshots/translation-deck.jpg)

## Setup

1. Clone the repository.

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory with the following variables:
```bash
VITE_OPENAI_API_KEY=your_openai_api_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
```

The OpenAI key uses GPT-4o to analyze the lyrics for translations, IPA representations, and context. And the AWS credentials are used to generate the text-to-speech audio through Polly.

## Running the application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.