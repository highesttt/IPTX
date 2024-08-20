import { MediaInfoDTO } from "./media_info.dto";

export class MovieInfoDTO extends MediaInfoDTO {
    extension: string;
    duration: string;
    constructor(data: any) {
        super(data);
        this.extension = data.movie_data.container_extension;
        this.duration = data.movie_data.duration;
    }
}