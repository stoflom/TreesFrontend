import { Component, OnInit, inject, signal } from '@angular/core';
import { IFamilyDocument } from '../interfaces/family';
import { TreehttpService } from '../services/treehttp.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
    selector: 'app-families',
    imports: [
    RouterModule
],
    templateUrl: './families.component.html',
    styleUrl: './families.component.css'
})
export class FamiliesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private treehttpService = inject(TreehttpService);
  private location = inject(Location);
  private router = inject(Router);


  families = signal<IFamilyDocument[]>([]);


  ngOnInit() {

    const familyregex: string = this.route.snapshot.paramMap.get('name') as string;
        
    this.getFamiliesByNameRegex(familyregex);
    
  }


  getFamiliesByNameRegex(familyregex: string): void {

      this.treehttpService.findFamilyByRegexName(familyregex)
        .subscribe((result) => {
          this.families.set(result);

          // Redirect to family detail page if exactly one family is found
          if (result.length === 1) {
            this.router.navigate(['/family', result[0].name]);
          }
        });
  }
 }