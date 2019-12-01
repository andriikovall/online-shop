import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(
    public alerts: AlertService,
  ) { }

  ngOnInit() {
  }

  onSuccess() {
    console.log('onSuccess');
    this.alerts.success('onSuccess');
  }

  onDanger() {
    console.log('onDanger');
    this.alerts.error('onDanger');
  }

  onInfo() {
    console.log('onInfo');
    this.alerts.info('onInfo');
  }
  
  onWarning() {
    console.log('onWarning');
    this.alerts.warn('onWarning');
  }


}
