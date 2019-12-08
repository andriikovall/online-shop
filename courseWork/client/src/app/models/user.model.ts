import { Puzzle } from './puzzle.model';

export class User {
    _id: string;
    first_name: string;
    last_name: string;
    login: string;
    role: string;
    telegramId: number;
    contact?: string = '';
    address?: string;
    postNumber: number;
    city: string;
    bio_md?: string;
    avaUrl: string;
    file?: any; 
    isDisabled: boolean = false;
    friends?: User[] = [];
    puzzles?: Puzzle[] = [];
    registeredAt?: Date;
}