import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const sharedModules = [
  FormsModule,
  ReactiveFormsModule
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
