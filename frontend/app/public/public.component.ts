import { Component, OnInit } from '@angular/core';

declare function pluginsInit(): any;

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html'
})

export class PublicComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    pluginsInit();
  }
}
