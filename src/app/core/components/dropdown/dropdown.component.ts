import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {

  @Input() options: string[] = [];
  @Input() selectedOption: string;

  @Output() selectionChange: EventEmitter<string> = new EventEmitter();

  public inputValue = '';

  constructor() { 
  }

  ngOnInit(): void {
  }

  onInputChange(e: string){
    console.log(e)
  }

  onSelectionChange(option: string){
    this.selectionChange.emit(option);
  }

}
