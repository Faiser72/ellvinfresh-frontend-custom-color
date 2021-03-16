/*
   Authors : pvgroups
  Website : https://pvgroups.com/
  App Name : Ellvin Fresh
  Created : 1-jan-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://pvgroups.com/license
  Copyright and Good Faith Purchasers © 2020-present pvgroups.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('frame') public frame: ModalDirective;
  email: any = '';
  password: any = '';
  uid: any;
  umobile: any;
  id: any;
  mobile: any = '';
  resendCode: boolean;
  userCode: any = '';



  constructor(
    private router: Router,
    public util: UtilService,
    private api: ApiService,
    private navCtrl: Location
  ) { }

  ngOnInit(): void {
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

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
            this.router.navigate(['/home']);
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

  goToHome() {

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
              title: this.util.getString('Signed in successfully')
            });
            // this.router.navigate(['/home']);
            this.navCtrl.back();
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
}
