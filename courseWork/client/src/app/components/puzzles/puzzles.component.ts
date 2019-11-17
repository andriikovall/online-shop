import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';

import { ApiPuzzlesService } from '../../services/apiPuzzles/puzzles.service';
import { PaginationInstance } from 'ngx-pagination';
import { Puzzle } from '../../models/puzzle.model';
import { AuthService } from '../../services/auth/auth.service';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-puzzles',
  templateUrl: './puzzles.component.html',
  styleUrls: ['./puzzles.component.css']
})

export class PuzzlesComponent implements OnInit {

  allFilters;

  filtersForm;

  currentFilters: {
    manufacturers: any[];
    types: any[];
    name: string;
    priceFrom: number;
    priceTo?: number;
  } = {
      manufacturers: [],
      types: [],
      name: '',
      priceFrom: 0,
    };

  puzzles;


  public directionLinks: boolean = true;
  public totalItems: number;

  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 6,
    currentPage: 1
  };


  constructor(
    public auth: AuthService, 
    public alerts: AlertService,
    private puzzlesService: ApiPuzzlesService,
    private formBuilder: FormBuilder,
  ) {
  }


  private setDefaultFilters(filters: any) {
    const manufs = filters.manufacturers;
    const types = filters.types;

    this.filtersForm = this.formBuilder.group({
      name: '',
      priceFrom: 0,
      priceTo: 99999,
      manufacturers: this.formBuilder.group({}),
      types: this.formBuilder.group({})
    });

    manufs.forEach(m => {
      this.currentFilters.manufacturers.push(m._id);
      this.filtersForm.controls.manufacturers.addControl(m._id, new FormControl(true))
    })

    types.forEach(t => {
      this.currentFilters.types.push(t._id);
      this.filtersForm.controls.types.addControl(t._id, new FormControl(true))
    })
  }


  ngOnInit() {
    this.puzzlesService.getFilters().subscribe((filters: any) => {
      this.allFilters = filters;
      this.setDefaultFilters(this.allFilters);
      this.updatePuzzles();
    });
  }

  public onFiltersSubmit(filters) {
    Object.assign(this.currentFilters, filters);

    this.currentFilters.manufacturers = Object.keys(filters.manufacturers).filter((key) =>
      filters.manufacturers[key]
    );

    this.currentFilters.types = Object.keys(filters.types).filter((key) =>
      filters.types[key]
    );

    this.updatePuzzles();
  }

  public updatePuzzles() {
    const puzzleReqFilters = {
      manufacturers: this.currentFilters.manufacturers,
      types: this.currentFilters.types,
      priceFrom: this.currentFilters.priceFrom,
      priceTo: this.currentFilters.priceTo,
      name: this.currentFilters.name
    };

    const limit = this.config.itemsPerPage;
    const offset = (this.config.currentPage - 1) * this.config.itemsPerPage;
    this.puzzlesService.getPuzzles(limit, offset, puzzleReqFilters).
      subscribe((data: any) => {
        this.puzzles = data.puzzles;
        this.totalItems = data.count;
      });
  }

  public pageChanged(pageNum) {
    this.config.currentPage = pageNum;
    this.updatePuzzles();
  }

  public resetFilters() {
    this.setDefaultFilters(this.allFilters);
  }

  buyClicked(puzzleId: string) {
    this.alerts.error('Еще не реализовано');
  } 

}
