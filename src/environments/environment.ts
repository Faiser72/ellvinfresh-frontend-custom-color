/*
   Authors : pvgroups
  Website : https://pvgroups.com/
  App Name : Ellvin Fresh
  Created : 1-jan-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://pvgroups.com/license
  Copyright and Good Faith Purchasers © 2020-present pvgroups.
*/
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,  
  baseURL: 'https://grocery.ellvinfresh.com/index.php/',
  // baseURL: 'http://localhost:8080/sms/index.php/',
  mediaURL: 'https://grocery.ellvinfresh.com/uploads/',
  onesignal: {
    appId: 'd9d6c621-8d9d-4a2f-9098-cfae13036d8b',
    googleProjectNumber: '888633870378',
    restKey: 'YmQ4OWYwNTEtZjlkMy00NzhhLTkyY2UtN2MwZWY0YjYyNTFm'
  },
  general: {
    symbol: '$',
    code: 'USD'
  },
  authToken: '123456789'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
