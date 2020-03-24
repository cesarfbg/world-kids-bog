import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicComponent } from './public/public.component';
import { PageNotFoundComponent } from './shared/page-not-found.component';

const appRoutes: Routes = [
  {
    path: '',
    component: PublicComponent
  },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}
