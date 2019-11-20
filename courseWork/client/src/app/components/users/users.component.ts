import { Component, OnInit } from '@angular/core';

import { ApiUsersService } from '../../services/apiUsers/api-users.service';
import { PaginationInstance } from 'ngx-pagination';
import { AlertService } from 'src/app/services/alert/alert.service';


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

  constructor(
    private usersService: ApiUsersService,
    private alerts: AlertService,
  ) {
  //   this.router.routeReuseStrategy.shouldReuseRoute = function () {
  //     return false;
  //   };
  //   this.mySubscription = this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationEnd) {
  //       // Trick the Router into believing it's last link wasn't previously loaded
  //       this.router.navigated = false;
  //     }

  //   });
  }

  ngOnInit() {
    this.updateUsers()
  }


  public pageChanged(page) {
    this.config.currentPage = page;
    this.updateUsers();
  }

  public updateUsers() {
    this.users = null;
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
