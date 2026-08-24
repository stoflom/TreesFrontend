import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IGenusDocument } from '../interfaces/genus';
import { TreehttpService } from '../services/treehttp.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-genera',
    imports: [
    RouterModule
],
    templateUrl: './genera.component.html',
    styleUrl: './genera.component.css'
})
export class GeneraComponent {
  private route = inject(ActivatedRoute);
  private treehttpService = inject(TreehttpService);
  private router = inject(Router);

  private params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap
  });

  private generaQuery = this.treehttpService.query<IGenusDocument[]>(() => {
    const genusregex = this.params().get('name');
    return genusregex ? this.treehttpService.genusRegexUrl(genusregex) : undefined;
  }, []);

  genera = this.generaQuery.value;

  constructor() {
    // Redirect to genus detail page if exactly one genus is found
    effect(() => {
      const found = this.generaQuery.value();
      if (found.length === 1) {
        this.router.navigate(['/genus', found[0].name]);
      }
    });
  }
}
