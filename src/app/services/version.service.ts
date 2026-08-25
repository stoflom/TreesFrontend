import { Service, ResourceRef, inject, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Service()
export class VersionService {
  private http = inject(HttpClient);

  /**
   * Backend application version, fetched once via the (v22-stable) resource API.
   * `defaultValue` covers the loading state; the loader falls back to
   * 'unknown' when the backend is unreachable.
   */
  version: ResourceRef<string> = resource({
    defaultValue: '',
    loader: async () => {
      try {
        const res = await firstValueFrom(
          this.http.get<{ version: string }>('/api/version')
        );
        return res.version;
      } catch {
        return 'unknown';
      }
    },
  });
}
