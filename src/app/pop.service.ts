import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Pop } from './pop';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class PopService {
  private popsUrl =
    'https://apex.oracle.com/pls/apex/noahdoc/PopColOffline/PopsofflineAPI'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  /** GET pops from the server */
  getPops(): Observable<Pop[]> {
    return this.http.get<Pop[]>(this.popsUrl).pipe(
      tap((_) => this.log('fetched pops')),
      catchError(this.handleError<Pop[]>('getPops', []))
    );
  }

  /** GET pop by id. Return `undefined` when id not found */
  getPopNo404<Data>(id: number): Observable<Pop> {
    const url = `${this.popsUrl}/?id=${id}`;
    return this.http.get<Pop[]>(url).pipe(
      map((pops) => pops[0]), // returns a {0|1} element array
      tap((h) => {
        const outcome = h ? 'fetched' : 'did not find';
        this.log(`${outcome} pop id=${id}`);
      }),
      catchError(this.handleError<Pop>(`getPop id=${id}`))
    );
  }

  /** GET pop by id. Will 404 if id not found */
  getPop(id: number): Observable<Pop> {
    const url = `${this.popsUrl}/${id}`;
    return this.http.get<Pop>(url).pipe(
      tap((_) => this.log(`fetched pop id=${id}`)),
      catchError(this.handleError<Pop>(`getPop id=${id}`))
    );
  }

  /* GET pops whose name contains search term */
  searchPops(term: string): Observable<Pop[]> {
    if (!term.trim()) {
      // if not search term, return empty pop array.
      return of([]);
    }
    return this.http.get<Pop[]>(`${this.popsUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found pops matching "${term}"`)
          : this.log(`no pops matching "${term}"`)
      ),
      catchError(this.handleError<Pop[]>('searchPops', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new pop to the server */
  addPop(pop: Pop): Observable<Pop> {
    return this.http.post<Pop>(this.popsUrl, pop, this.httpOptions).pipe(
      tap((newPop: Pop) => this.log(`added pop w/ id=${newPop.popid}`)),
      catchError(this.handleError<Pop>('addPop'))
    );
  }

  /** DELETE: delete the pop from the server */
  deletePop(popid: number): Observable<Pop> {
    const url = `${this.popsUrl}/${id}`;

    return this.http.delete<Pop>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted pop id=${id}`)),
      catchError(this.handleError<Pop>('deletePop'))
    );
  }

  /** PUT: update the pop on the server */
  updatePop(pop: Pop): Observable<any> {
    return this.http.put(this.popsUrl, pop, this.httpOptions).pipe(
      tap((_) => this.log(`updated pop id=${pop.id}`)),
      catchError(this.handleError<any>('updatePop'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
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

  /** Log a PopService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PopService: ${message}`);
  }
}

/*
    Copyright Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license
    */
