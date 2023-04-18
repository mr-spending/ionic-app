import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-privacy-notice-modal',
  templateUrl: './privacy-notice-modal.component.html',
  styleUrls: ['./privacy-notice-modal.component.scss'],
})
export class PrivacyNoticeModalComponent implements OnInit {
  @Input() confirmation: boolean = false;

  constructor(private modalCtrl: ModalController,) { }

  ngOnInit() {}

  cancel() {
    return this.modalCtrl.dismiss();
  }

  confirm() {
    return this.modalCtrl.dismiss(true);
  }
}
