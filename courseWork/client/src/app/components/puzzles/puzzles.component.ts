import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';

import { ApiPuzzlesService } from '../../services/apiPuzzles/puzzles.service';
import { PaginationInstance } from 'ngx-pagination';
import { Puzzle } from '../../models/puzzle.model';
import { AuthService } from '../../services/auth/auth.service';
import { AlertService } from '../../services/alert/alert.service';
import { CartService } from 'src/app/services/apiCarts/cart.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    isWCA?: boolean;
  } = {
      manufacturers: [],
      types: [],
      name: '',
      priceFrom: 0,
    };

  puzzles: Puzzle[];

  isWCA = true;
  isWCAIgnored = true;

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
    private cartService: CartService,
    private route: ActivatedRoute, 
    private router: Router
  ) {
  }


  initForm() {
    this.filtersForm = this.formBuilder.group({
      name: '',
      priceFrom: 0,
      priceTo: 99999,
      manufacturers: this.formBuilder.group({}),
      types: this.formBuilder.group({}),
    });
  }

  private setDefaultFilters(filters: any) {
    const manufs = filters.manufacturers;
    const types = filters.types;

    this.initForm();

    manufs.forEach(m => {
      this.currentFilters.manufacturers.push(m._id);
      this.filtersForm.controls.manufacturers.addControl(m._id, new FormControl(true))
    });

    types.forEach(t => {
      this.currentFilters.types.push(t._id);
      this.filtersForm.controls.types.addControl(t._id, new FormControl(true))
    });

  }

  setCachedFilters(cachedFilters: any, defaultFilters: any) {
    const manufs = defaultFilters.manufacturers;
    const types = defaultFilters.types;

    if (cachedFilters.isWCA !== undefined) {
      this.isWCA = cachedFilters.isWCA;
      this.isWCAIgnored = false;
    }

    this.initForm();

    manufs.forEach(m => {
      this.currentFilters.manufacturers.push(m._id);
      this.filtersForm.controls.manufacturers.addControl(m._id,
        new FormControl(cachedFilters.manufacturers.includes(m._id)));
    });

    types.forEach(t => {
      this.currentFilters.types.push(t._id);
      this.filtersForm.controls.types.addControl(t._id,
        new FormControl(cachedFilters.types.includes(t._id)));
    });

  }

  configurePage() {
    const page = this.route.snapshot.paramMap.get('page');
    if (page) {
      const pageNum = parseInt(page);
      if (!isNaN(pageNum))
        this.config.currentPage = pageNum;
    }
  }

  ngOnInit() {
    this.puzzlesService.getFilters().subscribe((defaultFilters: any) => {
      const cachedFilters = this.getCachedFilters();
      this.allFilters = defaultFilters;
      if (cachedFilters)
        this.setCachedFilters(cachedFilters, defaultFilters);
      else
        this.setDefaultFilters(defaultFilters);
      this.configurePage();
      this.updatePuzzles();
    });
  }

  getFilterNameById(filter, id: string) {
    return filter.filter(f => f._id === id)[0].value || '';
  }



  getCachedFilters() {
    const cachedFilters = sessionStorage.getItem('filters');
    console.log(cachedFilters);
    let parsedFilters;
    try {
      parsedFilters = JSON.parse(cachedFilters);
    } catch {
      parsedFilters = null;
    }
    return parsedFilters;
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
    let puzzleReqFilters = {
      manufacturers: this.currentFilters.manufacturers,
      types: this.currentFilters.types,
      priceFrom: this.currentFilters.priceFrom,
      priceTo: this.currentFilters.priceTo,
      name: this.currentFilters.name,
      isWCA: null
    };

    if (!this.isWCAIgnored)
      puzzleReqFilters.isWCA = this.isWCA;

    const limit = this.config.itemsPerPage;
    const offset = (this.config.currentPage - 1) * this.config.itemsPerPage;
    this.puzzles = null;
    this.cacheFilters();
    this.puzzlesService.getPuzzles(limit, offset, puzzleReqFilters).
      subscribe((data: any) => {
        this.puzzles = data.puzzles;
        this.totalItems = data.count;
      });
  }

  cacheFilters() {
    if (!this.isWCAIgnored)
      this.currentFilters.isWCA = this.isWCA;
    sessionStorage.setItem('filters', JSON.stringify(this.currentFilters));
  }

  public pageChanged(pageNum) {
    this.config.currentPage = pageNum;
    this.router.navigate(['puzzles', 'page', pageNum]);
    this.updatePuzzles();
  }

  public resetFilters() {
    this.isWCAIgnored = true;
    this.setDefaultFilters(this.allFilters);
  }

  buyClicked(puzzleId: string) {
    this.cartService.insertPuzzle(puzzleId).subscribe((res) => {
      this.alerts.success('Головоломка добвлена в корзину!');
    }, console.error)
  }

  onIgnoreWCAClicked(event) {
    this.isWCAIgnored = !this.isWCAIgnored;
  }

  onWCAClicked(event) {
    this.isWCA = !this.isWCA;
  }

}
