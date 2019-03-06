import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyBPlJ0wRd9dABwh-cA6sNnirWCQ0nSsUbE",
  authDomain: "gps-ionic-5f716.firebaseapp.com",
  databaseURL: "https://gps-ionic-5f716.firebaseio.com",
  projectId: "gps-ionic-5f716",
  storageBucket: "gps-ionic-5f716.appspot.com",
  messagingSenderId: "516411835654"
};


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    firebase.initializeApp(config);
  }
}
