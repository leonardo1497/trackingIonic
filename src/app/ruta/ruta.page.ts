import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.page.html',
  styleUrls: ['./ruta.page.scss'],
})
export class RutaPage implements OnInit {
  isTracking = false;
  positionSubscription: Subscription;

  constructor(
    private geolocation: Geolocation,
    private api: ApiService,
    public backgroundMode: BackgroundMode,
    private platform: Platform

  ) {
   }

  ngOnInit() {
    this.platform.ready().then(() => {

      this.backgroundMode.enable();
      
    });
  }

  startTracking() {
    this.isTracking = true;
    this.api.removeLocations()
    this.getPosition();
    this.backgroundMode.on('activate').subscribe(() => {
      console.log('activated');
      this.getPosition();
    });

  }

  getPosition(){
    this.positionSubscription = this.geolocation.watchPosition()
    .pipe(
      filter((p) => p.coords !== undefined) //Filter Out Errors
    )
    .subscribe(data => {
      setTimeout(() => {
        console.log("Ey")
        this.api.setLocation(data.coords.latitude, data.coords.longitude)
      }, 0);
    });

  }
  stopTracking() {
    this.isTracking = false;
    this.positionSubscription.unsubscribe();
  }
}
