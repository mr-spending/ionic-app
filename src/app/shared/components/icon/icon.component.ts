import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  @Input() size: 'small' | 'normal' | 'large' = 'normal';
  @Input() iconColor = '#000000';
  @Input() iconName!: string
  @Input() backgroundColor!: string

}
