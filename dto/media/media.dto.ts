export class MediaDTO {
    id: number;
    name: string;
    category_ids: string[];
    constructor(data: any) {
        this.id = data.num;
        this.name = data.name;
        this.category_ids = data.category_ids;
    }
}