import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-case-search',
  templateUrl: './case-search.component.html',
  styleUrls: ['./case-search.component.scss']
})
export class CaseSearchComponent implements OnInit {
  caseNumber: string;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  caseSearch(caseSearchForm): void {
    console.log('Search ccd case number: ', caseSearchForm.ccdCaseNumber);
    this.router.navigate([`/cases/${caseSearchForm.caseNumber}/payments`]);
  }
}
