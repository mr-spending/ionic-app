import { NgModule } from '@angular/core';

import { CategoriesPageRoutingModule } from './categories-page-routing.module';
import { CategoriesPage } from './categories.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    CategoriesPageRoutingModule
  ],
  declarations: [CategoriesPage]
})
export class CategoriesPageModule {}
