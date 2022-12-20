import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

const sharedModules = [
  FormsModule,
  ReactiveFormsModule,
  IonicModule,
  TranslateModule,
];

@NgModule({
  declarations: [],
  imports: [
    ...sharedModules,
    CommonModule,
  ],
  exports: [
    ...sharedModules,
  ]
})
export class SharedModule { }
