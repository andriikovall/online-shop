import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray , FormControl } from '@angular/forms';

import { ApiPuzzlesService } from '../services/apiPuzzles/puzzles.service';

@Component({
  selector: 'app-puzzles',
  templateUrl: './puzzles.component.html',
  styleUrls: ['./puzzles.component.css']
})

export class PuzzlesComponent implements OnInit {

  filters;
  filtersForm;

  constructor(
    private puzzlesService: ApiPuzzlesService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.puzzlesService.getFilters().subscribe((filters: any) => {
      this.filters = filters;
      const manufs = filters.manufacturers;
      const types =  filters.types;

      this.filtersForm = this.formBuilder.group({
        name: '',
        from: 0,
        to: 0,
        manufacturers: this.formBuilder.group({}),
        types: this.formBuilder.group({}) 
      });
      
      manufs.forEach(m => 
        this.filtersForm.controls.manufacturers.addControl(m.value, new FormControl(false))
      )
      types.forEach(t => 
        this.filtersForm.controls.types.addControl(t.value, new FormControl(false))
      )

    });
  }

  public onFiltersSubmit(filters) {
    console.log(filters);
  }

}
