import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true,
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    // Validamos que sea un data URL permitido (PDF o imagen base64)
    const allowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    const regex = /^data:([a-zA-Z0-9\-\/\.]+);base64,/;

    const match = url.match(regex);
    if (!match || !allowedMimeTypes.includes(match[1])) {
      throw new Error('URL no segura o tipo MIME no permitido');
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
