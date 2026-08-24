import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
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
export class GenusComponent {
  private route = inject(ActivatedRoute);
  private treehttpService = inject(TreehttpService);

  private params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap
  });

  private agenusQuery = this.treehttpService.query<IGenusDocument | undefined>(() => {
    const name = this.params().get('name');
    return name ? this.treehttpService.genusNameUrl(name) : undefined;
  }, undefined);

  agenus = this.agenusQuery.value;

  private speciesQuery = this.treehttpService.query<ITreeDocument[]>(() => {
    const name = this.params().get('name');
    return name ? this.treehttpService.treeGenusUrl(name) : undefined;
  }, []);

  treespecies = this.speciesQuery.value;

  getSpecies(): void {
    this.speciesQuery.reload();
  }
}
