import { Component, OnInit, inject } from '@angular/core';
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
  private route = inject(ActivatedRoute);
  private treehttpService = inject(TreehttpService);
  private location = inject(Location);


  agenus: IGenusDocument = {} as IGenusDocument;   //definite assignment
  treespecies!: ITreeDocument[];

  genusnameparam: string = this.route.snapshot.paramMap.get('name') as string;

  ngOnInit(): void {
    this.getGenus();
    this.getSpecies();
  }

  getGenus(): void {
    this.treehttpService.findGenusByName(this.genusnameparam)
      .subscribe(genus => this.agenus = genus);
  }

  getSpecies(): void {
    this.treehttpService.findTreesByGenus(this.agenus.name)
      .subscribe(species => this.treespecies = species);

  }

  goBack(): void {
    this.location.back();
  }

}
