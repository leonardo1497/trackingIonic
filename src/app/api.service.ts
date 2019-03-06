import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  ref = firebase.database().ref();

  constructor() { }

  getAllList(): Observable<any>{
    let datos
    this.ref.on('value', response => {
      datos = snapshotToArray(response)
    })
    return datos
  }

  setLocation(latitude: any, longitude: any){
    let insert = this.ref.push();
    insert.set({ latitude: latitude, longitude: longitude })
  }

  removeLocations(){
    this.ref.remove();
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