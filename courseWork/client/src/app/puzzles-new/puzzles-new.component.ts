import { Component, OnInit, Input } from '@angular/core';

import { Puzzle } from '../models/puzzle.model';
import { ApiPuzzlesService } from '../services/apiPuzzles/puzzles.service';

import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-puzzles-new',
  templateUrl: './puzzles-new.component.html',
  styleUrls: ['./puzzles-new.component.css']
})
export class PuzzlesNewComponent implements OnInit {

  @Input()
  puzzle: Puzzle;

  puzzleForm;

  typesAndManufacturers: any;

  selectedType: any;
  selectedManufacturer: any;


  constructor(
    private puzzlesService: ApiPuzzlesService
  ) { }

  ngOnInit() {
    this.puzzlesService.getFilters().subscribe((filters: any) => {
      this.typesAndManufacturers = filters;

    });
    if (!this.puzzle) {
      this.puzzle = new Puzzle();
    }

    this.puzzleForm = new FormGroup({
      name: new FormControl(this.puzzle.name),
      isAvailable: new FormControl(this.puzzle.isAvailable),
      isWCA: new FormControl(this.puzzle.isWCA),
      description_md: new FormControl(this.puzzle.description_md),
      manufacturerId: new FormControl(this.puzzle.manufacturerId), 
      typeId: new FormControl(this.puzzle.typeId), 
      price: new FormControl(this.puzzle.price)
    });
  }

  public changeType(type) {
    this.puzzle.typeId = type;
  }

  public changeManuf(manuf) {
    this.puzzle.manufacturerId = manuf;
  }

  public onFileChanged(event) {
    const file = event.target.files[0];
    console.log(file);
  }

  public onPuzzleSubmit(value) {
    this.puzzle = value;
    console.log(value);
  }

}
