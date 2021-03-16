import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
 // addressModal
 @ViewChild('addressModal') public addressModal: ModalDirective;
 currentDiv: any;
 dummy: any[] = [];
 orders: any[] = [];
 myaddress: any[] = [];
 fname: any;
 lname: any;
 mobile: any;
 email: any;
 profile: any;

 newAddress: boolean;

 lat: any;
 lng: any;
 address: any = '';
 house: any = '';
 landmark: any = '';
 title: any = 'home';
 pincode: any = '';
 id: any;

 constructor(
   private router: Router,
   public util: UtilService,
   public api: ApiService,
 ) {
   this.currentDiv = 1;
   this.getOrders();
 }

 ngOnInit(): void {
 }
 openProfile() {
   this.router.navigate(['/account']);
 }
 goChat() {
   this.router.navigate(['chats']);
 }
 change_number(){
   this.router.navigate(['/change-number']);
 }
 goToAddress() {
   this.currentDiv = 2;
   this.getAddress();
 }
 addNewAddress() {
   this.newAddress = true;
   this.landmark = '';
   this.lat = '';
   this.lng = '';
   this.title = '';
   this.house = '';
   this.pincode = '';
   this.address = '';
   this.id = '';
   this.addressModal.show();
 }

 updateAddress(info) {
   console.log(info);
   this.newAddress = false;
   this.id = info.id;
   this.address = info.address;
   this.pincode = info.pincode;
   this.house = info.house;
   this.landmark = info.landmark;
   this.lat = info.lat;
   this.lng = info.lng;
   this.title = info.title;
   this.addressModal.show();
 }

 actionAddress() {

   if (this.newAddress) {
     console.log('new address');
     if (this.address === '' || this.landmark === '' || this.house === '' || this.pincode === '' || this.title === '') {
       this.util.toast('error', this.util.getString('Error'), 'All Fields are required');
       return false;
     }
     if (!this.lat || this.lat === '' || !this.lng || this.lng === '') {
       this.addressModal.hide();
       const geocoder = new google.maps.Geocoder;
       geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results, status) => {
         console.log(results, status);
         if (status === 'OK' && results && results.length) {
           this.lat = results[0].geometry.location.lat();
           this.lng = results[0].geometry.location.lng();
           console.log('----->', this.lat, this.lng);
           console.log('call api');
           this.util.start();
           const param = {
             uid: localStorage.getItem('uid'),
             address: this.address,
             lat: this.lat,
             lng: this.lng,
             title: this.title,
             house: this.house,
             landmark: this.landmark,
             pincode: this.pincode
           };
           this.api.post('address/save', param).subscribe((data: any) => {
             this.util.stop();
             this.landmark = '';
             this.lat = '';
             this.lng = '';
             this.title = '';
             this.house = '';
             this.pincode = '';
             this.address = '';
             if (data && data.status === 200) {
               // this.navCtrl.back();
               this.getAddress();
               // this.util.showToast('Address added', 'success', 'bottom');
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
                 title: 'Address added'
               });
             } else {
               this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
             }
           }, error => {
             console.log(error);
             this.util.stop();
             this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
           });
         } else {
           this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
           return false;
         }
       });
     }
   } else {
     console.log('update address');
     if (this.address === '' || this.landmark === '' || this.house === '' || this.pincode === '' || this.title === '') {
       this.util.toast('error', this.util.getString('Error'), 'All Fields are required');
       return false;
     }
     this.addressModal.hide();
     const geocoder = new google.maps.Geocoder;
     geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results, status) => {
       console.log(results, status);
       if (status === 'OK' && results && results.length) {
         this.lat = results[0].geometry.location.lat();
         this.lng = results[0].geometry.location.lng();
         console.log('----->', this.lat, this.lng);
         console.log('call api');
         this.util.start();
         const param = {
           uid: localStorage.getItem('uid'),
           address: this.address,
           lat: this.lat,
           lng: this.lng,
           title: this.title,
           house: this.house,
           landmark: this.landmark,
           pincode: this.pincode,
           id: this.id
         };
         this.api.post('address/editList', param).subscribe((data: any) => {
           this.util.stop();
           this.landmark = '';
           this.lat = '';
           this.lng = '';
           this.title = '';
           this.house = '';
           this.pincode = '';
           this.address = '';
           if (data && data.status === 200) {
             // this.navCtrl.back();
             this.getAddress();
             // this.util.showToast('Address added', 'success', 'bottom');
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
               title: 'Address added'
             });
           } else {
             this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
           }
         }, error => {
           console.log(error);
           this.util.stop();
           this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
         });
       } else {
         this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
         return false;
       }
     });
   }
 }

 deleteAddress(item) {
   console.log(item);
   Swal.fire({
     title: 'Are you sure',
     text: 'to delete this address',
     icon: 'error',
     showConfirmButton: true,
     showCancelButton: true,
     confirmButtonText: 'Delete',
     backdrop: false,
     background: 'white'
   }).then(status => {
     if (status && status.value) {
       console.log('delete');
       const param = {
         id: item.id
       };
       this.util.start();
       this.api.post('address/deleteList', param).subscribe(info => {
         console.log(info);
         this.util.stop();
         this.getAddress();
       }, error => {
         console.log(error);
         this.util.stop();
         this.util.toast('error', 'Erro', 'Something went wrong');
       });
     }
   });
 }
 getAddress() {
   const param = {
     id: localStorage.getItem('uid')
   };
   this.myaddress = [];
   this.util.start();
   this.api.post('address/getByUid', param).subscribe((data: any) => {
     console.log(data);
     this.util.stop();
     if (data && data.status === 200 && data.data.length) {
       this.myaddress = data.data;
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
 logout() {
   const city = localStorage.getItem('city');
   localStorage.clear();
   this.util.userInfo = null;
   localStorage.setItem('city', city);
   this.router.navigate(['']);
 }

 getOrders() {
   this.dummy = Array(15);
   this.orders = [];
   const param = {
     id: localStorage.getItem('uid')
   };
   this.api.post('orders/getByUid', param).subscribe((data: any) => {
     console.log(data);
     this.dummy = [];
     if (data && data.status === 200 && data.data.length > 0) {
       // this.orders = data.data;
       const orders = data.data;
       orders.forEach(element => {
         if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
           element.orders = JSON.parse(element.orders);
           element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
           element.orders.forEach(order => {
             console.log(element.id, '=>', order.variations);
             if (order.variations && order.variations !== '' && typeof order.variations === 'string') {
               console.log('strings', element.id);
               order.variations = JSON.parse(order.variations);
               console.log(order['variant']);
               if (order["variant"] === undefined) {
                 order['variant'] = 0;
               }
             }
           });
         }
       });
       this.orders = orders;
       console.log('orderss==>?', this.orders);
     }
   }, error => {
     console.log(error);
     this.dummy = [];
     this.orders = [];
     this.util.toast('error', this.util.getString('Error'), this.util.getString('Something went wrong'));
   });
 }

 goToOrder(item) {

   console.log(item);
   const param: NavigationExtras = {
     queryParams: {
       id: item.id
     }
   };
   this.router.navigate(['/order-detail'], param);
 }

 goToOrderDetail() {
   this.router.navigate(['/order-detail']);
 }

 goToTracker() {
   this.router.navigate(['/tracker']);
 }

 goSupport() {
   this.router.navigate(['support']);
 }


}
