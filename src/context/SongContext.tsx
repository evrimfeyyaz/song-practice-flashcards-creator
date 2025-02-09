import { createContext } from 'react';
import { SongContextType } from './types';

/** Context for managing song-related state throughout the application. */
export const SongContext = createContext<SongContextType | undefined>(undefined);