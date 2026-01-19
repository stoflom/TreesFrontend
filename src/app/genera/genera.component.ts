import { Component, OnInit, inject } from '@angular/core';
import { IGenusDocument } from '../interfaces/genus';
import { TreehttpService } from '../services/treehttp.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Location } from '@angular/common';


@Component({
    selector: 'app-Genera',
    imports: [
    RouterModule
],
    templateUrl: './genera.component.html',
    styleUrl: './genera.component.css'
})
export class GeneraComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private treehttpService = inject(TreehttpService);
  private location = inject(Location);


  Genera: IGenusDocument[] = {} as IGenusDocument[];   //definite assignment


  ngOnInit() {

    const genusregex: string = this.route.snapshot.paramMap.get('name') as string;
    
    //must check for good query strings here

    if (genusregex) {
      this.getGenaByNameRegex(genusregex);
    } else {
      this.location.back();
    }
  }


  getGenaByNameRegex(genusregex: string): void {

      this.treehttpService.findGenusByRegexName(genusregex)
        .subscribe(Genera => this.Genera = Genera); //Take first match
      return;
  
  }

  goBack(): void {
    this.location.back();
  }
}

