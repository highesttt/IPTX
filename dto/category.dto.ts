export class CategoryDTO {
    id: string;
    name: string;
    parent_id: number;

    constructor(data: any) {
        this.id = data.category_id;
        this.name = data.category_name;
        this.parent_id = data.parent_id;
    }
}