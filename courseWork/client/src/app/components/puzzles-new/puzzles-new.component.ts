import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  imageSrc;

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
    private alerts: AlertService
  ) { }


  async setPuzzle() {
    const puzzleId = this.route.snapshot.paramMap.get('id');
    if (window.history.state.puzzle) {
      this.puzzle = window.history.state.puzzle;
      this.isEditing = true;
      this.puzzle._id = puzzleId;
    } else if (puzzleId) {
      try {
        this.puzzle = await this.puzzlesService.getById(puzzleId).toPromise() as Puzzle;
        this.isEditing = true;
      } catch (err) {
        this.alerts.warn('Ошибка сервера, попробуйте позже');
        console.log(err);
      }
    } else {
      this.puzzle = new Puzzle();
    }
  }

  async ngOnInit() {
    await this.setPuzzle();
    this.puzzlesService.getFilters().subscribe((filters: any) => {
      this.typesAndManufacturers = filters;
      this.puzzleForm = new FormGroup({
        name: new FormControl(this.puzzle.name || '',
          [Validators.required, Validators.minLength(4)]),
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


  public getPuzzleForRequest(puzzle: Puzzle) {
    const returnPuzzle = { ...this.puzzle, ...puzzle };
    returnPuzzle._id = this.route.snapshot.paramMap.get('id');
    if (this.imageSrc)
      returnPuzzle.file = this.imageSrc;
    return returnPuzzle;
  }

  public onPuzzleSubmit(value) {
    this.puzzle = this.getPuzzleForRequest(value);
    if (this.isEditing) {
      this.puzzlesService.updatePuzzleMultipart(this.puzzle, this.puzzle._id).subscribe((res: any) => {
        this.navigateToPuzzle(this.puzzle._id);
      }, (err) => {
        this.alerts.warn('Ошибка сервера, попробуйте позже');
        console.log(err);
      });
    } else {
      this.puzzlesService.insertPuzzleMultipart(this.puzzle).subscribe((res: any) => {
        this.navigateToPuzzle(res.puzzle._id);
      }, (err) => {
        this.alerts.warn('Ошибка сервера, попробуйте позже');
        console.log(err);
      });
    }
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

  onImageSelected(event) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;

      reader.readAsDataURL(file);
    }
  }

}
