import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TreehttpService } from '../services/treehttp.service';
import { IFamilyDocument } from '../interfaces/family';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommaSpacePipe } from '../pipes/commaspace';

@Component({
    standalone: true,
    selector: 'app-family',
    imports: [
        CommonModule,       //Import into template
        RouterModule,
        CommaSpacePipe
    ],
    templateUrl: './family.component.html',
    styleUrl: './family.component.css'
})
export class FamilyComponent implements OnInit {

    afamily!: IFamilyDocument;   //definite assignment

    constructor(
        private route: ActivatedRoute,
        private treehttpService: TreehttpService,
        private location: Location
    ) { }

    ngOnInit(): void {
        this.getFamily()
    }


    getFamily(): void {
        const name: string = <string>this.route.snapshot.paramMap.get('name');
        this.treehttpService.findFamilyByName(name)
            .subscribe(family => this.afamily = family);   //When family is returned (observed) assign it to afamily.
    }

    goBack(): void {
        this.location.back();
    }

}

