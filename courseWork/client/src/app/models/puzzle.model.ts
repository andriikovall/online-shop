export class Puzzle {
    _id: string;
    name: string;
    isAvailable: boolean = true;
    isWCA: boolean = true;
    description_md: string;
    photoUrl: string;
    file?: any;
    typeId: any = '';
    price: number;
    manufacturerId: any = '';
    lastModified?: Date;
    rating? :number;
  }
