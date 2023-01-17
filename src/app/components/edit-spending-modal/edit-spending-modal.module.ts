import { NgModule } from '@angular/core';

import { EditSpendingModalComponent } from './edit-spending-modal.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [EditSpendingModalComponent]
})
export class EditSpendingModalModule {}
