import { MediaType } from "../../utils/MediaType";
import { MediaDTO } from "./media.dto";

export class LiveDTO extends MediaDTO {
    stream_id: string;
    stream_icon: string;
    constructor(data: any) {
        super(data);
        this.stream_id = data.stream_id;
        this.stream_icon = data.stream_icon;
        this.type = MediaType.LIVE;
    }
}