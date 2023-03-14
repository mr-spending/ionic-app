import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CategoryModel } from '../../../core/interfaces/models';
import { categoryIcons } from '../../../core/constants/ion-icons.constants';
import { ActionsEnum } from '../../../core/enums/action-sheet.enums';

@Component({
  selector: 'app-edit-category-modal',
  templateUrl: './edit-category-modal.component.html',
  styleUrls: ['./edit-category-modal.component.scss'],
})
export class EditCategoryModalComponent {
  @Input() category: CategoryModel = { id: '', name: '', icon: { iconType: 'add-outline', background: '#808080' } };
  @Input() type!: ActionsEnum.Add | ActionsEnum.Edit;

  editMode: 'icon' | 'color' = 'icon';
  categoryIcons = categoryIcons;
  actionsEnum = ActionsEnum;

  formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({ categoryName: this.fb.control(null) });
  }

  changeMode(mode: 'icon' | 'color'): void {
    this.editMode = mode;
  }

  changeColor(color: string): void {
    this.category.icon.background = color;
  }

  iconClick(icon: string): void {
    this.category.icon.iconType = icon;
  }

  cancel(): void { }

  confirm(): void { console.log({ ...this.category, name: this.formGroup.value.categoryName }) }
}
