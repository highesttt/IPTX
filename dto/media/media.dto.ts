export class MediaDTO {
    id: number;
    name: string;
    category_ids: string[];
    tmdb: string;
    rating: string;
    type: string;
    stream_id: string;
    stream_icon: string;
    constructor(data: any) {
        this.id = data.num;
        this.name = data.name;
        this.category_ids = data.category_ids;
        this.tmdb = data.tmdb;
        this.rating = data.rating;
        this.type = 'unknown'
        this.stream_id = data.stream_id;
        this.stream_icon = data.stream_icon;
    }
}