import { Component, OnInit } from '@angular/core';

import { ApiUsersService } from '../api-users.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css', '../main/main.component.css']
})
export class UsersComponent implements OnInit {
  
  users;

  constructor(private usersService: ApiUsersService) { }

  ngOnInit() {
    this.usersService.getAll().subscribe((data) => {
      console.log(data);
      this.users = data;
    }, 
    console.error);
  }

}
