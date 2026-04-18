import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiBase = 'https://api.worldbank.org/V2';

  constructor(private http: HttpClient) {}

  getCountryDetails(code: string): Observable<any[]> {
    const url = `${this.apiBase}/country/${code}?format=json`;
    return this.http.get<any[]>(url);
  }
}
