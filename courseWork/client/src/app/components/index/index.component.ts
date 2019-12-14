import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(
    private route: ActivatedRoute, 
    private alerts: AlertService, 
    public auth: AuthService
    ) { }

  ngOnInit() {
    const errMsg = this.route.snapshot.queryParamMap.get('msg');
    if (errMsg) 
      setTimeout(() => this.alerts.error(errMsg), 1);
  }

}
