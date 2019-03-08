import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

import { Platform } from '@ionic/angular';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation/ngx';
@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.page.html',
  styleUrls: ['./ruta.page.scss'],
})

export class RutaPage implements OnInit {
  isTracking = false;


  constructor(
    private api: ApiService,
    private platform: Platform,
    private backgroundGeolocation: BackgroundGeolocation,
    ) {
   }

  ngOnInit() {
   this.platform.ready().then(() => {
     this.backgroundGeolocation.checkStatus().then((status)=>{
      if(status.isRunning){
        this.isTracking=true;
      }

     })

      const config: BackgroundGeolocationConfig =  {
        notificationTitle: 'Rastreo ejecutandose',
        notificationText: 'Activo',
        desiredAccuracy: 50,
        stationaryRadius: 1,
        distanceFilter: 1,
        debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: true, // enable this to clear background location settings when the app terminates

      };
      this.backgroundGeolocation.configure(config).then(() => {
        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe(
        (location: BackgroundGeolocationResponse)=>{
          this.api.setLocation(location.latitude, location.longitude)

      })
     })

    });
  }



  startTracking() {
    this.api.removeLocations();
    this.isTracking = true;
    this.backgroundGeolocation.start().then(()=>{
      console.log("activado")

    })


  }


  stopTracking() {
    this.isTracking = false;
    this.backgroundGeolocation.stop().then(()=>{
      console.log("stopeado")
    })
    this.api.removeLocations();
  }
}