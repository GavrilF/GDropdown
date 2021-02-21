import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-popup-container',
  templateUrl: './popup-container.component.html',
  styleUrls: ['./popup-container.component.scss'],
})
export class PopupContainerComponent implements OnInit {
  @ViewChild('popupContainer') popupContainer: ElementRef<HTMLElement>;

  templateRef: TemplateRef<HTMLElement>;
  templateOutletContext: object;
  directiveElementRef: ElementRef<HTMLElement>;
  visible: boolean;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  show() {
    this.visible = true;
    this.changeDetectorRef.markForCheck();
  }

  hide() {
    if(this.visible === true){
      this.visible = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  updatePopupContent(obj: {templateRef:TemplateRef<HTMLElement>,templateOutletContext: object,directiveElementRef: ElementRef<HTMLElement>}) {
    this.templateRef = obj.templateRef;
    this.templateOutletContext = obj.templateOutletContext;
    this.directiveElementRef = obj.directiveElementRef;
    this.changeDetectorRef.detectChanges();
  }

  getCurrentPopupElementRef(){
    return this.popupContainer.nativeElement;
  }

}
