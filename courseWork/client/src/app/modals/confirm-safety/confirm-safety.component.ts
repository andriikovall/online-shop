import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-confirm-safety',
  templateUrl: './confirm-safety.component.html',
  styleUrls: ['./confirm-safety.component.css']
})

export class ConfirmSafetyComponent implements OnInit {

  @Input() header: string = 'Подтвердите действие';
  @Input() text:   string = 'Вы уверены?';
  @Input() yes:    string = 'Да';
  @Input() no:     string = 'Нет';

  constructor(
    public modal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}

