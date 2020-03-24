import { Component, OnInit } from '@angular/core';
import { SettingsService } from './services/settings.service';
declare function pluginsInit(): any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})

export class AdminComponent implements OnInit {

  constructor( public settingService: SettingsService ) {}

  ngOnInit(): void {
    pluginsInit();
  }

}
