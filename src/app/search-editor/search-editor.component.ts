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

    public searchparams = {  //These are initial-initial values, will be refreshed from persistence
        language: 'Eng',
        searchterm: 'wood†?$',  //ends with 'wood' or 'wood†'
        group: '1',
        genus: '^A',  //starts with A'
        family: 'ceae$'  //ends with 'ceae'
    };

    ngOnInit(): void {
        this.getsearchparams();
        //Seems that this is called after the form has been pre-constructed so the
        this.reset();
    }


    private getsearchparams(): void {

        const obj: object | null = this.persistService.retrieve();

        if (obj != null && typeof obj === typeof this.searchparams) {
            this.searchparams = obj as typeof this.searchparams;
        }
    }

    private reset(): void {
        //  initial values never feature unless the form is reset!
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
    }

    public searchlnregexFG = new UntypedFormGroup({
        language: new UntypedFormControl(this.searchparams.language),
        searchterm: new UntypedFormControl(this.searchparams.searchterm)
    });

    public onSubmitsearchlnregexFG() {
        //console.warn(this.searchlnregexFG.value);
        const lang = this.searchlnregexFG.value.language;
        const term = this.searchlnregexFG.value.searchterm;
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
        const grp = this.searchgroupFG.value.group;
        this.searchparams.group = grp;
        this.persistService.persist(this.searchparams);
        this.router.navigate(['/group', grp]);
    };

    searchgenusFG = new UntypedFormGroup({
        genus: new UntypedFormControl(this.searchparams.genus)
    });

    public onSubmitsearchgenusFG() {
        //  console.warn(this.searchgenusFG.value);
        const gns = this.searchgenusFG.value.genus;
        this.searchparams.genus = gns;
        this.persistService.persist(this.searchparams);
        this.router.navigate(['/genus_regex', gns]);
    };

    searchfamilyFG = new UntypedFormGroup({
        family: new UntypedFormControl(this.searchparams.family)
    });

    public onSubmitsearchfamilyFG() {
        //  console.warn(this.searchfamilyFG.value);
        const fam = this.searchfamilyFG.value.family;
        this.searchparams.family = fam;
        this.persistService.persist(this.searchparams);
        this.router.navigate(['/family_regex', fam]);
    };

}
