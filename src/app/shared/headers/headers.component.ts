/*
   Authors : pvgroups
  Website : https://pvgroups.com/
  App Name : Ellvin Fresh
  Created : 1-jan-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://pvgroups.com/license
  Copyright and Good Faith Purchasers © 2020-present pvgroups.
*/
import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { ModalDirective } from 'angular-bootstrap-md';
import Swal from 'sweetalert2';
import { Location, } from '@angular/common';
import {AgmMap,MapsAPILoader  } from '@agm/core';  
import { AgmCoreModule } from "@agm/core";
import { Observable } from 'rxjs';
import { interval, Subscription } from 'rxjs';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeadersComponent implements OnInit {
  @ViewChild('cityModal') public cityModal: ModalDirective;
  @ViewChild('loginModal') public loginModal: ModalDirective;
  @ViewChild('frame') public frame: ModalDirective;
  @ViewChild('showPrivacyPop', {static: false}) 

  public privacyPopup: TemplateRef<any>;
  subscription: Subscription;
  source = interval(10000);
  cities: any[] = [];
  cityName: any = '';
  dummy = Array(5);
  id: any;
  coupon:any;
  clicked: boolean;
  terms: any = '';
  products: any[] = [];
  lngId: any;
  dummyLang = Array(5);
  langs: any[] = [];

  email: any = '';
  password: any = '';
  uid: any;
  umobile: any;
  mobile: any = '';
  resendCode: boolean;
  userCode: any = '';
  showOtp: boolean = false;

  //  For google map
  zoom;
  lat;
  lng;
  getAddress;
  cityArray=[];
  addressdata="My Location";
  closeResult: string;

  // userdetails
  fname: string;
  lname: string;

  public searchs:any = '';
  locked: any[] = [];

  constructor(
    private router: Router,
    public util: UtilService,
    public api: ApiService,
    public cart: CartService,
    private navCtrl: Location,
    private apiloader: MapsAPILoader,
    private modalService: NgbModal
  ) {
    this.getLangs();
    const lng = localStorage.getItem('language');
    if (lng && lng != null && lng !== 'null') {
      this.lngId = lng;
    }
  }

  ngOnInit(){
    this.get();
    this.getProfile();
    this.api.get('seo/getCoupon').subscribe((data: any) => {
      console.log(data);
      // this.dummy = [];
      var coupons = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        coupons = data.data;
            this.coupon = coupons[0].code;
      } else {
        this.util.toast('error', this.util.getString('Error'), this.util.getString('No coupon found'));
      }
    }, error => {
      console.log('error', error);
      this.dummy = [];
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
    // this.addressdata = localStorage.getItem('location'); 
  }

  routeToHome(){
    this.router.navigate(['home']);
  }

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
                    this.subscription = this.source.subscribe(val => this.get());
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

  getLangName() {
    const lng = localStorage.getItem('language');
    if (lng && lng != null && lng !== 'null') {
      const lngs = this.langs.filter(x => x.file === lng);
      return lngs && lngs.length > 0 ? lngs[0].name : 'EN';
    }
    return 'EN';
  }


  goToRegister(){
    // console.log('cityModal');
    // this.loginModal.show();
    this.router.navigate(['./register']);
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

  getCities() {
    // localStorage.setItem('city');
    localStorage.removeItem('city');
    this.subscription.unsubscribe();
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

  selectedCity(item) {
    console.log(item);
    localStorage.setItem('city', item.id);
    window.location.reload();
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToLogin() {
    this.loginModal.show();
  }

  openPage(item) {
    const param: NavigationExtras = {
      queryParams: {
        category: item
      }
    };
    this.router.navigate(['categories'], param);
  }

  handleChange(event) {
    console.log(event);
  }

  goToHome(val) {
    this.router.navigate(['home']);
  }

  getAccount() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid !== 'null') {
      return true;
    }
    return false;
  }

  logout() {
    const city = localStorage.getItem('city');
    localStorage.clear();
    this.util.userInfo = null;
    localStorage.setItem('city', city);
    this.router.navigate(['']);
  }

  help() {
    this.router.navigate(['help']);
  }

  faq() {
    this.router.navigate(['faq']);
  }

  login() {
    console.log('login');
    this.loginModal.show();
  }

  myaccount() {
    this.router.navigate(['account']);
  }

  myOrders() {
    this.router.navigate(['orders']);
  }

  home() {
    this.router.navigate(['']);
  }

  selected(item) {
    console.log('id', this.id);
    this.id = item.id;
    this.clicked = true;
    localStorage.setItem('city', this.id);
    const city = this.cities.filter(x => x.id === this.id);
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

  inputChange() {
    // alert('hi');
    console.log(this.terms);
    if (this.terms) {
    } else {
      this.products = [];
    }
  }

  openProduct(item) {
    this.products = [];
    this.terms = '';
    this.router.navigate(["product-detail"], { queryParams: {id : item.id}});
  }

  search(event) {
    console.log(event);
    if (event && event !== '') {
      const param = {
        id: localStorage.getItem('city'),
        search: event
      };
     // this.util.start();
      this.api.post('products/getSearchItems', param).subscribe((data: any) => {
        console.log('search data==>', data);
        //this.util.stop();
        if (data && data.status === 200 && data.data) {

          this.products = data.data;
          this.locked=data.data;
          console.log(this.locked,'lockeddddddddd');
          
        }
      }, error => {
        console.log('error in searhc filess--->>', error);
       // this.util.stop();
        // this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
      });
    }
  }

  goChat() {
    this.router.navigate(['chats']);
  }

  openModal(a,b){
console.log(a,'aaaaaaaaa');
console.log(b,'bbbbb');


  }

  // login changes 

  sendOTP() {
    const message = this.util.getString('Your Ellvin Fresh app verification code :');
    const param = {
      msg: message,
      to: this.mobile
    };
    this.util.start();
    this.api.post('users/twilloMessage', param).subscribe((data: any) => {
      this.id = data.data.id;
      this.util.stop();
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  refresh(): void {
    window.location.reload();
  }
  continue() {
    if (this.userCode === '' || !this.userCode) {
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Not valid code'));
      return false;
    }
    if (this.userCode) {
      const param = {
        id: this.id,
        otp: this.userCode
      };
      this.util.start();      
      this.api.post('users/verifyOTP', param).subscribe((data: any) => {
        if (data && data.status === 200) {
          const params = {
            status: 1,
            id: this.uid
          };
          this.api.post('users/edit_profile', params).subscribe((data: any) => {
            this.util.stop();
            localStorage.setItem('uid', this.uid);
            const Toast = Swal.mixin({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              }
            });

            Toast.fire({
              icon: 'success',
              title: this.util.getString('Signed in successfully')
            });
            this.refresh();
          }, error => {
            this.util.stop();
            console.log(error);
            this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
          });
        } else {
          this.util.stop();
          if (data && data.status === 500 && data.data && data.data.message) {
            // this.util.errorToast(data.data.message);
            this.util.toast('error', this.util.getString('Error'), data.data.message);
            return false;
          }
          this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
          return false;
        }
      }, error => {
        this.util.stop();
        console.log(error);
        this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
      });
    } else {
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Not valid code'));
      return false;
    }
  }

  userLogin() {
    if (!this.mobile) {
      this.util.toast('error', this.util.getString('Error'), this.util.getString('All Fields are required'));
      return false;
    }
    const param = {
      mobile: this.mobile
    };
    this.util.start();
    this.api.post('users/login', param).subscribe((data: any) => {
      this.util.stop();
      if (data && data.status === 200) {
        if (data && data.data && data.data.type === 'user') {
          if (this.util.twillo === '1') {
            this.uid = data.data.id;
            this.mobile = data.data.mobile
            this.sendOTP();
            this.frame.show();
            setTimeout(() => {
              this.resendCode = true;
            }, 30000);
          } else if (data.data.status === '1') {
            localStorage.setItem('uid', data.data.id);
            this.util.userInfo = data.data;
            const Toast = Swal.mixin({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);                
              }
              
            });
            Toast.fire({
              icon: 'success',
              title: this.util.getString('Signed in successfully'),
            });            
            console.log('me yaha hu', data)
            
            // this.router.navigate(['/home']);
            // this.navCtrl.back();
          } else {
            Swal.fire({
              title: this.util.getString('Error'),
              text: this.util.getString('Your are blocked please contact administrator'),
              icon: 'error',
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: this.util.getString('Need Help?'),
              backdrop: false,
              background: 'white'
            }).then(status => {
              if (status && status.value) {
                localStorage.setItem('helpId', data.data.id);
                this.router.navigate(['inbox']);
              }
            });
          }
        } else {

          this.util.toast('error', this.util.getString('Error'), this.util.getString('Not valid user'));
          this.email = '';
          this.password = '';
        }
      } else if (data && data.status === 500) {
        this.util.toast('error', this.util.getString('Error'), data.data.message);

      } else {
        this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));

      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
    });
  }

  reset() {
    this.router.navigate(['reset']);
  }

  onOtpChange(event) {
    console.log(event);
    this.userCode = event;
  }
  resend() {
    this.sendOTP();
  }
  // end of login changes 

  getProfile() {
    const param = {
      id: localStorage.getItem('uid')
    };
    this.util.start();
    this.api.post('users/getById', param).subscribe((data: any) => {
      this.util.stop();
      if (data && data.status === 200 && data.data && data.data.length) {
        const info = data.data[0];
        this.util.userInfo = info;
        this.fname = info.first_name;
        this.lname = info.last_name;
      }
    }, error => {
      console.log(error);
      this.util.stop();
    });
  }
}
