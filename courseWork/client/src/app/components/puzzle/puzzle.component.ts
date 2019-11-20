import { Component, OnInit } from '@angular/core';
import { Puzzle } from '../../models/puzzle.model';
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";

import { AuthService } from '../../services/auth/auth.service';
import { ApiPuzzlesService } from '../../services/apiPuzzles/puzzles.service';

import { ConfirmComponent } from '../../modals/confirm-danger/confirm.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CartService } from 'src/app/services/apiCarts/cart.service';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.css']
})
export class PuzzleComponent implements OnInit {

  puzzle: Puzzle;

  errorOrNotFound: boolean = false;

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private puzzlesService: ApiPuzzlesService,
    private modalService: NgbModal,
    private router: Router, 
    private alerts: AlertService, 
    private cartService: CartService
  ) { }

  ngOnInit() {
    const puzzleId = this.route.snapshot.paramMap.get("id");
    this.puzzlesService.getById(puzzleId).subscribe((puzzle: Puzzle) => {
      this.puzzle = puzzle;
    }, (err) => {
      console.log(err);
      this.errorOrNotFound = true;
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
      this.alerts.info('Головоломка удалена')
      this.router.navigate(['/puzzles']);
    })
  }

  onBuyClicked() {
    this.cartService.insertPuzzle(this.puzzle._id).subscribe((res) => {
      this.alerts.success('Головоломка добвлена в корзину!');
    }, console.error)
  }

}
