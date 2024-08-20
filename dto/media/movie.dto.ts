import { MediaDTO } from "./media.dto";

export class MovieDTO extends MediaDTO {
    stream_id: string;
    stream_icon: string;
    rating: string;
    extension: string;
    constructor(data: any) {
        super(data);
        this.stream_id = data.stream_id;
        this.stream_icon = data.stream_icon;
        this.extension = data.container_extension;
        this.rating = data.rating;
    }
}