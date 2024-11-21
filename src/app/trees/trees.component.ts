import { Component, OnInit } from '@angular/core';
import { ITreeDocument } from '../interfaces/tree';
import { TreehttpService } from '../services/treehttp.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-trees',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './trees.component.html',
  styleUrl: './trees.component.css'
})
export class TreesComponent implements OnInit {

  selectedTree!: ITreeDocument;
  trees!: ITreeDocument[];

  constructor(
    private route: ActivatedRoute,
    private treehttpService: TreehttpService,
    private location: Location
  ) { }

  // tslint:disable-next-line: typedef
  ngOnInit() {

    const language: string = <string>this.route.snapshot.paramMap.get('language');
    const nameregex: string = <string>this.route.snapshot.paramMap.get('nameregex');
    const group: string = <string>this.route.snapshot.paramMap.get('group');
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
