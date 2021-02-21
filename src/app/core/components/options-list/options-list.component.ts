import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-options-list',
  templateUrl: './options-list.component.html',
  styleUrls: ['./options-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptionsListComponent implements OnInit {

  @Input() options: string[];
  @Input() selected: string;

  @Output() optionChange: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  isSelected(option: string){
    return option === this.selected;
  }

  onOptionSelect(option:string){
    this.optionChange.emit(option);
  }

}
