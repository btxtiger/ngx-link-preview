import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxLinkPreviewComponent } from './components/ngx-link-preview/ngx-link-preview.component';
import { NgxLinkPreviewCacheService } from './services/ngx-link-preview-cache.service';

@NgModule({
   declarations: [NgxLinkPreviewComponent],
   exports: [NgxLinkPreviewComponent],
   imports: [CommonModule],
   providers: [NgxLinkPreviewCacheService]
})
export class NgxLinkPreviewModule {}
