import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TreehttpService } from '../services/treehttp.service';
import { IFamilyDocument } from '../interfaces/family';

import { RouterModule } from '@angular/router';
import { CommaSpacePipe } from '../pipes/commaspace';

@Component({
    selector: 'app-family',
    imports: [
    RouterModule,
    CommaSpacePipe
],
    templateUrl: './family.component.html',
    styleUrl: './family.component.css'
})
export class FamilyComponent {
    private route = inject(ActivatedRoute);
    private treehttpService = inject(TreehttpService);

    private params = toSignal(this.route.paramMap, {
        initialValue: this.route.snapshot.paramMap
    });

    afamily = this.treehttpService.query<IFamilyDocument | undefined>(() => {
        const name = this.params().get('name');
        return name ? this.treehttpService.familyNameUrl(name) : undefined;
    }, undefined).value;
}
