import { Component, OnInit, inject } from '@angular/core';
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
export class TreesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private treehttpService = inject(TreehttpService);
  private location = inject(Location);
  private router = inject(Router);


  selectedTree: ITreeDocument = {} as ITreeDocument; //definite assignment  
  trees: ITreeDocument[] = {} as ITreeDocument[];   //definite assignment


  ngOnInit() {

    const language: string = this.route.snapshot.paramMap.get('language') as string;
    const nameregex: string = this.route.snapshot.paramMap.get('nameregex') as string;
    const group: string = this.route.snapshot.paramMap.get('group') as string;
    const treesGenus: string = this.route.snapshot.paramMap.get('genus') as string;
    const treesSpecies: string = this.route.snapshot.paramMap.get('species') as string;


    //must check for good query strings here

    if (language && nameregex) {
      this.getTreesByLanguageNameregex(language, nameregex);
    } else {
      if (group) {
        this.getTreesByGroup(group);
      } else
        if (treesGenus && treesSpecies) {
          this.GetTreesByGenusSpecies(treesGenus, treesSpecies);
        } else {
          this.location.back();
        }
    }
  }

  private FallThroughToDetail(trees: ITreeDocument[]): ITreeDocument[] {
    // Redirect to tree detail page if exactly one tree is found
    if (trees.length === 1) {
      this.router.navigate(['/detail', trees[0].id]);
      return []
    } else
      return trees
  }


  GetTreesByGenusSpecies(treesGenus: string, treesSpecies: string): void {
    this.treehttpService
      .findTreesByGenusSpecies(treesGenus, treesSpecies)
      .subscribe((response: ITreeDocument[]) => { this.trees = this.FallThroughToDetail(response); });
  }

  getTreesByLanguageNameregex(language: string, nameregex: string): void {

    //must check for good query strings here

    this.treehttpService
      .findTreesByCommonNameLanguage(language, nameregex)
      .subscribe((response: ITreeDocument[]) => { this.trees = this.FallThroughToDetail(response); });

  }

  getTreesByGroup(group: string): void {
    this.treehttpService
      .findTreesByGroup(group)
      .subscribe((response: ITreeDocument[]) => { this.trees = this.FallThroughToDetail(response); });
  }

}
