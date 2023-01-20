import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import firebase from 'firebase/compat';
import UserCredential = firebase.auth.UserCredential;
import { AlertController } from '@ionic/angular';

import { AuthRoutesEnum, MainRoutesEnum } from '../../core/enums/routing.enums';
import { UserModel } from '../../core/interfaces/models';
import User = firebase.User;
import { UserActions } from '../../core/state/actions/user.actions';
import { UserState } from '../../core/state/reducers/user.reducer';

@Injectable()
export class AuthService {

  private authState$: Observable<any> = this.afAuth.authState;

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private alertController: AlertController,
    private store: Store<UserState>,
  ) {
  }

  isLoggedIn(): Observable<boolean> {
    return this.authState$.pipe(map(res => !!res));
  }

  get token(): Observable<string | null> {
    return this.afAuth.idToken;
  }

  /** Sign in with email/password */
  signIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => this.router.navigate([`${MainRoutesEnum.Pages}`]).then())
      .catch((error) => {
        this.alertController.create({
          header: 'Alert',
          subHeader: 'Important message',
          message: error.message,
          buttons: ['OK'],
        }).then((res) => res.present());
      });
  }

  /** Sign up with email/password */
  signUp(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result: UserCredential) => {
        this.sendVerificationMail().then();
        if (result.user) {
          this.addUser(result.user);
          this.router.navigate([`${MainRoutesEnum.Pages}`]).then();
        }
      })
      .catch((error) => {
        this.alertController.create({
          header: 'Alert',
          subHeader: 'Important message',
          message: error.message,
          buttons: ['OK'],
        }).then((res) => res.present());
      });
  }

  /** Send email verification when new user sign up */
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

  /** Adding new user data when sign up with username/password */
  addUser(user: User) {
    const payload: UserModel = {
      id: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? '',
      photoURL: user.photoURL ?? '',
      emailVerified: user.emailVerified,
    }
    this.store.dispatch(UserActions.addUser({ payload }));
  }

  /** Sign out */
  signOut() {
    return this.afAuth.signOut().then(() => this.router.navigate([`${MainRoutesEnum.Auth}/${AuthRoutesEnum.SignIn}`]));
  }
}
