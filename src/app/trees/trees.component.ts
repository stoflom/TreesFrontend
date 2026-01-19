import { Component, OnInit, inject } from '@angular/core';
import { ITreeDocument } from '../interfaces/tree';
import { TreehttpService } from '../services/treehttp.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
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


  selectedTree: ITreeDocument = {} as ITreeDocument; //definite assignment  
  trees: ITreeDocument[] = {} as ITreeDocument[];   //definite assignment

 
  ngOnInit() {

    const language: string = this.route.snapshot.paramMap.get('language') as string;
    const nameregex: string = this.route.snapshot.paramMap.get('nameregex') as string;
    const group: string = this.route.snapshot.paramMap.get('group') as string;
    //must check for good query strings here

    if (language && nameregex) {
      this.getTreesByLanguageNameregex(language, nameregex);
    } else {
      if (group) {
        this.getTreesByGroup(group);
      } else {
        this.location.back();
      }

    }
  }


  getTreesByLanguageNameregex(language: string, nameregex: string): void {

    //must check for good query strings here

    this.treehttpService
      .findTreesByCommonNameLanguage(language, nameregex)
      .subscribe((response: ITreeDocument[]) => { this.trees = response });

  }

  getTreesByGroup(group: string): void {
    this.treehttpService
      .findTreesByGroup(group)
      .subscribe((response: ITreeDocument[]) => { this.trees = response });
  }



  goBack(): void {
    this.location.back();
  }
}
