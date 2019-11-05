import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { User } from '../models/user.model';

import { LoginComponent } from '../modals/login/login.component';
import { RegisterComponent } from '../modals/register/register.component';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() user: User;

  openRegistration = 'reg';
  openLogin = 'log';

  links = {
    
  }

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  loginClicked() {
    const modalRef = this.modalService.open(LoginComponent);
    modalRef.result.then(res => { 
      if (res === this.openRegistration) {
        this.registerClicked(); 
      }
    }, (reason) => {
    })
  }

  public registerClicked() {
    console.log('registerClicked');
    const modalRef = this.modalService.open(RegisterComponent);
    modalRef.result.then(res => {
      if (res == this.openLogin) {
        this.loginClicked();
      }
    }, (reason) => {
      console.log(reason);
    })

  }

}
