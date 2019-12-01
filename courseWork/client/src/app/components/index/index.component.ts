import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(
    private route: ActivatedRoute, 
    private alerts: AlertService
    ) { }

  ngOnInit() {
    const errMsg = this.route.snapshot.queryParamMap.get('msg');
    console.log(errMsg);
    if (errMsg) 
      setTimeout(() => this.alerts.error(errMsg), 1);
  }

}
