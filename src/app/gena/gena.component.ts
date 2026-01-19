import { Component, OnInit } from '@angular/core';
import { IGenusDocument } from '../interfaces/genus';
import { TreehttpService } from '../services/treehttp.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location } from '@angular/common';


@Component({
    selector: 'app-gena',
    imports: [
    RouterModule
],
    templateUrl: './gena.component.html',
    styleUrl: './gena.component.css'
})
export class GenaComponent implements OnInit {

  gena!: IGenusDocument[];

  constructor(
    private route: ActivatedRoute,
    private treehttpService: TreehttpService,
    private location: Location
  ) { }

  // tslint:disable-next-line: typedef
  ngOnInit() {

    const genusregex: string = <string>this.route.snapshot.paramMap.get('name');
    
    //must check for good query strings here

    if (genusregex) {
      this.getGenaByNameRegex(genusregex);
    } else {
      this.location.back();
    }
  }


  getGenaByNameRegex(genusregex: string): void {

      this.treehttpService.findGenusByRegexName(genusregex)
        .subscribe(gena => this.gena = gena); //Take first match
      return;
  
  }

  goBack(): void {
    this.location.back();
  }
}

