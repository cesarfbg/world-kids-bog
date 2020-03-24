import { Component } from '@angular/core';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-preferences',
  templateUrl: './account-preferences.component.html'
})

export class AccountPreferencesComponent {

  constructor( public settingsService: SettingsService ) {}

  changeTheme( theme: string ) {
    this.settingsService.settings.theme = theme;
    this.settingsService.saveSettings();
  }

}
