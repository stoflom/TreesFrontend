import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ITreeDocument } from '../interfaces/tree';
import { IGenusDocument } from '../interfaces/genus';
import { IFamilyDocument } from '../interfaces/family';
import { IVegetationDocument } from '../interfaces/vegetation';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class TreehttpService {
  private http = inject(HttpClient);
  private messageService = inject(MessageService);

  private SATreesUrl = 'http://192.168.0.8:5002/api';   //Remember CORS in backend!
  //This URL will be used by frontend to access backend resources. If you
  //use localhost you must fetch via proxy.json config file (CORS still required) 


  private headersJSON = new HttpHeaders().set(
    'Content-Type',
    'application/json'
  );

  private headersUrlEncoded = new HttpHeaders().set(
    'Content-Type',
    'application/x-www-form-urlencoded'
  );

  // Get tree by Id, return 'undefined' when id not found
  findTreeById(treeId: string): Observable<ITreeDocument> {
    const url = `${this.SATreesUrl}/id/${treeId}`;
    return this.http.get<ITreeDocument>(url).pipe(
      tap((h) => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`Fetching by Id: ${treeId}: ${outcome}`);
      }),
      catchError(this.handleError<ITreeDocument>(`Tree id=${treeId}`))
    );
  }

  // Get trees by genus and species, return 'undefined' when id not found
  findTreesByGenusSpecies(treesGenus: string, treesSpecies: string): Observable<ITreeDocument[]> {
     if (! (treesGenus.trim() && treesSpecies.trim()) ) {
      // if not search term, return empty array.
      return of([]);
    }
    //Should do add parameter here to ensure url encoding
    const url = `${this.SATreesUrl}/treegs/${treesGenus}/${treesSpecies}`;
    return this.http.get<ITreeDocument[]>(url).pipe(
      tap((x) =>
        x.length
          ? this.log(`Found ${x.length} trees matching "${treesGenus} ${treesSpecies}"`)
          : this.log(`No trees match "${treesGenus}" "${treesSpecies}"`)
      ),
      catchError(
        this.handleError<ITreeDocument[]>(
          `ERROR Tree genus query: ${treesGenus} ${treesSpecies}`, []
        )
      )
    );
  }



  //Get all trees belonging to specified genus (only _Id, Identity)
  //This is exact match and not regex
  findTreesByGenus(treesGenus: string): Observable<ITreeDocument[]> {
    if (!treesGenus.trim()) {
      // if not search term, return empty array.
      return of([]);
    }
    //Should do add parameter here to ensure url encoding
    const url = `${this.SATreesUrl}/treegenus/${treesGenus}`;
    return this.http.get<ITreeDocument[]>(url).pipe(
      tap((x) =>
        x.length
          ? this.log(`Found ${x.length} trees matching "${treesGenus}"`)
          : this.log(`No trees match "${treesGenus}"`)
      ),
      catchError(
        this.handleError<ITreeDocument[]>(
          `ERROR Tree genus query: ${treesGenus}`, []
        )
      )
    );
  }

  //Get all trees belonging to specified genus (only _Id, Identity)
  findTreesByGroup(treesGroup: string): Observable<ITreeDocument[]> {
    if (!treesGroup.trim()) {
      // if not search term, return empty array.
      return of([]);
    }
    //Should do add parameter here to ensure url encoding
    const url = `${this.SATreesUrl}/group/${treesGroup}`;
    return this.http.get<ITreeDocument[]>(url).pipe(
      tap((x) =>
        x.length
          ? this.log(`Found ${x.length} trees in group: "${treesGroup}"`)
          : this.log(`No trees match "${treesGroup}"`)
      ),
      catchError(
        this.handleError<ITreeDocument[]>(
          `ERROR Tree group query: ${treesGroup}`, []
        )
      )
    );
  }


  //Get all trees belonging to regex query on language and name regex (only _Id, Identity)
  findTreesByCommonNameLanguage(
    language: string,
    cnameregex: string
  ): Observable<ITreeDocument[]> {
    if (!cnameregex.trim()) {
      // if not search term, return empty array, else all trees will  be returned
      return of([]);
    }
    //Should actually use httpclient here
    const encodedCnameRegex = this.customEncodeURIComponent(cnameregex);
    const url = `${this.SATreesUrl}/cnlan/${language}/${encodedCnameRegex}`;
    return this.http.get<ITreeDocument[]>(url).pipe(
      tap((x) =>
        x.length
          ? this.log(`Found ${x.length} trees matching "${language}": "${cnameregex}"`)
          : this.log(`No trees match "${cnameregex}"`)
      ),
      catchError(
        this.handleError<ITreeDocument[]>(
          `ERROR Tree genus query: ${cnameregex}`, []
        )
      )
    );
  }

  //Get all trees matching a query JSON object
  findTreesByQuery(treesQuery: string): Observable<ITreeDocument[]> {
    if (!treesQuery.trim()) {
      // if not search term, return empty array.
      return of([]);
    }
    const url = `${this.SATreesUrl}/treesjq/${treesQuery}`;
    return this.http
      .get<ITreeDocument[]>(url, { headers: this.headersJSON })
      .pipe(
        tap((x) =>
          x.length
            ? this.log(`Found ${x.length} trees matching "${treesQuery}"`)
            : this.log(`No treess match "${treesQuery}"`)
        ),
        catchError(
          this.handleError<ITreeDocument[]>(`Trees query: ${treesQuery}`, [])
        )
      );
  }


  // Get Genus by name, return 'undefined' when not found
  findGenusByName(genusName: string): Observable<IGenusDocument> {
    const url = `${this.SATreesUrl}/genus/name/${genusName}`;
    return this.http.get<IGenusDocument>(url).pipe(
      tap((h) => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`Fetching genus by name: ${genusName}: ${outcome}`);
      }),
      catchError(this.handleError<IGenusDocument>(`Genus name=${genusName}`))
    );
  }

   // Get Genus by regex name, returns array, return 'undefined' when not found
  findGenusByRegexName(genusName: string): Observable<IGenusDocument[]> {
    if (!genusName.trim()) {
      // if not search term, return empty array.
      return of([]);
    }
    const encodedgname = this.customEncodeURIComponent(genusName);
    const url = `${this.SATreesUrl}/genus/regex/${encodedgname}`;
    return this.http.get<IGenusDocument[]>(url).pipe(
      tap((x) =>
          x.length
            ? this.log(`Found ${x.length} Genera matching "${genusName}"`)
            : this.log(`No Genera match "${genusName }"`)
        ),
      catchError(this.handleError<IGenusDocument[]>(`Genus name=${genusName}`))
    );
  }

  // Get Vegetation by abbreviation, return 'undefined' when not found
  findVegetationByAbbreviation(vegAbbrev: string): Observable<IVegetationDocument> {
    const url = `${this.SATreesUrl}/vegetation/abbreviation/${vegAbbrev}`;
    return this.http.get<IVegetationDocument>(url).pipe(
      tap((h) => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`Fetching vegetation by abbreviation: ${vegAbbrev}: ${outcome}`);
      }),
      catchError(this.handleError<IVegetationDocument>(`Vegetation abbreviation=${vegAbbrev}`))
    );
  }

  // Get Family by name, return 'undefined' when not found
  findFamilyByName(familyName: string): Observable<IFamilyDocument> {
    const url = `${this.SATreesUrl}/Family/${familyName}`;
    return this.http.get<IFamilyDocument>(url).pipe(
      tap((h) => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`Fetching family by name: ${familyName}: ${outcome}`);
      }),
      catchError(this.handleError<IFamilyDocument>(`Family name=${familyName}`))
    );
  }

   // Get Family by regex name, returns array, return 'undefined' when not found
   findFamilyByRegexName(familyName: string): Observable<IFamilyDocument[]> {
     if (!familyName.trim()) {
       // if not search term, return empty array.
       return of([]);
     }
     const encodedfname = this.customEncodeURIComponent(familyName);
     const url = `${this.SATreesUrl}/family/regex/${encodedfname}`;
     return this.http.get<IFamilyDocument[]>(url).pipe(
       tap((x) =>
           x.length
             ? this.log(`Found ${x.length} Families matching "${familyName}"`)
             : this.log(`No Families match "${familyName }"`)
         ),
       catchError(this.handleError<IFamilyDocument[]>(`Family name=${familyName}`))
     );
   }

  private customEncodeURIComponent(str: string): string {
    // Escape '?' 
    return str.replace(/\?/g, '%3F');
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: unknown): Observable<T> => {
      // TODO: send the error to remote logging infrastructure  
      console.error(error); // log to console instead

      // Extract a message in a typed-safe way
      const errMsg = (error as { message?: string })?.message ?? String(error);

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${errMsg}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a message with the MessageService */
  private log(message: string) {
    this.messageService.add(`TreehttpService: ${message}`);
  }
}


