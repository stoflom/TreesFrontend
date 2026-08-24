import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ITreeDocument } from '../interfaces/tree';
import { TreehttpService } from '../services/treehttp.service';

import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommaSpacePipe } from '../pipes/commaspace';

@Component({
    selector: 'app-tree-detail',
    imports: [
    RouterModule,
    CommaSpacePipe
],
    templateUrl: './tree-detail.component.html',
    styleUrl: './tree-detail.component.css'
})
export class TreeDetailComponent {
    private route = inject(ActivatedRoute);
    private treehttpService = inject(TreehttpService);

    private params = toSignal(this.route.paramMap, {
        initialValue: this.route.snapshot.paramMap
    });

    atree = this.treehttpService.query<ITreeDocument | undefined>(() => {
        const id = this.params().get('id');
        return id ? this.treehttpService.idUrl(id) : undefined;
    }, undefined).value;
}
