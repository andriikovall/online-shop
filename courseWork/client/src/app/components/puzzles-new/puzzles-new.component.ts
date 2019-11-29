import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmSafetyComponent } from '../../modals/confirm-safety/confirm-safety.component';
import { ValidatorHelperService, forbiddenRegExpSymbols } from '../../services/validator-helper.service';

import { Puzzle } from '../../models/puzzle.model';
import { ApiPuzzlesService } from '../../services/apiPuzzles/puzzles.service';

import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { AlertService } from 'src/app/services/alert/alert.service';


@Component({
  selector: 'app-puzzles-new',
  templateUrl: './puzzles-new.component.html',
  styleUrls: ['./puzzles-new.component.css']
})
export class PuzzlesNewComponent implements OnInit {

  puzzle: Puzzle;

  file: File;

  puzzleForm: FormGroup;

  isEditing = false;

  typesAndManufacturers: any;

  forbiddenSymbols = forbiddenRegExpSymbols;

  constructor(
    private puzzlesService: ApiPuzzlesService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private alert: AlertService
  ) { }


  async setPuzzle() {
    const puzzleId = this.route.snapshot.paramMap.get('id');
    if ( window.history.state.puzzle) {
      this.puzzle = window.history.state.puzzle;
      this.isEditing = true;
      this.puzzle._id = puzzleId;
    } else if (puzzleId) {
      await this.puzzlesService.getById(puzzleId).subscribe((response: any) => {
        this.puzzle = response;
        this.isEditing = true;
      }, console.error);
    } else {
      this.puzzle = new Puzzle();
    }
    console.log(this.puzzle, 'buffer puzzle');
  }

  async ngOnInit() {
    await this.setPuzzle();
    this.puzzlesService.getFilters().subscribe((filters: any) => {
      this.typesAndManufacturers = filters;
      this.puzzleForm = new FormGroup({
        name: new FormControl(this.puzzle.name || '', 
          [Validators.required, Validators.minLength(4), ValidatorHelperService.stringWithoutRegExpSymbolsValidator]),   
        isAvailable: new FormControl(this.puzzle.isAvailable,
          [Validators.required]),
        isWCA: new FormControl(this.puzzle.isWCA,
          [Validators.required]),
        description_md: new FormControl(this.puzzle.description_md,
          [Validators.required]),
        manufacturerId: new FormControl(this.puzzle.manufacturerId._id || '',
          [Validators.required]),
        typeId: new FormControl(this.puzzle.typeId._id || '',
          [Validators.required]),
        price: new FormControl(this.puzzle.price,
          [Validators.required, Validators.min(0), Validators.max(9999999)])
      });
    });
  }

  get name() { return this.puzzleForm.get('name'); }
  get price() { return this.puzzleForm.get('price'); }
  get description_md() { return this.puzzleForm.get('description_md'); }
  get typeId() { return this.puzzleForm.get('typeId'); }
  get manufacturerId() { return this.puzzleForm.get('manufacturerId'); }

  nameIsValid() { return !(this.name.invalid && (this.name.dirty || this.name.touched)); }
  priceIsValid() { return !(this.price.invalid && (this.price.dirty || this.price.touched)); }
  description_mdIsValid() { return !(this.description_md.invalid && (this.description_md.dirty || this.description_md.touched)); }
  typeIdIsValid() { return !(this.typeId.invalid && (this.typeId.dirty || this.typeId.touched)); }
  manufacturerIdIsValid() { return !(this.manufacturerId.invalid && (this.manufacturerId.dirty || this.manufacturerId.touched)); }


  public onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  public getPuzzleForRequest(puzzle: Puzzle) {
    const returnPuzzle = { ...this.puzzle, ...puzzle};
    returnPuzzle._id = this.route.snapshot.paramMap.get('id');
    returnPuzzle.file = this.file;
    return returnPuzzle;
  }

  public onPuzzleSubmit(value) {
    this.puzzle = this.getPuzzleForRequest(value);
    console.log(this.puzzle, 'ТО что отправляется');
    const uploadFormData = this.getFormDataFromObj(this.puzzle);
    if (this.isEditing) {
      this.puzzlesService.updatePuzzleMultipart(uploadFormData, this.puzzle._id).subscribe((res: any) => {
        this.navigateToPuzzle(this.puzzle._id);
      });
    } else {
      this.puzzlesService.insertPuzzleMultipart(uploadFormData).subscribe((res: any) => {
        this.navigateToPuzzle(res.puzzle._id);
      });
    }
  }

  private getFormDataFromObj(obj: object | any) {
    const uploadFormData = new FormData();
    for (var key in obj) {
      if ((typeof obj[key]).toLowerCase() === 'file' && obj.name)
        uploadFormData.append(key, obj[key], obj.name);
      else
        uploadFormData.append(key, obj[key]);
    }
    return uploadFormData;
  }

  public navigateToPuzzle(id: string) {
    this.router.navigate(['/puzzles', id]);
  }

  public navigateBack() {
    this.location.back();
  }

  public confirmCreation(formValue) {
    const modalRef = this.modalService.open(ConfirmSafetyComponent);
    modalRef.result.then(res => {
      if (res) {
        this.onPuzzleSubmit(formValue);
      }
    }, (reason) => {
      console.log('Отмена добавления', reason);
    });
  }

}
