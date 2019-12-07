import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-telegram-widget',
  templateUrl: './telegram-widget.component.html',
  styleUrls: ['./telegram-widget.component.css']
})
export class TelegramWidgetComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @ViewChild('script', {static: true}) script: ElementRef;

  convertToScript() {
    const element = this.script.nativeElement;
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.setAttribute('data-telegram-login', 'KubanutyiBot');
    script.setAttribute('data-size', 'medium');
    // Callback function in global scope
    script.setAttribute('data-onauth', 'loginViaTelegram(user)');
    script.setAttribute('data-request-access', 'write');
    element.parentElement.replaceChild(script, element);
  }

  ngAfterViewInit() {
    this.convertToScript();
    window['loginViaTelegram'] = (user) => alert(user);
  }

}
