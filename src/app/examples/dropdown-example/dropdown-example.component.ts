import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown-example',
  templateUrl: './dropdown-example.component.html',
  styleUrls: ['./dropdown-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownExampleComponent implements OnInit {

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) { }

  public towns: string[] = ['Sofia', 'New York', 'London', 'Paris', 'Dubai', 'Bangkok', 'Singapore', 'Seoul', 'Shanghai', 'Tokyo'];
  public currentlySelected = 'Sofia';

  ngOnInit(): void {

  }

  onSelect(selectedOption: string){
    this.currentlySelected = selectedOption;
    this.changeDetectorRef.detectChanges();
  }
  onAddOption(newOption: string){
    this.towns = [...this.towns,newOption];
    this.currentlySelected = newOption;
  }

}
