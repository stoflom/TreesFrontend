import { Component, OnInit, inject } from '@angular/core';
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


  Families: IFamilyDocument[] = {} as IFamilyDocument[];   //definite assignment


  ngOnInit() {

    const familyregex: string = this.route.snapshot.paramMap.get('name') as string;
        
    this.getFamiliesByNameRegex(familyregex);
    
  }


  getFamiliesByNameRegex(familyregex: string): void {

      this.treehttpService.findFamilyByRegexName(familyregex)
        .subscribe(Families => {
          this.Families = Families;
          
          // Redirect to family detail page if exactly one family is found
          if (Families.length === 1) {
            this.router.navigate(['/family', Families[0].name]);
          }
        });
      return;
 
  }
 }