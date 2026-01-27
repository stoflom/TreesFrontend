import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { TreehttpService } from '../services/treehttp.service';
import { IVegetationDocument } from '../interfaces/vegetation';

@Component({
  selector: 'app-vegetation',
  imports: [RouterModule],
  templateUrl: './vegetation.component.html',
  styleUrl: './vegetation.component.css',
})
export class Vegetation implements OnInit {
  private route = inject(ActivatedRoute);
  private treehttpService = inject(TreehttpService);
  private location = inject(Location);

  avegetation: IVegetationDocument = {} as IVegetationDocument;

  ngOnInit(): void {
    this.getVegetation();
  }

  getVegetation(): void {
    const abbreviation = this.route.snapshot.paramMap.get('abbreviation') as string;
    this.treehttpService
      .findVegetationByAbbreviation(abbreviation)
      .subscribe((vegetation) => (this.avegetation = vegetation));
  }

  goBack(): void {
    this.location.back();
  }
}