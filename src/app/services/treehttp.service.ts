import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ITreeDocument } from '../interfaces/tree';
import { IGenusDocument } from '../interfaces/genus';
import { IFamilyDocument } from '../interfaces/family';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class TreehttpService {
  private SATreesUrl: string = 'http://192.168.1.77:5002/api';   //Remember CORS in backend!
  //lcalhost/0.0.0.0 all seems to fail! MUST use the full ip and "ng serve --host 0.0.0.0"

  //OR fetch via proxy.json config file (CORS still required) (Does this still work?)
  // Seems must have "/api" in proxy and not "/api/*"  as before
  //private SATreesUrl: string = '/api';

  private headersJSON = new HttpHeaders().set(
    'Content-Type',
    'application/json'
  );

  private headersUrlEncoded = new HttpHeaders().set(
    'Content-Type',
    'application/x-www-form-urlencoded'
  );

  constructor(
    private http: HttpClient, private messageService: MessageService
  ) { }

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

  //Get all trees belonging to specified genus (only _Id, Identity)
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
          `ERROR Tree genus query: ${treesGenus}`
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
          `ERROR Tree group query: ${treesGroup}`
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
    const url = `${this.SATreesUrl}/cnlan/${language}/${encodeURIComponent(cnameregex)}`;
    return this.http.get<ITreeDocument[]>(url).pipe(
      tap((x) =>
        x.length
          ? this.log(`Found ${x.length} trees matching "${language}": "${cnameregex}"`)
          : this.log(`No trees match "${cnameregex}"`)
      ),
      catchError(
        this.handleError<ITreeDocument[]>(
          `ERROR Tree genus query: ${cnameregex}`
        )
      )
    );
  }

  //Get all trees matching a query JSON object
  findTreesByQuery(treesQuery: string): Observable<ITreeDocument[]> {
    if (!treesQuery.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    const url = `${this.SATreesUrl}/treesjq/${treesQuery}`;
    return this.http
      .get<ITreeDocument[]>(url, { headers: this.headersJSON })
      .pipe(
        tap((x) =>
          x.length
            ? this.log(`Found trees matching "${treesQuery}"`)
            : this.log(`No treess match "${treesQuery}"`)
        ),
        catchError(
          this.handleError<ITreeDocument[]>(`Trees query: ${treesQuery}`)
        )
      );
  }


  // Get Genus by name, return 'undefined' when not found
  findGenusByName(genusName: string): Observable<IGenusDocument> {
    const url = `${this.SATreesUrl}/genus/${genusName}`;
    return this.http.get<IGenusDocument>(url).pipe(
      tap((h) => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`Fetching genus by name: ${genusName}: ${outcome}`);
      }),
      catchError(this.handleError<IGenusDocument>(`Genus name=${genusName}`))
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

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a message with the MessageService */
  private log(message: string) {
    this.messageService.add(`TreehttpService: ${message}`);
  }
}


