import { Component, OnInit } from '@angular/core';

import { ApiUsersService } from '../../services/apiUsers/api-users.service';
import { PaginationInstance } from 'ngx-pagination';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css', '../main/main.component.css']
})

export class UsersComponent implements OnInit {
  
  users;

  searchedName: string = '';

  totalUsers: number;

  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 6,
    currentPage: 1
  };

  constructor(private usersService: ApiUsersService) { }

  ngOnInit() {
    this.updateUsers()
  }

  
  public pageChanged(page) {
    this.config.currentPage = page;
    this.updateUsers();
  }

  public updateUsers() {
    const limit = this.config.itemsPerPage;
    const offset = (this.config.currentPage - 1) * this.config.itemsPerPage;
    this.usersService.get(limit, offset, this.searchedName).subscribe((res: any) => {
      this.users = res.users;
      this.totalUsers = res.count;
    })
  }

  onSearch() {
    this.updateUsers();
  }

}
