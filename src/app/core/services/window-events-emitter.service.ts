import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowEventsEmitterService {

  private windowClickEventTriggered = new Subject<Event>();
  public windowClickEventTriggered$: Observable<Event> = this.windowClickEventTriggered.asObservable();

  constructor() {
    fromEvent(window, 'click').subscribe((e: Event) => {
      this.windowClickEventTriggered.next(e);
    });
   }
}
