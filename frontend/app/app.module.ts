import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { AppRoutingModule } from './app.routes';
import { PublicComponent } from './public/public.component';
import { PageNotFoundComponent } from './shared/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PublicComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AdminModule,
    HttpClientModule,
    AppRoutingModule
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule {}
