import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  @Input() header: string = 'Подтвердите действие';
  @Input() text:   string = 'Вы уверены?';
  @Input() yes:    string = 'Да';
  @Input() no:     string = 'Нет';
  @Input() danger: string = ''

  constructor(
    public modal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

}
