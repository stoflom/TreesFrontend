import { Component, OnInit, inject } from '@angular/core';
import { ITreeDocument } from '../interfaces/tree';
import { Location } from '@angular/common';
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
export class TreeDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private treehttpService = inject(TreehttpService);
    private location = inject(Location);

    atree: ITreeDocument = {} as ITreeDocument;   //definite assignment

    ngOnInit(): void {
        this.getTree()
    }

    getTree(): void {
        const id: string = this.route.snapshot.paramMap.get('id') as string;
        this.treehttpService.findTreeById(id)
            .subscribe(tree => this.atree = tree);
    }

    goBack(): void {
        this.location.back();
    }

}
