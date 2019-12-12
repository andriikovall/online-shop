import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ApiUsersService } from 'src/app/services/apiUsers/api-users.service';

@Component({
  selector: 'app-telegram-widget',
  templateUrl: './telegram-widget.component.html',
  styleUrls: ['./telegram-widget.component.css']
})
export class TelegramWidgetComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private alerts: AlertService, 
    private userService: ApiUsersService
    ) { }

    @Input() updateUser = false;
    
    ngOnInit() {
      this.convertToScript(); 
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

  loginViaTelegram(user) {
    this.auth.loginViaTelegram(user).subscribe(res => {
      document.location.reload(true);
      this.alerts.success('Вы успешно вошли!');
    }, err => {
      console.log(err);
      this.alerts.info('Ошибка авторизации, попробуйте позже');
    })
  }

  connectToCurrentUser(user) {
    this.userService.addTelegram(user).subscribe(res => {
      if (res) {
        document.location.reload(true);
        setTimeout(() => this.alerts.success('Вы успешно подключили Telegram'), 1);
      }
    }, err => {
      console.log(err);
      if (err.status == 409) {
        this.alerts.error('Такой Telegram аккаунт уже исползуется другим пользователем');
      } else {
        this.alerts.error('Ошибка сервера, попробуйте позже');
      }
    })
  }

  ngAfterViewInit() {
    if (this.updateUser) {
      window['loginViaTelegram'] = this.connectToCurrentUser.bind(this);
    } else {
      window['loginViaTelegram'] = this.loginViaTelegram.bind(this);
    }
  }

}
