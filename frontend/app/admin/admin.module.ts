import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin.routes';
import { AdminComponent } from './admin.component';
import { SharedModule } from './shared/shared.module';
import { PagesModule } from './pages/pages.module';

@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PagesModule,
    AdminRoutingModule
  ]
})

export class AdminModule {}
