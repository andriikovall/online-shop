import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-developer',
  templateUrl: './developer.component.html',
  styleUrls: ['./developer.component.css']
})

export class DeveloperComponent implements OnInit {

  selectedIndex: number;

  readmes = [
    { src: 'app/markdown/main.md', name: 'Начало' },
    { src: 'app/markdown/puzzle.md', name: 'Головоломки' }, 
    { src: 'app/markdown/user.md', name: 'Пользователи' }, 
    { src: 'app/markdown/cart.md', name: 'Корзина' }, 
    { src: 'app/markdown/order.md', name: 'Заказы' }
  ]

  constructor() { }

  ngOnInit() {
    this.selectedIndex = 0;
  }

  onNavClicked(index: number) {
    this.selectedIndex = index;
  }

  onMdError(err) {
    console.log(err);
  }

}
