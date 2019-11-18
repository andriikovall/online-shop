import { Puzzle } from './puzzle.model';

export class CartItem {
    _id?: string;
    count: number;
    puzzle: Puzzle;
}