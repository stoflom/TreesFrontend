import { Component, OnInit } from '@angular/core';
import { ITreeDocument } from '../interfaces/tree';
import { Location } from '@angular/common';
import { TreehttpService } from '../services/treehttp.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommaSpacePipe } from '../pipes/commaspace';



@Component({
    selector: 'app-tree-detail',
    imports: [
        CommonModule, //Import into template
        RouterModule,
        CommaSpacePipe
    ],
    templateUrl: './tree-detail.component.html',
    styleUrl: './tree-detail.component.css'
})
export class TreeDetailComponent implements OnInit {
    atree!: ITreeDocument;   //definite assignment

    constructor(
        private route: ActivatedRoute,
        private treehttpService: TreehttpService,
        private location: Location
    ) { }

    ngOnInit(): void {
        this.getTree()
    }

    getTree(): void {
        const id: string = <string>this.route.snapshot.paramMap.get('id');
        this.treehttpService.findTreeById(id)
            .subscribe(tree => this.atree = tree);
    }

    goBack(): void {
        this.location.back();
    }

}
