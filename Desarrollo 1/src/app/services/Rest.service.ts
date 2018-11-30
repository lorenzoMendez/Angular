import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators'; 

@Injectable({
      providedIn: 'root'
})

export class RestService {
      endpoint:string  = 'http://api.geonames.org/searchJSON?name_startsWith=';
      endpointw: string = 'http://api.openweathermap.org/data/2.5/weather?';
      httpOptions = {
        headers: new HttpHeaders( {
          'Content-Type':  'application/json'
        })
      };

      constructor( private http: HttpClient ) { }

      private extractData(res: Response) {
        let body = res;
        return body || { };
      }

      setUri( starwith: string ) {
        this.endpoint = 'http://api.geonames.org/searchJSON?name_startsWith=' + starwith;
      }

      // Obtiene la lista de ciudades
      getCity(): Observable<any> {
        return this.http.get( this.endpoint + '&maxRows=15&username=lorenzomendoza' ).pipe(
          map(this.extractData));
      }
      
      // Regresa el Json con la informacion del clima
      getWeather( lat: number, lon: number ): Observable<any> {
        console.log( this.endpointw + "lat=" + lat + "&lon=" + lon + "&appid=ceeaf2e0ddc243baacee1c6babfbcf76" );
        return this.http.get( this.endpointw + "lat=" + lat + "&lon=" + lon + "&appid=ceeaf2e0ddc243baacee1c6babfbcf76" )
      }
      private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead

          // TODO: better job of transforming error for user consumption
          console.log(`${operation} failed: ${error.message}`);

          // corre la aplicacion siempre
          return of(result as T);
        };
      }
}
