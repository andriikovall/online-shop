import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from '../models/user.model';

import { ApiUsersService } from '../services/apiUsers/api-users.service';
import { ConfirmSafetyComponent } from '../modals/confirm-safety/confirm-safety.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user: User;

  constructor(
    private usersService: ApiUsersService, 
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) { }

  roles: string[] = [
    'customer', 
    'manager', 
    'admin'
  ];

  selectedRole: string;

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get("id");
    this.usersService.getById(userId).subscribe((user: User) => {
      this.user = user;
      this.selectedRole = user.role;
    })
  }


  onRoleSeleted(role: string) {
    this.selectedRole = role;
  }

  onRoleChange() {
      if (this.user.role === this.selectedRole) {
        alert('Ошибка изменения роли'); //@todo сделать алерт сервис какой то
        return;
      }
      this.user.role = this.selectedRole;
      this.usersService.updateUser(this.user).subscribe(res => {
        console.log(res)
      }, console.error)
  }

}
