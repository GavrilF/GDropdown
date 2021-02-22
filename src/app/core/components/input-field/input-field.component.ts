import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true
    }
  ]
})
export class InputFieldComponent implements OnInit, ControlValueAccessor {

  _value: string = '';
  disabled: boolean = false;

  private onChange: (value: string) => void = () => {};
  private onTouched  = () => {};

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) { }

  get value() {
    return this._value;
  }
  set value(v: any) {
    this._value = v;
    this.onChange(v);
  }

  ngOnInit(): void {
  }
  
  writeValue(value: string): void {
    if(value !== this._value){
      this._value = value;
    }
    this.changeDetectorRef.detectChanges();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  removeValue(){
    this.value = '';
  }

}
