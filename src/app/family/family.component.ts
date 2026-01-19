import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
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
export class FamilyComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private treehttpService = inject(TreehttpService);
    private location = inject(Location);


    afamily!: IFamilyDocument;

    ngOnInit(): void {
        this.getFamily()
    }


    getFamily(): void {     
        const name = this.route.snapshot.paramMap.get(' name') as string;
        this.treehttpService.findFamilyByName(name)
            .subscribe(family => this.afamily = family);   //When family is returned (observed) assign it to afamily.
    }

    goBack(): void {
        this.location.back();
    }

}

