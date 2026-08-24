import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IFamilyDocument } from '../interfaces/family';
import { TreehttpService } from '../services/treehttp.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-families',
    imports: [
    RouterModule
],
    templateUrl: './families.component.html',
    styleUrl: './families.component.css'
})
export class FamiliesComponent {
  private route = inject(ActivatedRoute);
  private treehttpService = inject(TreehttpService);
  private router = inject(Router);

  private params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap
  });

  private familiesQuery = this.treehttpService.query<IFamilyDocument[]>(() => {
    const familyregex = this.params().get('name');
    return familyregex ? this.treehttpService.familyRegexUrl(familyregex) : undefined;
  }, []);

  families = this.familiesQuery.value;

  constructor() {
    // Redirect to family detail page if exactly one family is found
    effect(() => {
      const found = this.familiesQuery.value();
      if (found.length === 1) {
        this.router.navigate(['/family', found[0].name]);
      }
    });
  }
}
