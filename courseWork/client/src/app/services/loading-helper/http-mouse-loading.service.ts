import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpMouseLoadingService {

  constructor() { }

  onRequest(event: Event | any) {
    const targetElement: HTMLButtonElement = event.target;
    // document.body.style.cursor = 'wait'; 
    targetElement.disabled = true;
  }
}
