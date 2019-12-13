import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-local-date-time',
  templateUrl: './local-date-time.component.html',
  styleUrls: ['./local-date-time.component.css']
})
export class LocalDateTimeComponent implements OnInit {

  @Input() rawdate;
  date: string;
  
  constructor() { }

  ngOnInit() {
    // moment().;
    this.date = moment(this.rawdate).locale('ru').format('LLLL');
  }

}
