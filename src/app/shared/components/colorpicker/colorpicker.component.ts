import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import iro from '@jaames/iro';
import { IroColorPicker } from '@jaames/iro/dist/ColorPicker';

@Component({
  selector: 'app-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss'],
})
export class ColorpickerComponent implements OnInit {
  @Input() color = '#fff';
  @Input() width = 320;
  @Output() changeColor = new EventEmitter<string>();

  colorPicker!: IroColorPicker;

  ngOnInit() {
    this.colorPicker = iro.ColorPicker('#picker', { width: this.width, color: this.color });
    this.colorPicker.on('color:change', (color: any) => this.changeColor.emit(color.hexString));
  }
}
