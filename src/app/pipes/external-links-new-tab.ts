import { Pipe, PipeTransform } from '@angular/core';
/*
 * Adds target="_blank" rel="noopener noreferrer" to external links
 * (href starting with http:// or https://) in backend-provided HTML.
 * Internal (relative) links stay in the same tab.
 * Returns a plain string so Angular's [innerHTML] sanitization still applies.
 * Example:
 *   <p [innerHTML]="description | externalLinksNewTab"></p>
*/
@Pipe({
  name: 'externalLinksNewTab'
})
export class ExternalLinksNewTabPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    const doc = new DOMParser().parseFromString(value, 'text/html');
    for (const a of doc.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href') ?? '';
      if (/^https?:\/\//i.test(href)) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    }
    return doc.body.innerHTML;
  }
}
