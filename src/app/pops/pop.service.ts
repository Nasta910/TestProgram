import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Pop } from './pop';

export class PopService {
  private popUrl =
    'https://apex.oracle.com/pls/apex/noahdoc/PopColOffline/PopsofflineAPI'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  /** GET heroes from the server */
  getPops(): Observable<Pop[]> {
    return this.http.get<Pop[]>(this.popUrl).pipe(
      tap((_) => console.error('fetched pops')),
      catchError(this.handleError<Pop[]>('getPops', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
