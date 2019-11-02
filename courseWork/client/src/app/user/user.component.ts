import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { User } from '../models/user.model';

import { ApiUsersService } from '../services/apiUsers/api-users.service';

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
  ) { }

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get("id");
    this.usersService.getById(userId).subscribe((user: User) => {
      this.user = user;
    })
  }
}
