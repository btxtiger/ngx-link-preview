import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxLinkPreviewModule } from '../../projects/ngx-link-preview';


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
