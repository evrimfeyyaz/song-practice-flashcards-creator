declare module 'genanki-js' {
  import { Database } from "sql.js";

  /**
   * Represents a field in an Anki note model.
   */
  export interface Field {
    /** Name of the field. */
    name: string;
    /** Order of the field. */
    ord?: number;
  }

  /**
   * Represents a template for rendering cards from notes.
   */
  export interface Template {
    /** Name of the template. */
    name: string;
    /** Order of the template. */
    ord?: number;
    /** Question format template string. */
    qfmt: string;
    /** Answer format template string. */
    afmt: string;
  }

  /**
   * Represents a card generation requirement.
   * [templateIndex, "all"|"any", fieldIndices].
   * Cards are only generated when specified fields are non-empty.
   */
  export type Requirement = [number, "all" | "any", number[]];

  /**
   * Configuration options for creating an Anki note model.
   */
  export interface ModelOptions {
    /** 
     * Stable, unique identifier for the model. Should be generated once with +new Date 
     * and hard-coded to preserve study history on re-import.
     */
    id: string;
    /** Name of the model that appears in Anki's Add UI. */
    name: string;
    /** Array of fields that define the structure of notes using this model. */
    flds: Field[];
    /** Array of templates that define how cards are rendered from notes. */
    tmpls: Template[];
    /** Requirements for card generation. */
    req: Requirement[];
  }

  /**
   * Class for creating and managing Anki note models.
   */
  export class Model {
    /** Creates a new Model instance. */
    constructor(props: ModelOptions);

    /**
     * Creates a note with the given fields.
     * @param fieldValues - Array of field values in order, or object mapping field names to values.
     * @param tags - Optional array of tags to be joined with spaces.
     * @param guid - Optional stable identifier for the note. Defaults to hash of field values.
     */
    note(
      fieldValues: string[] | Record<string, string>,
      tags?: string[] | null,
      guid?: string
    ): Note;
  }

  /**
   * Configuration options for creating a cloze model.
   */
  export interface ClozeModelOptions {
    /** 
     * Stable, unique identifier for the model. Should be generated once with +new Date 
     * and hard-coded to preserve study history on re-import.
     */
    id: string;
    /** Name of the model that appears in Anki's Add UI. */
    name: string;
    /** Array of fields that define the structure of notes using this model. */
    flds: Field[];
    /** 
     * Template for rendering cloze cards. 
     * name defaults to "Cloze" if not specified.
     */
    tmpl: Template;
  }

  /**
   * Class for creating cloze deletion models.
   */
  export class ClozeModel extends Model {
    /** Creates a new ClozeModel instance. */
    constructor(props: Omit<ModelOptions, 'type' | 'tmpls'> & { tmpl?: Partial<Template> });
  }

  /**
   * Class for creating and managing Anki decks.
   * In mkanki, decks are collections of notes (not cards, as in Anki proper).
   */
  export class Deck {
    /** 
     * Creates a new Deck instance.
     * @param id - Stable, unique identifier for the deck. Should be generated once with +new Date 
     * and hard-coded to preserve study history on re-import.
     * @param name - Name of the deck. Anki will create new decks with the specified names.
     */
    constructor(id: number, name: string);

    /**
     * Adds a note to the deck.
     * Note: A single note in Anki can technically generate cards belonging to multiple decks,
     * but mkanki does not support that.
     * @param note - Note created using model.note().
     */
    addNote(note: Note): void;
  }

  /**
   * Class for creating and exporting Anki packages (.apkg files).
   */
  export class Package {
    /** Creates a new empty package. */
    constructor();

    /**
     * Adds a deck to this package.
     * @param deck - The deck to add.
     */
    addDeck(deck: Deck): void;

    /**
     * Adds a media file to this package.
     * @param data - The contents of the media file.
     * @param name - The name of the file in the package.
     */
    addMedia(data: string | Buffer | ArrayBuffer, name: string): void;

    /**
     * Adds a media file from the filesystem to this package.
     * @param filename - Path to the file.
     * @param name - The name of the file in the package. Defaults to filename.
     */
    addMediaFile(filename: string, name?: string): void;

    /**
     * Serializes the package to a file.
     * @param filename - Path to the exported package. Conventionally ends in ".apkg".
     */
    writeToFile(filename: string): void;

    /**
     * Sets the SQL.js database for the package.
     * @param db - The SQL.js database to set.
     */
    setSqlJs(db: Database): void;
  }
} 