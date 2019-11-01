import { Component, OnInit } from '@angular/core';
import { Puzzle } from '../models/puzzle.model';
import { ActivatedRoute } from "@angular/router";

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
    private puzzlesService: ApiPuzzlesService
  ) { }

  ngOnInit() {
    const puzzleId = this.route.snapshot.paramMap.get("id");
    this.puzzlesService.getById(puzzleId).subscribe((puzzle: Puzzle) => {
      this.puzzle = puzzle;
    })
  }

}
