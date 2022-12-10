import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat';
import { map, Observable } from 'rxjs';

@Injectable()
export class AuthService {

  private authState$: Observable<any> = this.afAuth.authState;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
  }

  isLoggedIn(): Observable<boolean> {
    return this.authState$.pipe(map(res => !!res));
  }

  /** Sign in with email/password */
  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        this.setUserData(result.user).then();
        this.router.navigate(['tabs/tab1']).then();
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  /** Sign up with email/password */
  signUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.sendVerificationMail().then();
        this.setUserData(result.user).then();
        this.router.navigate(['tabs/tab1']).then();
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  /** Send email verfificaiton when new user sign up */
  sendVerificationMail() {
    return this.afAuth.currentUser.then((u: any) => u.sendEmailVerification());
  }
  // // Reset Forggot password
  // ForgotPassword(passwordResetEmail: string) {
  //   return this.afAuth
  //     .sendPasswordResetEmail(passwordResetEmail)
  //     .then(() => {
  //       window.alert('Password reset email sent, check your inbox.');
  //     })
  //     .catch((error) => {
  //       window.alert(error);
  //     });
  // }
  // // Returns true when user is looged in and email is verified
  // get isLoggedIn(): boolean {
  //   const user = JSON.parse(localStorage.getItem('user')!);
  //   return user !== null && user.emailVerified !== false ? true : false;
  // }
  // // Sign in with Google
  // GoogleAuth() {
  //   return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
  //     this.router.navigate(['dashboard']);
  //   });
  // }
  // // Auth logic to run auth providers
  // AuthLogin(provider: any) {
  //   return this.afAuth
  //     .signInWithPopup(provider)
  //     .then((result) => {
  //       this.router.navigate(['dashboard']);
  //       this.SetUserData(result.user);
  //     })
  //     .catch((error) => {
  //       window.alert(error);
  //     });
  // }

  /** Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: any = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    localStorage.setItem('uid', user.uid);
    return userRef.set(userData, {
      merge: true,
    });
  }

  /** Sign out */
  signOut() {
    return this.afAuth.signOut().then(() => this.router.navigate(['auth/sign-in']));
  }
}
