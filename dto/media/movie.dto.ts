import { MediaType } from "../../utils/MediaType";
import { MediaDTO } from "./media.dto";

export class MovieDTO extends MediaDTO {
    stream_id: string;
    stream_icon: string;
    extension: string;
    is_adult: boolean;
    constructor(data: any) {
        super(data);
        this.stream_id = data.stream_id;
        this.stream_icon = data.stream_icon;
        this.extension = data.container_extension;
        this.is_adult = data.is_adult;
        this.type = MediaType.MOVIE;
    }
}