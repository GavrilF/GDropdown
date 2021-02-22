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

  /**
   * Sets the incoming selected option as selectedOption, this method decides if the incoming selection should be set as selectedOption
   * (In real case scenario, we may have logic if the clicked selection in the dropdown is valid);
   * @param selectedOption incoming option that has been selected in the dropdown
   */
  onSelect(selectedOption: string){
    this.currentlySelected = selectedOption;
    this.changeDetectorRef.detectChanges();
  }

  /**
   * This method decides if the new string should be added to the dropdown (again in real case scenario we may have logic if this should be added to the list);
   * @param newOption comming from the input field in the dropdown value
   */
  onAddOption(newOption: string){
    this.towns = [...this.towns,newOption];
    this.currentlySelected = newOption;
  }

}
