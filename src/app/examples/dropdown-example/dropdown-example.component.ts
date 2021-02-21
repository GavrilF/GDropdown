import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown-example',
  templateUrl: './dropdown-example.component.html',
  styleUrls: ['./dropdown-example.component.scss']
})
export class DropdownExampleComponent implements OnInit {

  constructor() { }

  public towns: string[] = ['Sofia', 'New York', 'London', 'Paris', 'Dubai', 'Bangkok', 'Singapore', 'Seoul', 'Shanghai', 'Tokyo'];
  public currentlySelected = 'Sofia';

  ngOnInit(): void {

  }

  onSelect(selectedOption: string){
    this.currentlySelected = selectedOption;
  }

}
