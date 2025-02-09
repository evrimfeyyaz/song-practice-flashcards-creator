import { useContext } from 'react';
import { SongContext } from './SongContext';
import { SongContextType } from './types';

/**
 * Custom hook to access the SongContext.
 * @throws {Error} If used outside of a SongProvider.
 */
export function useSongContext(): SongContextType {
  const context = useContext(SongContext);
  if (context === undefined) {
    throw new Error('useSongContext must be used within a SongProvider');
  }
  return context;
} 