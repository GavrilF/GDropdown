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

  @Output() selectionChange: EventEmitter<string> = new EventEmitter();

  public inputValue = '';
  public filteredOptions: string[] = [];
  public isOpen = false;
  public highlightedOption: string;

  private _selectedOption: string;
  private _pristineOptions: string[];

  @HostListener('keydown', ['$event'])
    KeyboardEvent(event: KeyboardEvent){
      if(event.key === KEYBOARD_KEY.ArrowUp){
        this.selectPreviousOption();
      } else if (event.key === KEYBOARD_KEY.ArrowDown){
        this.selectNextOption();
      }
    };

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) { 
  }

  ngOnInit(): void {
  }

  onInputChange(e: string){
    this.inputValue = e;
    if(e){
      this.filteredOptions = this.filteredOptions.filter(option => option.toLocaleLowerCase().includes(e.toLocaleLowerCase()));
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
    if(this.filteredOptions.length){
      if(this.selectedOption != this.inputValue){
        this.broadcastSelectionChange(this.filteredOptions[0]);
      }
      this.isOpen = false;
    }
  }

  selectNextOption(){
    if(!this.filteredOptions.length){
      return
    }
    let currIndex = this.filteredOptions.findIndex(option => option === this.highlightedOption);

    if(currIndex + 1 > this.filteredOptions.length - 1){
      this.highlightedOption = this.filteredOptions[0];
      // this.broadcastSelectionChange(this.filteredOptions[0]);
    }else {
      this.highlightedOption = this.filteredOptions[currIndex+1];
      // this.broadcastSelectionChange(this.filteredOptions[currIndex+1]);
    }
  }

  selectPreviousOption(){
    if(!this.filteredOptions.length){
      return
    }
    let currIndex = this.filteredOptions.findIndex(option => option === this.highlightedOption);

    if(currIndex - 1 < 0){
      this.highlightedOption = this.filteredOptions[this.filteredOptions.length-1];
      // this.broadcastSelectionChange(this.filteredOptions[this.filteredOptions.length-1]);
    }else {
      this.highlightedOption = this.filteredOptions[currIndex-1];
      // this.broadcastSelectionChange(this.filteredOptions[currIndex-1]);
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
