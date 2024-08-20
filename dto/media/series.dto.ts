import { MediaDTO } from "./media.dto";

export class SeriesDTO extends MediaDTO {
    stream_id: string;
    stream_icon: string;
    rating: string;
    genre: string;
    constructor(data: any) {
        super(data);
        this.stream_id = data.stream_id;
        this.stream_icon = data.cover;
        this.rating = data.rating;
        this.genre = data.genre;
    }
}