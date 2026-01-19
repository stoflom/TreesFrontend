import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PersistService } from '../services/persist.service';
import { MessageService } from '../services/message.service';

@Component({
    selector: 'app-search-editor',
    imports: [
        ReactiveFormsModule //Import into template
    ],
    templateUrl: './search-editor.component.html',
    styleUrl: './search-editor.component.css'
})
export class SearchEditorComponent implements OnInit {
    private router = inject(Router);
    private persistService = inject(PersistService);
    private messageService = inject(MessageService);
;

    public searchparams = {  //These are initial-initial values, will be refreshed from persistence
        language: 'Eng',
        searchterm: 'wood†?$',
        group: '1',
        genus: 'Alb.*',
        family: 'Mimosaceae'
    };

    ngOnInit(): void {

        let obj: object | null = this.persistService.retrieve();

        if (obj != null && typeof obj === typeof this.searchparams) {
            // console.warn(this.persistService.retrieve());

            this.searchparams = obj as typeof this.searchparams;


            //Seems that this is called after the form has been pre-constructed so the
            //  initialcookie values never feature unless the form is reset!
            this.searchlnregexFG.reset({
                language: this.searchparams.language,
                searchterm: this.searchparams.searchterm
            });

            this.searchgroupFG.reset({
                group: this.searchparams.group
            });

            this.searchgenusFG.reset({
                genus: this.searchparams.genus
            });

            this.searchfamilyFG.reset({
                family: this.searchparams.family
            });
        } else {
            this.messageService.add("Could not retrieve search parameters from persistence.");
        }

    };

    public searchlnregexFG = new UntypedFormGroup({
        language: new UntypedFormControl(this.searchparams.language),
        searchterm: new UntypedFormControl(this.searchparams.searchterm)
    });

    public onSubmitsearchlnregexFG() {
        //console.warn(this.searchlnregexFG.value);
        let lang = this.searchlnregexFG.value.language;
        let term = this.searchlnregexFG.value.searchterm;
        this.searchparams.language = lang;
        this.searchparams.searchterm = term;
        this.persistService.persist(this.searchparams);
        this.router.navigate(['/trees/', lang, term]);

    };

    searchgroupFG = new UntypedFormGroup({
        group: new UntypedFormControl(this.searchparams.group)
    });

    public onSubmitsearchgroupFG() {
        //  console.warn(this.searchgroupFG.value);
        let grp = this.searchgroupFG.value.group;
        this.searchparams.group = grp;
        this.persistService.persist(this.searchparams);
        this.router.navigate(['/group', grp]);
    };

    searchgenusFG = new UntypedFormGroup({
        genus: new UntypedFormControl(this.searchparams.genus)
    });

    public onSubmitsearchgenusFG() {
        //  console.warn(this.searchgenusFG.value);
        let gns = this.searchgenusFG.value.genus;
        this.searchparams.genus = gns;
        this.persistService.persist(this.searchparams);
        this.router.navigate(['/genus_regex', gns]);
    };

    searchfamilyFG = new UntypedFormGroup({
        family: new UntypedFormControl(this.searchparams.family)
    });

    public onSubmitsearchfamilyFG() {
        //  console.warn(this.searchfamilyFG.value);
        let fam = this.searchfamilyFG.value.family;
        this.searchparams.family = fam;
        this.persistService.persist(this.searchparams);
        this.router.navigate(['/family', fam]);
    };

}
