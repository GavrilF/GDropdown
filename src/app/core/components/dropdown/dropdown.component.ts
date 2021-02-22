import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostListener, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export enum KEYBOARD_KEY {
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp'
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements OnInit, ControlValueAccessor {

  /**
   * @param option pass as a string the current selected option
   * 
   * This will set also a value for the input field
   */
  @Input() set selectedOption(option: string){
    this._selectedOption = option;
    this.inputValue = option;
  }
  get selectedOption(){
    return this._selectedOption;
  }

  /**
   * @param options Dropdown options to show represented as Array of strings
   * 
   * This setter is to coppy the options and set them to filteredOptions, this is in case we want to filter by text
   */

  @Input() set options (options: string[]){
    this._pristineOptions = options.slice();

    let currentOptions = [...options];
    if(this.shownCount){
      currentOptions = currentOptions.slice(-this.shownCount);
    }
    this.filteredOptions = currentOptions.slice();
  }
  get options(){
    return this._pristineOptions;
  }

  /**
   * Set how many entries will be showed (this will trim the )
   * By default it is set to undefined
   */
  @Input() set shownCount(count: number | undefined){
    this._snownCount = count
    if(count){
      this.filteredOptions = this._pristineOptions.slice(-count);
    }
  }
  get shownCount(){
    return this._snownCount;
  }

  /**
   * Emit when change is happening (keep in mind that the parent component should decide if the change is valid)
   * We dont changing the state of the selectedOption here (this is delgated to the parent);
   */
  @Output() selectionChange: EventEmitter<string> = new EventEmitter();

  /**
   * Emit creating of new option (this is happening when there is no highlighted option)
   * Same as selectionChange this component won't add the new option in the options Array, this is delegated to the parent
   */
  @Output() addOption: EventEmitter<string> = new EventEmitter();

  /**
   * Using that to pass to the input field a value that we will use on ngModelChange to filter by it
   */
  public inputValue = '';

  /**
   * filteredOptions are cloned _pristineOptions and filtered by this.inputValue
   */
  public filteredOptions: string[] = [];

  /**
   * Using this to pass external logic for open state to the popup directive.
   * Popup directive by default has opening behavior on click, but since we want to open/close on different scenarios (ArrowUp, ArrowDown, Enter, etc)
   * 
   * TODO: this can be extracted as an input so the dropdown can be passed a default open state; 
   */
  public isOpen = false;

  /**
   * Option that is highlighted, currently this is happening with ArrowDown, ArrowUp
   */
  public highlightedOption: string;


  
  /**
   * @private used for get/set this.selectedOption
   */
  private _selectedOption: string;

  /**
   * @private used for get/set this.options
   */
  private _pristineOptions: string[];


  /**
   * 
   * @private used for get/set this.shownCount
   */
  private _snownCount: number | undefined;

  /**
   * KeyboardEvent delegates based if key is ArrowDown/ArrowUp what option should be highlighted
   * Also if the dropdown is closed when the keypress is triggered , the dropdown will be opened
   */
  @HostListener('keydown', ['$event'])
    KeyboardEvent(event: KeyboardEvent){
      if(event.key === KEYBOARD_KEY.ArrowUp){
        if(!this.isOpen){
          this.isOpen = true;
        }
        this.selectPreviousOption();
      } else if (event.key === KEYBOARD_KEY.ArrowDown){
        if(!this.isOpen){
          this.isOpen = true;
        }
        this.selectNextOption();
      }
    };

  private onChange: (value: string) => void = () => {};
  private onTouched  = () => {};
  disabled: boolean = false;
  _value: string = '';

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) { 
  }

  ngOnInit(): void {
  }

  /**
   * This metod is used to set this.inputValue and to extract the filtedOptions based on that value
   * @param value This is method is called by ngModelChange when input field have changes
   * 
   */
  onInputChange(value: string){
    this.inputValue = value;
    this.highlightedOption = '';
    if(!this.isOpen){
      this.isOpen = true;
    }
    if(value){
      this.filteredOptions = this.options.filter(option => option.toLocaleLowerCase().includes(value.toLocaleLowerCase()));
    }else {
      this.filteredOptions = this.options;
    }
  }

  /**
   * broadcast change of the selectedOption and closing the dropdown
   * @param option Incoming option
   */
  onSelectionClicked(option: string){
    this.broadcastSelectionChange(option);
    this.isOpen = false;
    this.changeDetectorRef.detectChanges();
  }

  /**
   * This Fn emmit the new option (keep in mind that this component should not decide if the new option is valid), this is parent component responsibility
   * @param option option to emit
   */
  broadcastSelectionChange(option: string){
    this.writeValue(option);
  }

  /**
   * When enter key occurs if there is highlighted option, this is going to broadcast the highlighted option as new option
   * Or in case there is no highlighted option that means we need to add the text field value as new option
   * 
   * Closing the dropdown
   */
  onEnterPressed(){
    if(this.highlightedOption){
      this.broadcastSelectionChange(this.highlightedOption);
    }else if (this.inputValue){
      this.addOption.emit(this.inputValue);
    }
    this.isOpen = false;
  }

  /**
   * This method causing the highlighting of option going Top-To-Bottom
   * When reaching the bottom it will start from the top
   */
  selectNextOption(){
    if(this.filteredOptions?.length < 2){
      return
    }
    let currIndex = this.filteredOptions.findIndex(option => option === this.highlightedOption);

    if(currIndex + 1 > this.filteredOptions.length - 1){
      this.highlightedOption = this.filteredOptions[0];
    }else {
      this.highlightedOption = this.filteredOptions[currIndex+1];
    }
  }

  /**
   * This method causing the highlighting of option going Bottom-To-Top
   * When reaching the top it will start from the bottom
   */
  selectPreviousOption(){
    if(!this.filteredOptions.length){
      return
    }
    let currIndex = this.filteredOptions.findIndex(option => option === this.highlightedOption);

    if(currIndex - 1 < 0){
      this.highlightedOption = this.filteredOptions[this.filteredOptions.length-1];
    }else {
      this.highlightedOption = this.filteredOptions[currIndex-1];
    }
  }

  /**
   * When toggling this wil reset the highlightedOption
   */
  toggleOpen(){
    this.isOpen = !this.isOpen;
    this.highlightedOption = '';
  }

  /**
   * This is used in case the popup emmit a state change (happening on global click);
   * @param opened Emmitted from the popup state
   */
  onPopupToggled(opened: boolean) {
    if(opened !== this.isOpen){
      this.isOpen = opened;
    }
  }

    get value() {
      return this._value;
    }
    set value(v: any) {
      this._value = v;
      this.onChange(v);
    }

  //Coming from ControlValueAccesor
  writeValue(value: string): void {
    if(value !== this._value){
      this._value = value;
    }
    this.changeDetectorRef.detectChanges();
  }

  //Coming from ControlValueAccesor
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  //Coming from ControlValueAccesor
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  //Coming from ControlValueAccesor
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


}
