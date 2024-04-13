import { MediaType } from "../../utils/MediaType";
import { MediaInfoDTO } from "./media_info.dto";

export class MovieInfoDTO extends MediaInfoDTO {
    extension: string;
    duration: string;
    stream_id: string;
    rating: string;
    constructor(data: any) {
        super(data);
        this.extension = data.movie_data.container_extension;
        // transform data.info.duration_secs to a string in the format "HHh MMm"
        const hours = Math.floor(data.info.duration_secs / 3600);
        const minutes = Math.floor((data.info.duration_secs - hours * 3600) / 60);
        this.duration = hours + 'h ' + minutes + 'm';
        this.background = data.info.backdrop_path[0] ? data.info.backdrop_path[0] : data.info.cover_big;
        this.type = MediaType.MOVIE;
        this.cover = data.info.cover_big;
        this.stream_id = data.movie_data.stream_id;
        this.rating = data.info.rating;
    }
}