import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-preview-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.css']
})
export class PreviewDialogComponent implements OnInit {
  safeUrl!: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<PreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      content: string;         // base64 del comprobante
      contentType: string;     // MIME type, e.g. 'application/pdf' o 'image/png'
    }
  ) {}

  ngOnInit(): void {
    const url = `data:${this.data.contentType};base64,${this.data.content}`;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
