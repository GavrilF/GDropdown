import { ApplicationRef, ComponentRef, Directive, ElementRef, EmbeddedViewRef, EventEmitter, HostListener, Input, Output, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { PopupContainerComponent } from '../components/popup-container/popup-container.component';
import { DynamicComponentsService } from '../services/dynamic-components.service';
import { WindowEventsEmitterService } from '../services/window-events-emitter.service';

@Directive({
  selector: '[appPopup]'
})
export class PopupDirective {

  @Input() templateRef: TemplateRef<HTMLElement>;
  @Input() templateOutletContext: object;
  @Input() closeUponClick: boolean;
  @Input() adaptToElementWidth: boolean;
  @Input() initialPositionY: 'top' | 'bottom' = 'bottom';

  @Output() popupToggled: EventEmitter<boolean> = new EventEmitter();

  static popupContainerComponentRef: ComponentRef<PopupContainerComponent>;

  private _clickOutEventSubscription: Subscription;

  constructor(
    private readonly dynamicComponentsService: DynamicComponentsService,
    private readonly appRef: ApplicationRef,
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly windowEvents: WindowEventsEmitterService
  ) { 
    if (!PopupDirective.popupContainerComponentRef) {
      this.appendToBody();
    }
  }

  @HostListener('click')
  onClick() {

    const { directiveElementRef } = this.getPopupInstance();

    if (this.getPopupInstance().visible) {
      if (directiveElementRef === this.elementRef) {
        this.visible = false;
      } else {
        this.visible = false;
        this.updateInstance();
        this.updatePosition();
        this.visible = true;
      }
    } else {
      this.updateInstance();
      this.updatePosition();
      this.visible = true;
    }

  }

  private appendToBody() {
    PopupDirective.popupContainerComponentRef = this.dynamicComponentsService.createComponentElement(PopupContainerComponent);
    this.appRef.attachView(PopupDirective.popupContainerComponentRef.hostView);
    document.body.appendChild(this.getDomElement(PopupDirective.popupContainerComponentRef));
  }

  private getDomElement<T>(componentRef: ComponentRef<T>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<T>).rootNodes[0] as HTMLElement;
  }

  updatePosition() {
    if (this.getPopupInstance().directiveElementRef !== this.elementRef) {
      return;
    }

    const popupContainerElemRef = this.getPopupInstance().getCurrentPopupElementRef();
    const popupBoundingRect = popupContainerElemRef.getBoundingClientRect();

    const { left, top, width, height } = this.elementRef.nativeElement.getBoundingClientRect();

    if (this.adaptToElementWidth) {
      popupContainerElemRef.style.width = `${width}px`;
    }



    if(this.initialPositionY == 'bottom'){
      const elementFitsBeneath: boolean = top + height + popupBoundingRect.height <= window.innerHeight;
      if (elementFitsBeneath) {
        popupContainerElemRef.style.top = `${top + height}px`;
      } else {
        popupContainerElemRef.style.top = `${top - popupBoundingRect.height}px`;
      }
    }else {
      const elementFitsAbove: boolean = top - popupBoundingRect.height <= window.innerHeight;
      if (elementFitsAbove) {
        popupContainerElemRef.style.top = `${top - height - popupBoundingRect.height}px`;
      } else {
        popupContainerElemRef.style.top = `${top + height}px`;
      }
    }

    const elementFitsOnTheRight: boolean = left + popupBoundingRect.width <= window.innerWidth;

    if (elementFitsOnTheRight) {
      popupContainerElemRef.style.left = `${left}px`;
    } else {
      popupContainerElemRef.style.left = `${left + width - popupBoundingRect.width}px`;
    }
  }

  updateInstance() {
    if (!this.getPopupInstance()) {
      return;
    }

    const objToPass = {
      templateRef: this.templateRef,
      templateOutletContext: this.templateOutletContext,
      directiveElementRef: this.elementRef
    };
    this.getPopupInstance().updatePopupContent(objToPass);
  }

  getPopupInstance(): PopupContainerComponent {
    return PopupDirective.popupContainerComponentRef.instance;
  }
  getPopupElement(): HTMLElement {
    return this.getDomElement(PopupDirective.popupContainerComponentRef);
  }


  private set visible(visible: boolean) {
    if (visible) {
      this.getPopupInstance().show();
      this.subscribeForWindowClick();
    } else {
      this.getPopupInstance().hide();
      this.unsubscribeFromWindowClick();
    }

    this.popupToggled.emit(visible);
  }

  // Window clicks subscriptions (This is because we want to have global click listener only when popup is open)
  subscribeForWindowClick(){
    this._clickOutEventSubscription = this.windowEvents.windowClickEventTriggered$.subscribe((e: Event) => {
      this.onDocumentClick(e)
    })
  }

  unsubscribeFromWindowClick(){
    if( this._clickOutEventSubscription){
      this._clickOutEventSubscription.unsubscribe();
    }
  }

  onDocumentClick({ target }: Event) {

    if (this.getPopupInstance().directiveElementRef !== this.elementRef) {
      return;
    }

    if ((target as HTMLElement).classList.contains('block-screen')) {
      return;
    }

    const targetIsNotPartOfThePopup = target !== this.getPopupElement() && !this.isChildOf(this.getPopupElement(), target as HTMLElement);
    const targetIsNotPartOfTheElementRef = target !== this.elementRef.nativeElement && !this.isChildOf(this.elementRef.nativeElement, target as HTMLElement);

    if (targetIsNotPartOfThePopup && targetIsNotPartOfTheElementRef) {
      this.visible = false;
    }

    if (!targetIsNotPartOfThePopup && this.closeUponClick) {
      this.visible = false;
    }
  }


  isChildOf(parent: HTMLElement, child: HTMLElement): boolean {
    return parent.contains(child)
  }



}
