import { Service, effect, inject } from '@angular/core';
import { HttpResourceRef, httpResource } from '@angular/common/http';
import { MessageService } from './message.service';

@Service()
export class TreehttpService {
  private messageService = inject(MessageService);

  // Same-origin base path: the Deno backend serves this build under /api in
  // production, and `ng serve` proxies /api to the backend (see proxy.json,
  // wired up via "proxyConfig" in angular.json).
  private SATreesUrl = '/api';

  /**
   * Fetch a backend path into a signal-backed resource.
   *
   * The path function is re-evaluated whenever signals it reads change;
   * returning undefined puts the resource in idle state (no request),
   * mirroring the old empty-observable behavior for blank query terms.
   *
   * Must be called in an injection context (e.g. a component field initializer).
   */
  query<T>(path: () => string | undefined, defaultValue: T): HttpResourceRef<T> {
    const resource = httpResource<T>(path, { defaultValue });

    effect(() => {
      const url = path();
      const status = resource.status();
      if (!url || status === 'idle' || status === 'loading' || status === 'reloading') {
        return;
      }
      if (status === 'error') {
        const err = resource.error() as { message?: string } | null;
        this.log(`GET ${url} failed: ${err?.message ?? String(err)}`);
        return;
      }
      const value = resource.value();
      if (Array.isArray(value)) {
        this.log(
          value.length
            ? `Found ${value.length} at GET ${url}`
            : `No results at GET ${url}`
        );
      } else {
        this.log(value ? `Fetched from GET ${url}` : `Did not find at GET ${url}`);
      }
    });

    return resource;
  }

  /** Escape '?' so it can be embedded in a backend regex path segment */
  encode(term: string): string {
    return term.replace(/\?/g, '%3F');
  }

  idUrl(treeId: string): string {
    return `${this.SATreesUrl}/id/${treeId}`;
  }

  genusSpeciesUrl(treesGenus: string, treesSpecies: string): string {
    return `${this.SATreesUrl}/treegs/${treesGenus}/${treesSpecies}`;
  }

  treeGenusUrl(treesGenus: string): string {
    return `${this.SATreesUrl}/treegenus/${treesGenus}`;
  }

  groupUrl(treesGroup: string): string {
    return `${this.SATreesUrl}/group/${treesGroup}`;
  }

  commonNameLanguageUrl(language: string, cnameregex: string): string {
    return `${this.SATreesUrl}/cnlan/${language}/${this.encode(cnameregex)}`;
  }

  genusNameUrl(genusName: string): string {
    return `${this.SATreesUrl}/genus/name/${genusName}`;
  }

  genusRegexUrl(genusName: string): string {
    return `${this.SATreesUrl}/genus/regex/${this.encode(genusName)}`;
  }

  vegetationAbbreviationUrl(vegAbbrev: string): string {
    return `${this.SATreesUrl}/vegetation/abbreviation/${vegAbbrev}`;
  }

  familyNameUrl(familyName: string): string {
    return `${this.SATreesUrl}/Family/${familyName}`;
  }

  familyRegexUrl(familyName: string): string {
    return `${this.SATreesUrl}/family/regex/${this.encode(familyName)}`;
  }

  /** Log a message with the MessageService */
  private log(message: string) {
    this.messageService.add(`TreehttpService: ${message}`);
  }
}
