import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TreehttpService } from '../services/treehttp.service';
import { IGenusDocument } from '../interfaces/genus';
import { ITreeDocument } from '../interfaces/tree';

import { RouterModule } from '@angular/router';
import { CommaSpacePipe } from '../pipes/commaspace';

@Component({
    selector: 'app-genus',
    imports: [
    RouterModule,
    CommaSpacePipe
],
    templateUrl: './genus.component.html',
    styleUrl: './genus.component.css'
})
export class GenusComponent implements OnInit {

  agenus!: IGenusDocument;   //definite assignment
  treespecies!: ITreeDocument[];

  genusname: string = <string>this.route.snapshot.paramMap.get('name');

  constructor(
    private route: ActivatedRoute,
    private treehttpService: TreehttpService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getGenus();
    this.getSpecies();
  }

  getGenus(): void {
    this.treehttpService.findGenusByName(this.genusname)
      .subscribe(genus => this.agenus = genus);
  }

  getSpecies(): void {
    this.treehttpService.findTreesByGenus(this.genusname)
      .subscribe(species => this.treespecies = species);

  }



  goBack(): void {
    this.location.back();
  }

}
