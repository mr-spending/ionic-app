import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[mrCurrencyMask]'
})
export class MrCurrencyMaskDirective implements OnInit {
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
    if (!value) return;
    const pattern = /[0-9.,]/;
    value = value + '';
    value = parseInt(value.replace(/[\D]+/g, ''));
    value = value + '';
    value = value.replace(/([0-9]{2})$/g, this.decimal + '$1');
    let parts = value.toString().split(this.decimal);
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousand) || '0';
    value = parts.join(this.decimal);
    this.inputRef.nativeElement.value = pattern.test(value) ? value : value.slice(-1, 0);
  }
}
