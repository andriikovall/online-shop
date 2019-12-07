import { Component, OnInit } from '@angular/core';

import { ApiUsersService } from '../../services/apiUsers/api-users.service';
import { PaginationInstance } from 'ngx-pagination';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Router, ActivatedRoute } from '@angular/router';


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
    private router: Router, 
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    const currentPage = this.route.snapshot.paramMap.get('page');
    if (currentPage) {
      const currentPageNum = parseInt(currentPage);
      if (currentPageNum) {
        this.config.currentPage = currentPageNum;
      }
    }
    this.updateUsers()
  }


  public pageChanged(pageNum) {
    this.config.currentPage = pageNum;
    this.router.navigate(['users', 'page', pageNum]);
    this.updateUsers();
  }

  public updateUsers() {
    this.users = null;
    const limit = this.config.itemsPerPage;
    const offset = (this.config.currentPage - 1) * this.config.itemsPerPage;
    this.usersService.get(limit, offset, this.searchedName).subscribe((res: any) => {
      this.users = res.users;
      this.totalUsers = res.count;
    }, (err) => {
      console.log(err);
      this.alerts.error('Серверная ошибка, попробуйте позже');
    })
  }

  onSearch() {
    this.updateUsers();
  }

}
