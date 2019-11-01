import { Component, OnInit, Input } from '@angular/core';

import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { Puzzle } from '../models/puzzle.model';
import { ApiPuzzlesService } from '../services/apiPuzzles/puzzles.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}


@Component({
  selector: 'app-puzzles-new',
  templateUrl: './puzzles-new.component.html',
  styleUrls: ['./puzzles-new.component.css']
})
export class PuzzlesNewComponent implements OnInit {

  @Input()
  puzzle: Puzzle;

  puzzleForm: FormGroup;

  typesAndManufacturers: any;

  selectedType: any;
  selectedManufacturer: any;


  constructor(
    private puzzlesService: ApiPuzzlesService
  ) { }

  ngOnInit() {
    if (!this.puzzle) {
      this.puzzle = new Puzzle();
    }
    this.puzzlesService.getFilters().subscribe((filters: any) => {
      this.typesAndManufacturers = filters;
      this.puzzleForm = new FormGroup({
        name: new FormControl(this.puzzle.name,
          [Validators.required, Validators.minLength(4)]),
        isAvailable: new FormControl(this.puzzle.isAvailable || true,
          [Validators.required]),
        isWCA: new FormControl(this.puzzle.isWCA || true,
          [Validators.required]),
        description_md: new FormControl(this.puzzle.description_md,
          [Validators.required]),
        manufacturerId: new FormControl(this.puzzle.manufacturerId,
          [Validators.required]),
        typeId: new FormControl(this.puzzle.typeId,
          [Validators.required]),
        price: new FormControl(this.puzzle.price,
          [Validators.required, Validators.min(0), Validators.max(1000000)])
      });
    });
  }

  get name() { return this.puzzleForm.get('name'); }
  get price() { return this.puzzleForm.get('price'); }
  get description_md() { return this.puzzleForm.get('description_md'); }
  get typeId() { return this.puzzleForm.get('typeId') }
  get manufacturerId() { return this.puzzleForm.get('manufacturerId') }

  nameIsValid() { return !(this.name.invalid && (this.name.dirty || this.name.touched)) }
  priceIsValid() { return !(this.price.invalid && (this.price.dirty || this.price.touched)) }
  description_mdIsValid() { return !(this.description_md.invalid && (this.description_md.dirty || this.description_md.touched)) }
  typeIdIsValid() { return !(this.typeId.invalid && (this.typeId.dirty || this.typeId.touched)) }
  manufacturerIdIsValid() { return !(this.manufacturerId.invalid && (this.manufacturerId.dirty || this.manufacturerId.touched)) }


  public changeType(type) {
    this.puzzle.typeId = type;
  }

  public changeManuf(manuf) {
    this.puzzle.manufacturerId = manuf;
  }


  public onFileSeleceted(imageInput: any) {
    this.puzzle.file = imageInput.files[0];
  }

  public onPuzzleSubmit(value) {
    this.puzzle = value;
    console.log(value);
  }


}
