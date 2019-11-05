import { Puzzle } from './puzzle.model';

export class User {
    _id: string;
    first_name: string;
    last_name: string;
    login: string;
    password?: string;
    role: string;
    bio_md?: string;
    avaUrl: any;
    isDisabled: boolean = false;
    friends?: User[] = [];
    puzzles?: Puzzle[] = [];
    registeredAt?: Date;
}