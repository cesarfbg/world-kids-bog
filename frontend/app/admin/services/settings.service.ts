import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';
import ISettings from '../interfaces/settings.interface';

@Injectable({
  providedIn: 'root'
})

export class SettingsService {

  settings: ISettings = {
    theme: 'default'
  };

  constructor( @Inject(DOCUMENT) private document: Document ) {
    this.loadSettings();
    this.applySettings();
  }

  saveSettings() {
    localStorage.setItem('settings', JSON.stringify(this.settings));
    this.applySettings();
  }

  loadSettings() {
    if ( localStorage.getItem('settings') ) {
      this.settings = JSON.parse(localStorage.getItem('settings'));
    }
  }

  applySettings() {
    this.document.getElementById('admin-theme').setAttribute('href', `assets/css/colors/${this.settings.theme}.css`);
  }

}
