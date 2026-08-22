import { Component, OnInit, inject, signal } from '@angular/core';
import { IGenusDocument } from '../interfaces/genus';
import { TreehttpService } from '../services/treehttp.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
    selector: 'app-genera',
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
  private router = inject(Router);


  genera = signal<IGenusDocument[]>([]);


  ngOnInit() {

    const genusregex: string = this.route.snapshot.paramMap.get('name') as string;
    this.getGenaByNameRegex(genusregex);
   
  }


  getGenaByNameRegex(genusregex: string): void {

      this.treehttpService.findGenusByRegexName(genusregex)
        .subscribe((result) => {
          this.genera.set(result);

          // Redirect to genus detail page if exactly one genus is found
          if (result.length === 1) {
            this.router.navigate(['/genus', result[0].name]);
          }
        });
  }

}

