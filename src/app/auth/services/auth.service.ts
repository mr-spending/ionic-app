import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import UserCredential = firebase.auth.UserCredential;
import User = firebase.User;
import { TranslateService } from '@ngx-translate/core';

import { AuthRoutesEnum, MainRoutesEnum } from '../../core/enums/routing.enums';
import { UserModel } from '../../core/interfaces/models';
import { UserActions } from '../../core/state/actions/user.actions';
import { UserState } from '../../core/state/reducers/user.reducer';
import { AlertService } from '../../core/services/alert/alert.service';
import { LanguageEnum } from '../../core/constants/languages.constants';
import { AlertEnum } from '../../core/enums/alert.enums';
import { error } from 'console';

@Injectable()
export class AuthService {

  private authState$: Observable<any> = this.afAuth.authState;

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private alertService: AlertService,
    private store: Store<UserState>,
    private translate: TranslateService,
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
      .then((result) => {
        if (result.user) {
          this.store.dispatch(UserActions.setUserData({ userId: result.user.uid }));
          this.router.navigate([`${MainRoutesEnum.Pages}`]).then()
        }
      })
      .catch((error) => {
        this.alertService.showAlert(error.message);
      });
  }

  /** Sign in with google */
  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth
      .signInWithPopup(provider)
      .then((result)=>{
        if (result.user) {
          this.store.dispatch(UserActions.setUserData({ userId: result.user.uid }));
          this.router.navigate([`${MainRoutesEnum.Pages}`]).then()
        }
      })
      .catch((error)=>{
        this.alertService.showAlert(error.message);
      })  
  }

  /** Sign up with email/password */
  signUp(email: string, password: string, language: string, isPolicyAgreed: boolean) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result: UserCredential) => {
        this.sendVerificationMail().then();
        if (result.user) {
          this.addUser(result.user, language, isPolicyAgreed);
          this.router.navigate([`${MainRoutesEnum.Pages}`]).then();
        }
      })
      .catch((error) => {
        this.alertService.showAlert(error.message);
      });
  }

  /** Send email verification when new user sign up */
  sendVerificationMail() {
    return this.afAuth.currentUser.then((u: any) => u.sendEmailVerification());
  }

  /** Adding new user data when sign up with username/password */
  addUser(user: User, language: string, isPolicyAgreed: boolean) {
    const payload: UserModel = {
      id: user.uid,
      email: user.email ?? '',
      displayName: user.displayName ?? '',
      photoURL: user.photoURL ?? '',
      emailVerified: user.emailVerified,
      displayLanguage: language,
      categories: [],
      isPolicyAgreed
    }
    this.store.dispatch(UserActions.addUser({ payload }));
  }

  /** Change Email with current password **/

  changeEmail(currentEmail: string, newEmail: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(currentEmail, password)
      .then(() => {
        const user = firebase.auth().currentUser;
        if (!user) return;
        return user.updateEmail(newEmail)
          .then(() => {
            this.store.dispatch(UserActions.setUserEmail({ payload: newEmail }));
            return;
          })
          .catch((err) => this.alertService.showAlert(err.message));
      })
      .catch((error) => {
        this.alertService.showAlert(error.message);
      });
  }

  /** Change Password with current password **/

  changePassword(email: string, newPassword: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        const user = firebase.auth().currentUser;
        if (!user) return;
        return user.updatePassword(newPassword)
          .then(() => {
            this.alertService.showAlert(
              this.translate.instant(AlertEnum.PasswordHasBeenUpdatedText),
              this.translate.instant(AlertEnum.PasswordHasBeenUpdatedHeader),
            );
            return true;
          })
          .catch((err) => this.alertService.showAlert(err.message));
      })
      .catch((err) => {
        this.alertService.showAlert(err.message);
      });
  }

  /** Sign out */
  signOut() {
    return this.afAuth.signOut().then(() => this.router.navigate([`${MainRoutesEnum.Auth}/${AuthRoutesEnum.SignIn}`]));
  }
}
