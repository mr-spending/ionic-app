import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

const sharedModules = [
  FormsModule,
  ReactiveFormsModule,
  IonicModule
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
