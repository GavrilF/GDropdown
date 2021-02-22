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
  @Input() focused: string;

  @Output() optionChange: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Used for styles in the template
   */
  isSelected(option: string){
    return option === this.selected;
  }

  /**
   * Used for styles in the template
   */
  isFocused(option: string) {
    return option === this.focused;
  }

  onOptionSelect(option:string){
    this.optionChange.emit(option);
  }

}
