export class Puzzle {
    _id: string;
    name: string;
    isAvailable: boolean = true;
    isWCA: boolean = true;
    description_md: string;
    photoUrl: any;
    file: any;
    typeId: string;
    price: number;
    manufacturerId: string;
    lastModified?: Date;
    rating? :number;

    public getRating() {
        this.rating = 4; 
        //@todo
        return 4;
    }
  }