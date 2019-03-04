import { Component,ViewChild, ElementRef, OnInit } from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { Storage  } from '@ionic/storage';
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

declare var google;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  currentMapTrack = null;

  isTracking = false;
  trackedRoute = [];
  previousTracks = [];
  map: GoogleMap;
  positionSubscription: Subscription;
  latitude: number;
  longitude: number;

  constructor(public navCtrl: NavController, private plt: Platform, private geolocation: Geolocation, private storage: Storage) { }

  ngOnInit() {
    //this.plt.ready().then(() => {
    this.getposition()

  }
  getposition(){
    this.loadHistoricRoutes();
    this.geolocation.getCurrentPosition().then(response =>{
      console.log(response)
      this.latitude = response.coords.latitude;
      this.longitude = response.coords.longitude;
      this.getMap();
    
    },e =>{
      console.log(e)
    })

  }
  getMap(){
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
    
    this.map = GoogleMaps.create('map_canvas',mapOptions)
    let marker: Marker = this.map.addMarkerSync({
      title: 'Inicio',
      icon: 'blue',
      animation: 'DROP',
      position: {
        
        lat: this.latitude,
        lng: this.longitude
      }
    });
  }

  loadHistoricRoutes() {
    this.storage.get('routes').then(data => {
      if (data) {
        this.previousTracks = data;
      }
    });
  }

  startTracking() {
    this.isTracking = true;
    this.trackedRoute = [];
 
    this.positionSubscription = this.geolocation.watchPosition()
      .pipe(
        filter((p) => p.coords !== undefined) //Filter Out Errors
      )
      .subscribe(data => {
        setTimeout(() => {
          this.trackedRoute.push({ lat: data.coords.latitude, lng: data.coords.longitude });
          this.redrawPath(this.trackedRoute);
        }, 0);
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
    //  this.currentMapTrack.setMap(this.map);
    }
  }

  stopTracking() {
    let newRoute = { finished: new Date().getTime(), path: this.trackedRoute };
    this.previousTracks.push(newRoute);
    this.storage.set('routes', this.previousTracks);
   
    this.isTracking = false;
    this.positionSubscription.unsubscribe();
    this.currentMapTrack=null;
  }
   
  showHistoryRoute(route) {
    this.redrawPath(route);
  }
}
