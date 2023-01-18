import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appCustomCurrencyMask]'
})
export class CustomCurrencyDirective implements OnInit {

  @Input() decimal = '.';
  @Input() thousand = ',';
  constructor(private inputRef: ElementRef<HTMLIonInputElement>) {
  }



  @HostListener('input', ['$event.target.value'])
  onInput(): void {
    this.changeValue(this.inputRef.nativeElement.value);
  }

  ngOnInit(): void {
    this.changeValue(this.inputRef.nativeElement.value);
  }

  private changeValue(value: string | number | undefined | null): void {
    if (value == '' || !value) {
      return;
    }
    value = value + '';
    value = parseInt(value.replace(/[\D]+/g, ''));
    value = value + '';
    value = value.replace(/([0-9]{2})$/g, this.decimal + '$1');
    var parts = value.toString().split(this.decimal);
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousand);
    value = parts.join(this.decimal);
    this.inputRef.nativeElement.value = value;
  }

}

