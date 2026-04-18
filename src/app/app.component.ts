import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { CountryService } from "./country.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Project';
  countries: any[] = [];
  selectedCountryCode: string | null = null;
  selectedCountry: any = null;
  manualCode: string = '';

  constructor(private http: HttpClient, private countryService: CountryService) {}

  ngOnInit(): void {
    const baseUrl = 'https://api.worldbank.org/V2/country?format=json';

    this.http.get<any[]>(`${baseUrl}&page=1`).subscribe({
      next: (data: any[]) => {

        if (!data || !data[0] || !data[1]) return;

        const totalPages = data[0].pages;
        const allCountries = [...data[1]];
        const requests = [];

        for (let page = 2; page <= totalPages; page++) {
          requests.push(this.http.get<any[]>(`${baseUrl}&page=${page}`));
        }

        if (requests.length === 0) {
          this.countries = allCountries;
          return;
        }

        forkJoin(requests).subscribe({
          next: (responses) => {
            responses.forEach(resp => {

              if (resp && resp[1]) {
                allCountries.push(...resp[1]);
              }
            });

            this.countries = allCountries;
            console.log('All countries loaded:', this.countries.length);
          },
        });
      },
    });
  }


  onCountryClick(code: string): void {
    const lowerCode = code.toLowerCase();
    this.selectedCountryCode = lowerCode;

    this.countryService.getCountryDetails(lowerCode.toUpperCase()).subscribe({
      next: (data) => {
        if (data && data[1] && data[1].length > 0) {
          this.selectedCountry = data[1][0];
        } else {
          this.selectedCountry = null;
        }
      },
    });
  }


}


