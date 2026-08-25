/**
 * Persisted search parameters (search-editor page), stored in localStorage
 * via PersistService so the user's last search terms survive across sessions.
 */
export interface SearchParams {
  language: string;
  searchterm: string;
  group: string;
  genus: string;
  family: string;
}
