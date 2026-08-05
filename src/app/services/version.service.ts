import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VersionService {
  private http = inject(HttpClient);

  async getVersion(): Promise<string> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ version: string }>('/api/version')
      );
      return res.version;
    } catch {
      return 'unknown';
    }
  }
}
