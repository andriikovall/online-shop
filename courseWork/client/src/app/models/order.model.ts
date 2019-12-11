import { CartItem } from "./cartPuzzlesArray";
import { User } from './user.model';

export class Order {
    _id: string;
    state: number;
    cart: {
        _id: string;
        puzzles: CartItem[];
    };
    user: any;
    date: Date | string;
    price: number;
    lastModified: Date | string; 
    shipping?: {
        contact: string,
        address: string,
        postNumber?: number,
        city: string, 
        comment?: string
    };
}