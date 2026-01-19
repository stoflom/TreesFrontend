import { Component, OnInit, inject } from '@angular/core';
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
  private route = inject(ActivatedRoute);
  private treehttpService = inject(TreehttpService);
  private location = inject(Location);


  gena!: IGenusDocument[];


  ngOnInit() {

    const genusregex: string = this.route.snapshot.paramMap.get('name') as string;
    
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

