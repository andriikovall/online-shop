import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from '../../models/user.model';

import { ApiUsersService } from '../../services/apiUsers/api-users.service';
import { ConfirmSafetyComponent } from '../../modals/confirm-safety/confirm-safety.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  
  user: User;
  
  errorOrNotFound: boolean = false;

  navigationSubscription;

  constructor(
    private usersService: ApiUsersService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private alerts: AlertService,
    private router: Router,
    public auth: AuthService
    ) { 
      this.navigationSubscription = this.router.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.ngOnInit();
        }
      });
    }

            

  roles: string[] = [
    'customer',
    'manager',
  ];

  selectedRole: string;


  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get("id");
    this.usersService.getById(userId).subscribe((user: User) => {
      this.user = user;
      this.selectedRole = user.role;
    }, (err) => {
      console.log(err);
      this.errorOrNotFound = true;
    })
  }



  onRoleSeleted(role: string) {
    this.selectedRole = role;
  }

  onRoleChange() {
    if (this.user.role === this.selectedRole) {
      this.alerts.error('Ошибка изменения роли');
      return;
    }
    this.modalService.open(ConfirmSafetyComponent).result.then((res) => {
      if (res) {
        this.user.role = this.selectedRole;
        this.updateUser();
      }
    }, (reason) => {
      //
    })
  }

  onEditClicked() {
    this.router.navigate(['/users', 'update', this.user._id]);
  }

  updateUser() {
    this.usersService.updateUser(this.user).subscribe(res => {
      this.alerts.success('Пользователь обновлен');
    }, (err) => {
      this.alerts.warn('Ошибка обновления, попробуйте позже');
      console.log(err);
    });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  get canEdit() {
    return this.auth.userId === this.user._id;
  }
  
}
