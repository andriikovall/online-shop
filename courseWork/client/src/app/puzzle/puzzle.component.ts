import { Component, OnInit } from '@angular/core';
import { Puzzle } from '../models/puzzle.model';
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";

import { ApiPuzzlesService } from '../services/apiPuzzles/puzzles.service';

import { ConfirmComponent } from '../modals/confirm-danger/confirm.component';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.css']
})
export class PuzzleComponent implements OnInit {

  puzzle: Puzzle;

  constructor(
    private route: ActivatedRoute,
    private puzzlesService: ApiPuzzlesService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit() {
    const puzzleId = this.route.snapshot.paramMap.get("id");
    this.puzzlesService.getById(puzzleId).subscribe((puzzle: Puzzle) => {
      this.puzzle = puzzle;
    })
  }

  confirm() {
    const modalRef = this.modalService.open(ConfirmComponent);
    // modalRef.componentInstance.header = 'Подтвердите действие'; 
    modalRef.result.then(res => {
      if (res)
        this.onDelete();
    }, (reason) => {
      console.log('Нельзя удалять')
    })
  }

  onDelete() {
    this.puzzlesService.deleteById(this.puzzle._id).subscribe(res => {
      console.log('HERE');
      this.router.navigate(['/puzzles']);
    })
  }

}
