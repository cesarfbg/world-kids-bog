import { Component } from '@angular/core';
import { Router, ActivationEnd, RouterEvent } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html'
})

export class BreadcrumbsComponent {

  lastCrumb: string;

  constructor( private router: Router, private pageTitle: Title ) {
    this.getRouterData().subscribe((data) => {
      this.lastCrumb = data.title;
      this.pageTitle.setTitle('Admin - ' + this.lastCrumb);
    });
  }

  getRouterData() {
    return this.router.events.pipe(
      filter( (event: any) => event instanceof ActivationEnd && event.snapshot.firstChild === null),
      filter( (event: any) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }

}
