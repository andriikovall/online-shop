import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-telegram-widget',
  templateUrl: './telegram-widget.component.html',
  styleUrls: ['./telegram-widget.component.css']
})
export class TelegramWidgetComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private alerts: AlertService
  ) { }

  ngOnInit() {
  }

  @ViewChild('script', { static: true }) script: ElementRef;

  convertToScript() {
    const element = this.script.nativeElement;
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?7';
    script.setAttribute('data-telegram-login', 'KubanutyiBot');
    script.setAttribute('data-size', 'medium');
    script.setAttribute('data-onauth', 'loginViaTelegram(user)');
    script.setAttribute('data-request-access', 'write');
    element.parentElement.replaceChild(script, element);
  }

  public onTelegramLogin(user) {
    this.auth.loginViaTelegram(user).subscribe(res => {
      document.location.reload(true);
      this.alerts.success('Вы успешно вошли!');
    }, err => {
      console.log(err);
      this.alerts.info('Ошибка авторизации, попробуйте позже');
    })
  }

  ngAfterViewInit() {
    this.convertToScript();
    window['loginViaTelegram'] = this.onTelegramLogin;
  }

}
