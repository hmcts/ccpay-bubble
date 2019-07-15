import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fees-summary',
  templateUrl: './fees-summary.component.html',
  styleUrls: ['./fees-summary.component.scss']
})
export class FeesSummaryComponent implements OnInit {

  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
  }

  onGoBack() {
    return this.router.navigate(['/fee-search']);
  }
}
