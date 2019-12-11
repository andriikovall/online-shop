import { CartItem } from "./cartPuzzlesArray";

export class Order {
    _id: string;
    state: number;
    cart: {
        _id: string;
        puzzles: CartItem[];
    };
    user: string;
    date: Date | string;
    price: number;
    lastModified: Date | string; 
    shipping?: {
        contact: string,
        address: string,
        postNumber?: number,
        city: string
    };
}