import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { NavController, Platform } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps/ngx';
import { ApiService } from '../api.service';
import * as firebase from 'firebase';

declare var google;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  currentMapTrack = null;
  ref = firebase.database().ref();

  firebaseData: any = [];
  map: GoogleMap;
  latitude: number = 16.778646322031687;
  longitude: number = -93.09776678555656;
  FinalLatitude: number = 16.778646322031687;
  FinalLongitude: number = -93.09776678555656;
  datosFirebase: any = [];

  constructor(
    public navCtrl: NavController,
  ) {
    this.ref.on('value', response => {
      this.datosFirebase = []
      let datos = snapshotToArray(response)
      if (datos.length > 0) {
        this.latitude = datos[0].latitude
        this.longitude = datos[0].longitude
        this.FinalLatitude = datos[datos.length-1].latitude
        this.FinalLongitude = datos[datos.length-1].longitude
        this.getMap()
        for (let dato of datos) {
          this.datosFirebase.push({ lat: dato.latitude, lng: dato.longitude })
          this.redrawPath(this.datosFirebase);
        }
      }
    })
  }

  ngOnInit() {
  }

  getMap() {
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: this.latitude,
          lng: this.longitude
        },

        zoom: 18,
        tilt: 30
      },
      controls: {
        compass: true,
        myLocationButton: true,
        myLocation: true,
        zoom: true,
        mapToolbar: true
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions)
    let marker: Marker = this.map.addMarkerSync({
      title: 'Inicio',
      icon: 'blue',
      animation: 'DROP',
      position: {

        lat: this.latitude,
        lng: this.longitude
      }
    });

    let markerFinal: Marker = this.map.addMarkerSync({
      title: 'Actual',
      icon: 'red',
      animation: 'DROP',
      position: {

        lat: this.FinalLatitude,
        lng: this.FinalLongitude
      }
    });
  }

  redrawPath(path) {
    if (this.currentMapTrack != null) {
      this.currentMapTrack = null;
    }

    if (path.length > 1) {
      this.currentMapTrack = this.map.addPolyline({
        points: path,
        color: '#ff00ff',
        width: 10,
        geodesic: true,

      })
    }
  }
}

export const snapshotToArray = snapshot => {
  let returnArr = [];
  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val()
    item.key = childSnapshot.key
    returnArr.push(item)
  });
  return returnArr
}