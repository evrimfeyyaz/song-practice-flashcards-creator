import { Model } from 'genanki-js';

// If you change the models, update the IDs below by incrementing the version number.
export const PRONUNCIATION_MODEL_ID = '1740052059953';
export const TRANSLATION_MODEL_ID = '1740052059954';

/**
 * Pronunciation model for Anki cards.
 */
export const PRONUNCIATION_MODEL = new Model({
  name: 'Song Pronunciation Model',
  id: PRONUNCIATION_MODEL_ID,
  flds: [
    { name: 'Original' },
    { name: 'IPA' },
    { name: 'Audio' }
  ],
  tmpls: [{
    name: 'Pronunciation Card',
    qfmt: '{{Original}}',
    afmt: '{{FrontSide}}<hr id="answer">IPA: {{IPA}}<br><br>{{Audio}}'
  }],
  req: [[0, "all", [0]]]
});

/**
 * Translation model for Anki cards.
 */
export const TRANSLATION_MODEL = new Model({
  name: 'Song Translation Model',
  id: TRANSLATION_MODEL_ID,
  flds: [
    { name: 'Original' },
    { name: 'Translation' },
    { name: 'LiteralMeaning' }
  ],
  tmpls: [{
    name: 'Translation Card',
    qfmt: '{{Original}}',
    afmt: '{{FrontSide}}<hr id="answer">Translation: {{Translation}}<br><br>Literal Meaning: {{LiteralMeaning}}'
  }],
  req: [[0, "all", [0]]]
}); 