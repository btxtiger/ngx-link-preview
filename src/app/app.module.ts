import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxLinkPreviewModule } from '../../projects/ngx-link-preview/src/lib/ngx-link-preview.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent
  ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      NgxLinkPreviewModule
   ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
