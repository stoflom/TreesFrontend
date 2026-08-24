import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ITreeDocument } from '../interfaces/tree';
import { TreehttpService } from '../services/treehttp.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-trees',
  imports: [
    RouterModule
  ],
  templateUrl: './trees.component.html',
  styleUrl: './trees.component.css'
})
export class TreesComponent {
  private route = inject(ActivatedRoute);
  private treehttpService = inject(TreehttpService);
  private location = inject(Location);
  private router = inject(Router);

  private params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap
  });

  private treesQuery = this.treehttpService.query<ITreeDocument[]>(() => {
    const p = this.params();
    const language = p.get('language');
    const nameregex = p.get('nameregex');
    if (language && nameregex) {
      return this.treehttpService.commonNameLanguageUrl(language, nameregex);
    }
    const group = p.get('group');
    if (group) {
      return this.treehttpService.groupUrl(group);
    }
    const treesGenus = p.get('genus');
    const treesSpecies = p.get('species');
    if (treesGenus && treesSpecies) {
      return this.treehttpService.genusSpeciesUrl(treesGenus, treesSpecies);
    }
    return undefined;
  }, []);

  trees = this.treesQuery.value;

  constructor() {
    // No usable route parameters: nothing to query, go back.
    effect(() => {
      if (this.treesQuery.status() === 'idle') {
        this.location.back();
      }
    });

    // Redirect to tree detail page if exactly one tree is found
    effect(() => {
      const found = this.treesQuery.value();
      if (found.length === 1) {
        this.router.navigate(['/detail', found[0].id]);
      }
    });
  }
}
