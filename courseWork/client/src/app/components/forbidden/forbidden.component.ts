import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css']
})
export class ForbiddenComponent implements OnInit {

  message: string = 'Вы не имеете доступа к данной странице';

  constructor(
    private route: ActivatedRoute 
    ) { }

  ngOnInit() {
    const errMsg = this.route.snapshot.queryParamMap.get('msg');
    if (errMsg) 
      this.message = errMsg;
  }

}
