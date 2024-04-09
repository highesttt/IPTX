import { MediaDTO } from "./media.dto";

export class SeriesDTO extends MediaDTO {
    stream_id: string;
    stream_icon: string;
    genre: string;
    plot: string;
    cast: string;
    director: string;
    constructor(data: any) {
        super(data);
        this.stream_id = data.series_id;
        this.stream_icon = data.cover;
        this.genre = data.genre;
        this.plot = data.plot;
        this.cast = data.cast;
        this.director = data.director;
    }
}