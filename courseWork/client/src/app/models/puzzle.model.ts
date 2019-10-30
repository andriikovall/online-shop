export class Puzzle {
    _id: number;
    name: string;
    isAvailable: boolean;
    isWCA: boolean;
    description_md: string;
    photoUrl: string;
    typeId: string;
    price: number;
    manufacturerId: string;
    lastModified: Date;
    rating? :number;

    public getRating() {
        this.rating = 4; 
        //@todo
        return 4;
    }
  }