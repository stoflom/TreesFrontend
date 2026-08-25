import { Service, inject } from '@angular/core';
import { MessageService } from './message.service';
import { SearchParams } from '../interfaces/search-params';

//This should use the database or be stored statically here,
// but for now we will use localStorage which allows the user the choice
// of persistence across sessions.

@Service()
export class PersistService {

  private messageService = inject(MessageService);

  private storageKey = 'SearchParams';
  private localData: SearchParams | null = null;

  public retrieve(): SearchParams | null {
    if (this.localData !== null) {
      return this.localData;
    }
    try {
      const item = localStorage.getItem(this.storageKey);
      if (item) {
        const parsed: unknown = JSON.parse(item);
        if (this.isValidSearchParams(parsed)) {
          this.localData = parsed;
          return this.localData;
        }
      }
    } catch {
      // localStorage failed
      this.log('Warning: Unable to retrieve data from localStorage.');
    }
    return null;
  }

  public persist(searchparams: SearchParams) {
    this.localData = searchparams;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(searchparams));
    } catch {
      // localStorage failed, but continue
      this.log('Warning: Unable to persist data to localStorage.');
    }

  }

  /** Structural check of data loaded from localStorage (untrusted input). */
  private isValidSearchParams(value: unknown): value is SearchParams {
    if (typeof value !== 'object' || value === null) {
      return false;
    }
    const obj = value as Record<string, unknown>;
    return SEARCH_PARAM_KEYS.every((key) => typeof obj[key] === 'string');
  }

  /** Log a message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PersistService: ${message}`);
  }
}

/** Keys required for a SearchParams object to be considered valid. */
const SEARCH_PARAM_KEYS: readonly (keyof SearchParams)[] = [
  'language', 'searchterm', 'group', 'genus', 'family',
];
