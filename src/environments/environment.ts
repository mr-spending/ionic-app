// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
enum env {
  dev = 'http://localhost:3500/',
  prod = 'https://nest-api-git-develop-mr-spending.vercel.app/',
}

const baseUrl = env.dev;

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyAR15wj4FSFVL75gtPNSOYYSQuOovuo1KQ",
    authDomain: "mrspending-e9b8b.firebaseapp.com",
    databaseURL: "https://mrspending-e9b8b-default-rtdb.firebaseio.com",
    projectId: "mrspending-e9b8b",
    storageBucket: "mrspending-e9b8b.appspot.com",
    messagingSenderId: "642008186725",
    appId: "1:642008186725:web:6a09a0e246432a05a0ab8c",
    measurementId: "G-ZLMGMXP4KF"
  },
  monoBankApiUrl: 'https://api.monobank.ua/',
  baseUrl,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
