import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-privacy-notice-modal',
  templateUrl: './privacy-notice-modal.component.html',
  styleUrls: ['./privacy-notice-modal.component.scss'],
})
export class PrivacyNoticeModalComponent {
  @Input() confirmation: boolean = false;

  constructor(private modalCtrl: ModalController) { }

  cancel() {
    return this.modalCtrl.dismiss();
  }

  confirm() {
    return this.modalCtrl.dismiss(true);
  }
}
