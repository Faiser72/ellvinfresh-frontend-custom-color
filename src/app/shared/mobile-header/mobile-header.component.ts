/*
   Authors : pvgroups
  Website : https://pvgroups.com/
  App Name : Ellvin Fresh
  Created : 1-jan-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://pvgroups.com/license
  Copyright and Good Faith Purchasers © 2020-present pvgroups.
*/
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import {AgmMap,MapsAPILoader  } from '@agm/core';  
import { AgmCoreModule } from "@agm/core";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss']
})
export class MobileHeaderComponent implements OnInit {
  cities: any[] = [];
  cityName: any = '';
  dummy = Array(5);
  id: any;
  clicked: boolean;
  lngId: any;
  dummyLang = Array(5);
  langs: any[] = [];

  //  For google map
  zoom;
  lat;
  lng;
  getAddress;
  cityArray=[];
  addressdata="My Location";

  constructor(
    private router: Router,
    public util: UtilService,
    public api: ApiService,
    public cart: CartService,
    private apiloader: MapsAPILoader
  ) {
    // this.getCities();
    this.getLangs();
    const lng = localStorage.getItem('language');
    if (lng && lng != null && lng !== 'null') {
      this.lngId = lng;
    }
  }

  getLangName() {
    const lng = localStorage.getItem('language');
    if (lng && lng != null && lng !== 'null') {
      const lngs = this.langs.filter(x => x.file === lng);
      return lngs && lngs.length > 0 ? lngs[0].name : 'EN';
    }
    return 'EN';
  }

  getLangFlag() {
    const lng = localStorage.getItem('language');
    if (lng && lng != null && lng !== 'null') {
      const lngs = this.langs.filter(x => x.file === lng);
      return lngs && lngs.length > 0 ? this.api.mediaURL + lngs[0].cover : 'assets/imgs/en.png';
    }
    return 'assets/imgs/en.png';
  }

  changed(value) {
    this.lngId = value;
    console.log(this.lngId);
    const item = this.langs.filter(x => x.file === this.lngId);
    if (item && item.length > 0) {
      this.util.direction = item[0].positions === '1' ? 'ltr' : 'rtl';
      document.documentElement.dir = this.util.direction;
      localStorage.setItem('language', this.lngId);
      window.location.reload();
    }
  }

  getLangs() {
    this.api.get('lang').subscribe((data: any) => {
      console.log('---------------------------------------------------', data);
      this.dummyLang = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        this.langs = data.data.filter(x => x.status === '1');
      }
    }, error => {
      console.log('error', error);
      this.dummyLang = [];
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  ngOnInit(): void {
      this.get();
  }

  // getCities() {
  //   this.api.get('cities').subscribe((data: any) => {
  //     console.log(data);
  //     this.dummy = [];
  //     if (data && data.status === 200 && data.data && data.data.length) {
  //       this.cities = data.data.filter(x => x.status === '1');
  //       const id = localStorage.getItem('city');
  //       if (id && id !== null && id !== 'null') {
  //         this.id = id;
  //         const city = this.cities.filter(x => x.id === this.id);
  //         this.util.city = city[0];
  //         this.cityName = city[0].name;
  //       } else {
  //         this.id = this.cities[0].id;
  //         localStorage.setItem('city', this.id);
  //         this.cityName = this.cities[0].name;
  //       }
  //     } else {
  //       this.util.toast('error', this.util.getString('Error'), this.util.getString('No cities found'));
  //     }
  //   }, error => {
  //     console.log('error', error);
  //     this.dummy = [];
  //     this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
  //   });
  // }

  get(){
    if (navigator.geolocation) {
      console.log('*************************************************');
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
 
          this.apiloader.load().then(() => {  
          
              let geocoder = new google.maps.Geocoder;  
              let latlng = {  
                  lat: this.lat,  
                  lng: this.lng  
              };  
              geocoder.geocode({  
                  'location': latlng 
              }, (results =>{

              
            
                    console.log(results);
                    var add= results[0].formatted_address;
                    var  value=add.split(",");
                    let count=value.length;
                    let country=value[count-1];
                    let state=value[count-2];
                    let city=value[count-3];
                    let state2 = state.split(" ",2);
                    const cityName = city + ', ' +state2[1];
                    this.addressdata = cityName;
                    // this.subscription = this.source.subscribe(val => this.get());
                    this.getCities();
              })
          )})


        }
      },
        (error) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  getCities() {
    // localStorage.setItem('city');
    localStorage.removeItem('city');
    this.api.get('cities').subscribe((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        this.cities = data.data.filter(x => x.status === '1');
        this.cityArray = [];

        if (navigator.geolocation) {  
          navigator.geolocation.getCurrentPosition((position) => {  
              if (position) { 
                  this.lat = position.coords.latitude;  
                  this.lng = position.coords.longitude; 
                  this.getAddress = (this.lat, this.lng)  
                  localStorage.setItem('latitude', this.lat);
                  localStorage.setItem('longitude', this.lng);
              }  
          },this.handleLocationError,{ enableHighAccuracy: true, maximumAge: 1500000, timeout: 0 })  
        }  

        this.cities.forEach(element => {
          var lat1: number = +localStorage.getItem('latitude');
          var lng1: number = +localStorage.getItem('longitude');
          var p1 = new google.maps.LatLng(lat1, lng1);
          var p2 = new google.maps.LatLng(element.lat, element.lng);
          var dis: number =  +(google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
          if(dis <= 10){
            this.cityArray.push(element);
          } 
          
        });
        
        if(this.cityArray.length >0){
          const id =  this.cityArray[0].id;
          if (id && id !== null && id !== 'null') {
            this.id = id;
            this.cityName = this.cityArray[0].name;
          }
          localStorage.setItem('cityavailable','true');
          localStorage.setItem('city', id);
          if(!localStorage.getItem('load')){
            localStorage.setItem('load','1');
          }
          if(localStorage.getItem('load') == '1'){
            localStorage.setItem('load','2');
            window.location.reload();
          }
         
        }

        if(localStorage.getItem('loadpopup') == '2' && (this.cityArray.length == 0)){
          localStorage.setItem('cityavailable','false');
            alert('Currently we are not serving at your location')
            
        }
        
        // if (id && id !== null && id !== 'null') {
        //   this.id = id;
        //   const city = this.cities.filter(x => x.id === this.id);
        //   if (city && city.length > 0) {
        //     this.util.city = city[0];
        //     this.cityName = city[0].name;
        //   }
        // }
      } else {
        this.util.toast('error', this.util.getString('Error'), this.util.getString('No cities found'));
      }
    }, error => {
      console.log('error', error);
      this.dummy = [];
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  
  handleLocationError(error) {
    switch (error.code) {
      case 3:
        break;
      case 2:
        // ...
        break;
      case 1:
      // ...
    }
  }

  selected(item) {
    console.log('id', this.id);
    this.id = item.id;
    this.clicked = true;
    localStorage.setItem('city', this.id);
    const city = this.cityArray.filter(x => x.id === this.id);
    this.util.city = city[0];
    this.cityName = city[0].name;
    this.util.publishCity(city);
    this.cart.cart = []; 
    this.cart.itemId = [];
    this.cart.totalPrice = 0;
    this.cart.grandTotal = 0;
    this.cart.coupon = null;
    this.cart.discount = null;
    this.util.clearKeys('cart');
    this.util.publishCity('data');
  }
}
