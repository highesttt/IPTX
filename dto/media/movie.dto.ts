import { MediaType } from "../../utils/MediaType";
import { MediaDTO } from "./media.dto";

export class MovieDTO extends MediaDTO {
    extension: string;
    is_adult: boolean;
    constructor(data: any) {
        super(data);
        this.extension = data.container_extension;
        this.is_adult = data.is_adult;
        this.type = MediaType.MOVIE;
    }
}