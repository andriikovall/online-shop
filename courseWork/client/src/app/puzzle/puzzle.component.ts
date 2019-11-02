import { Component, OnInit } from '@angular/core';
import { Puzzle } from '../models/puzzle.model';
import { ActivatedRoute } from "@angular/router";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ApiPuzzlesService } from '../services/apiPuzzles/puzzles.service';

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
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    const puzzleId = this.route.snapshot.paramMap.get("id");
    this.puzzlesService.getById(puzzleId).subscribe((puzzle: Puzzle) => {
      this.puzzle = puzzle;
    })
  }

  open(content) {
    console.log(content)
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      console.log('EH')
      console.log(result);
    }, (reason) => {

    });
  }

  onDelete() {

  }

}
