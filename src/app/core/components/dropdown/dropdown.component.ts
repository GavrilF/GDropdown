import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

export enum KEYBOARD_KEY {
  ArrowDown = 'ArrowDown',
  ArrowUp = 'ArrowUp'
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent implements OnInit {

  @Input() set selectedOption(option: string){
    this._selectedOption = option;
    this.inputValue = option;
  }
  get selectedOption(){
    return this._selectedOption;
  }
  @Input() set options (options: string[]){
    this.filteredOptions = options;
    this._pristineOptions = options;
  }
  get options(){
    return this._pristineOptions;
  }

  @Output() selectionChange: EventEmitter<string> = new EventEmitter();
  @Output() addOption: EventEmitter<string> = new EventEmitter();

  public inputValue = '';
  public filteredOptions: string[] = [];
  public isOpen = false;
  public highlightedOption: string;

  private _selectedOption: string;
  private _pristineOptions: string[];

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

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) { 
  }

  ngOnInit(): void {
  }

  onInputChange(e: string){
    this.inputValue = e;
    if(!this.isOpen){
      this.isOpen = true;
    }
    if(e){
      this.filteredOptions = this.options.filter(option => option.toLocaleLowerCase().includes(e.toLocaleLowerCase()));
    }else {
      this.filteredOptions = this._pristineOptions;
    }
  }

  onSelectionClicked(option: string){
    this.broadcastSelectionChange(option);
    this.isOpen = false;
    this.changeDetectorRef.detectChanges();
  }

  broadcastSelectionChange(option: string){
    this.selectionChange.emit(option);
  }

  onEnterPressed(){
    if(this.highlightedOption){
      this.broadcastSelectionChange(this.highlightedOption);
    }else if (this.inputValue){
      this.addOption.emit(this.inputValue);
    }
    this.isOpen = false;
  }

  selectNextOption(){
    if(!this.filteredOptions.length){
      return
    }
    let currIndex = this.filteredOptions.findIndex(option => option === this.highlightedOption);

    if(currIndex + 1 > this.filteredOptions.length - 1){
      this.highlightedOption = this.filteredOptions[0];
    }else {
      this.highlightedOption = this.filteredOptions[currIndex+1];
    }
  }

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

  toggleOpen(){
    this.isOpen = !this.isOpen;
    this.highlightedOption = '';
  }

  onPopupToggled(opened: boolean) {
    if(opened !== this.isOpen){
      this.isOpen = opened;
    }
  }

}
