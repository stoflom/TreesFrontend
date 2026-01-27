import { Routes } from '@angular/router';
import { TreesComponent } from './trees/trees.component';
import { GenusComponent } from './genus/genus.component';
import { GeneraComponent } from './genera/genera.component';
import { FamilyComponent } from './family/family.component';
import { FamiliesComponent } from './families/families.component';
import { TreeDetailComponent } from './tree-detail/tree-detail.component';
import { SearchEditorComponent } from './search-editor/search-editor.component';
import { Vegetation } from './vegetation/vegetation';

export const routes: Routes = [
  //Order is important here, first match wins.
  { path: 'search', component: SearchEditorComponent },
  { path: 'detail/:id', component: TreeDetailComponent },
  { path: 'trees/:language/:nameregex', component: TreesComponent },
  { path: 'group/:group', component: TreesComponent },
  { path: 'genus/:name', component: GenusComponent },
  { path: 'genus_regex/:name', component: GeneraComponent },
  { path: 'family/:name', component: FamilyComponent },
  { path: 'family_regex/:name', component: FamiliesComponent },
  { path: 'vegetation/:abbreviation', component: Vegetation },
  { path: '', redirectTo: 'search', pathMatch: 'full' }             //Default route,run on startup

];