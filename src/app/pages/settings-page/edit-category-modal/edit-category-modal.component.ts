import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { CategoryModel } from '../../../core/interfaces/models';
import { categoryIcons } from '../../../core/constants/ion-icons.constants';
import { ActionsEnum } from '../../../core/enums/action-sheet.enums';

@Component({
  selector: 'app-edit-category-modal',
  templateUrl: './edit-category-modal.component.html',
  styleUrls: ['./edit-category-modal.component.scss'],
})
export class EditCategoryModalComponent implements OnInit{
  @Input() category: CategoryModel = { id: '', name: '', icon: { iconType: 'add-outline', background: '#808080' } };
  @Input() type!: ActionsEnum.Add | ActionsEnum.Edit;

  editMode: 'icon' | 'color' = 'icon';
  categoryIcons = categoryIcons;
  actionsEnum = ActionsEnum;

  formGroup!: FormGroup;

  constructor(private modalCtrl: ModalController, private fb: FormBuilder) { };

  ngOnInit() {
    this.formGroup = this.fb.group({
      categoryName: this.fb.control(this.category.name, Validators.required),
      iconType: this.fb.control(this.category.icon.iconType),
      background: this.fb.control(this.category.icon.background),
    });
  }

  changeMode(mode: 'icon' | 'color'): void {
    this.editMode = mode;
  }

  changeColor(color: string): void {
    this.formGroup.controls['background'].setValue(color);
  }

  iconClick(icon: string): void {
    this.formGroup.controls['iconType'].setValue(icon);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, ActionsEnum.Cancel);
  }

  confirm() {
    console.log({
      id: this.category.id,
      name: this.formGroup.value.categoryName,
      icon: {
        iconType: this.formGroup.value.iconType,
        background: this.formGroup.value.background
      }
    });
    return this.modalCtrl.dismiss(null, ActionsEnum.Confirm);
  }
}
