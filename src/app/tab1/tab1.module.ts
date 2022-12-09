import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    SharedModule
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
