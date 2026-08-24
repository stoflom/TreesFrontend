import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TreehttpService } from '../services/treehttp.service';
import { IVegetationDocument } from '../interfaces/vegetation';

@Component({
  selector: 'app-vegetation',
  imports: [RouterModule],
  templateUrl: './vegetation.component.html',
  styleUrl: './vegetation.component.css',
})
export class Vegetation {
  private route = inject(ActivatedRoute);
  private treehttpService = inject(TreehttpService);

  private params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap
  });

  avegetation = this.treehttpService.query<IVegetationDocument | undefined>(() => {
    const abbreviation = this.params().get('abbreviation');
    return abbreviation ? this.treehttpService.vegetationAbbreviationUrl(abbreviation) : undefined;
  }, undefined).value;
}
