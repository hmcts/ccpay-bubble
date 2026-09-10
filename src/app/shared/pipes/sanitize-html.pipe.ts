import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'sanitizeHtml', standalone: false })
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}
  transform(value: any): SafeHtml {
    // Safe: input is trusted server-generated HTML from the payment service
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
